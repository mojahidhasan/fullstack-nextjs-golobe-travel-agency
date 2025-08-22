import { auth } from "@/lib/auth";
import { cancelBooking, isRoomTakenByElse } from "@/lib/services/hotels";
import { getUserDetails } from "@/lib/services/user";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { HotelBooking } from "@/lib/db/models";
import { updateOneDoc } from "@/lib/db/updateOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";
import initStripe, {
  createUniqueCustomer,
} from "@/lib/paymentIntegration/stripe";
import { usdToCents } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export async function POST(req) {
  const session = await auth();
  if (!session?.user)
    return Response.json(
      { success: false, message: "Unauthenticated" },
      { status: 401 },
    );

  /**
   * @typedef {Object} PaymentIntentBody
   * @property {string} paymentMethodId - ID of the payment method to use
   * @property {string} flightBookingId - Flight booking ID
   * @property {boolean} shouldSavePaymentMethod - Whether to save the payment method for future use
   */

  /**
   * @type {PaymentIntentBody}
   */
  const body = await req.json();
  const validationBody = validateReqBody(body);
  if (validationBody.success === false) {
    return Response.json({
      success: false,
      message: "Invalid types in body props or required property is absent",
    });
  }
  try {
    const user = await getUserDetails(session.user.id, 0);
    let customerId = user?.customerId;
    if (!customerId) {
      const customer = await createUniqueCustomer(
        {
          name: user.firstName + " " + user.lastName,
          email: user.email,
        },
        null,
        ["email"],
      );
      customerId = customer.id;
      await updateOneDoc("User", { _id: user._id }, { customerId });
      revalidateTag("userDetails");
    }

    const hotel = await getOneDoc("Hotel", { slug: body.slug }, ["hotels"], 0);

    const bookingData = await HotelBooking.findOne({
      hotelId: strToObjectId(hotel._id),
      checkInDate: new Date(body.checkInDate),
      checkOutDate: new Date(body.checkOutDate),
      userId: strToObjectId(session.user.id),
      $or: [
        { bookingStatus: "pending", paymentStatus: "pending" },
        {
          bookingStatus: "confirmed",
          paymentStatus: "pending",
          paymentMethod: "cash",
        },
      ],
    }).sort({ createdAt: -1 });

    if (!bookingData) {
      return Response.json(
        { success: false, message: "No reserved hotel booking found" },
        { status: 404 },
      );
    }

    const isTakenPromise = bookingData.rooms.map(async (room) => {
      return await isRoomTakenByElse(
        room,
        body.checkInDate,
        body.checkOutDate,
        session.user.id,
      );
    });

    const isTaken = (await Promise.all(isTakenPromise)).some(Boolean);

    if (isTaken) {
      const cancelled = await cancelBooking(
        bookingData._id.toString(),
        session.user.id,
      );
      if (cancelled.modifiedCount === 0) {
        throw new Error("Failed to cancel booking");
      }
      return Response.json(
        {
          success: false,
          message:
            "Room is already taken by another person, thus booking is cancelled",
        },
        { status: 400 },
      );
    }

    const stripe = initStripe();
    let idempotencyKey = bookingData._id;
    const price = parseInt(usdToCents(+bookingData.totalPrice));
    const paymentIntents = await stripe.paymentIntents.create(
      {
        amount: price,
        currency: bookingData.currency || "usd",
        payment_method: body.paymentMethodId || undefined,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: user.email,
        metadata: {
          type: "hotelBooking",
          hotelId: hotel._id.toString(),
          hotelBookingId: bookingData._id.toString(),
          userId: user._id.toString(),
          userEmail: user.email,
        },
      },
      { idempotencyKey },
    );
    const getP = await stripe.paymentIntents.retrieve(paymentIntents.id, {});
    return Response.json(
      {
        success: true,
        message: "Success",
        data: {
          paymentIntents,
          paymentStatus: getP.status,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    const resObj = {
      success: false,
      message: "Something went wrong",
    };
    if (error.type === "StripeConnectionError")
      resObj.message = "Unable to connect";

    return Response.json(resObj, { status: 500 });
  }
}

function validateReqBody(data) {
  const schema = z
    .object({
      paymentMethodId: z.string().optional(),
      slug: z.string(),
      checkInDate: z.union([z.string(), z.number()]),
      checkOutDate: z.union([z.string(), z.number()]),
      shouldSavePaymentMethod: z.boolean().optional(),
    })
    .safeParse(data);

  return schema;
}
