import { auth } from "@/lib/auth";
import { cancelBooking, isSeatTakenByElse } from "@/lib/services/flights";
import { getUserDetails } from "@/lib/services/user";
import { getOneDoc } from "@/lib/db/getOperationDB";
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

    const flightItinerary = await getOneDoc(
      "FlightItinerary",
      {
        flightCode: body.flightNumber,
        date: new Date(body.flightDateTimestamp),
      },
      ["flight"],
      0,
    );
    const bookingData = await getOneDoc(
      "FlightBooking",
      {
        flightItineraryId: strToObjectId(flightItinerary._id),
        userId: strToObjectId(user._id),
        paymentStatus: "pending",
        ticketStatus: "pending",
      },
      ["userFlightBooking"],
      0,
    );
    if (Object.keys(bookingData).length < 1) {
      return Response.json({
        success: false,
        message: "There is no pending flight booking",
      });
    }

    const isSeatTakenPromise = bookingData.selectedSeats.map(async (el) => {
      return await isSeatTakenByElse(el.seatId._id, el.passengerId);
    });

    const isTaken = (await Promise.all(isSeatTakenPromise)).some(Boolean);

    if (isTaken) {
      const cancellationData = {
        reason: "Seat taken by another passenger due to expired reservation",
        canceledAt: new Date(),
        canceledBy: "system",
      };

      await cancelBooking(bookingData.pnrCode, cancellationData);
      return Response.json({
        success: false,
        message:
          "Your seat is taken by someone else, thus we have canceled your booking",
      });
    }

    const stripe = initStripe();
    let idempotencyKey = bookingData.pnrCode;
    const price = parseInt(usdToCents(+bookingData.totalFare));
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
          type: "flightBooking",
          flightItineraryId: flightItinerary._id.toString(),
          flightBookingId: bookingData._id.toString(),
          pnrCode: bookingData.pnrCode,
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
      flightNumber: z.string(),
      flightDateTimestamp: z.union([z.string(), z.number()]),
      shouldSavePaymentMethod: z.boolean().optional(),
    })
    .safeParse(data);

  return schema;
}
