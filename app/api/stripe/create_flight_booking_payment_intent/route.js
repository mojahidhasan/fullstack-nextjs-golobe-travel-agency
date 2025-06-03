import { auth } from "@/lib/auth";
import { cancelBooking, isSeatTakenByElse } from "@/lib/controllers/flights";
import { getUserDetails } from "@/lib/controllers/user";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { updateOneDoc } from "@/lib/db/updateOperationDB";
import initStripe, {
  createUniqueCustomer,
} from "@/lib/paymentIntegration/stripe";
import { usdToCents } from "@/lib/utils";
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
    const user = await getUserDetails();
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
    }

    const bookingData = await getOneDoc(
      "FlightBooking",
      {
        "flightSnapshot.flightNumber": body.flightNumber,
        userId: user._id.toString(),
        paymentStatus: "pending",
        bookingStatus: "pending",
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

    const isExpired = bookingData.temporaryReservationExpiresAt < new Date();

    if (isExpired) {
      for (const seat of bookingData.seats) {
        const isSeatTaken = await isSeatTakenByElse(
          bookingData.flightSnapshot.flightNumber,
          seat,
        );

        if (isSeatTaken) {
          const cancellationData = {
            reason:
              "Seat taken by another passenger due to expired reservation",
            canceledAt: new Date(),
            canceledBy: "system",
          };

          await cancelBooking(
            bookingData.bookingRef,
            user._id,
            cancellationData,
          );
          return Response.json({
            success: false,
            message:
              "Your seat is taken by someone else, thus we have canceled your booking",
          });
        }
      }
    }
    const stripe = initStripe();
    let idempotencyKey = bookingData.bookingRef;
    const paymentIntents = await stripe.paymentIntents.create(
      {
        amount: usdToCents(+bookingData.totalPrice),
        currency: bookingData.currency,
        payment_method: body.paymentMethodId || undefined,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: user.email,
        metadata: {
          flightNumber: bookingData.flightSnapshot.flightNumber,
          flightBookingId: bookingData._id.toString(),
          bookingRef: bookingData.bookingRef,
          userId: user._id.toString(),
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
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

function validateReqBody(data) {
  const schema = z
    .object({
      paymentMethodId: z.string().optional(),
      flightNumber: z.string(),
      shouldSavePaymentMethod: z.boolean().optional(),
    })
    .safeParse(data);

  return schema;
}
