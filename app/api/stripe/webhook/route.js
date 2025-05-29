import { assignSeatsToFlightBooking } from "@/lib/controllers/flights";
import { createOneDoc } from "@/lib/db/createOperationDB";
import { updateOneDoc } from "@/lib/db/updateOperationDB";
import initStripe from "@/lib/paymentIntegration/stripe";

const stripe = initStripe();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return Response.json(
      { success: false, message: err.message },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "charge.updated":
      const charge = event.data.object;
      const methodtype = charge.payment_method_details.type;
      const flightPayment = {
        bookingId: charge.metadata.flightBookingId,
        transactionId: charge.balance_transaction,
        paymentDate: charge.created,
        paymentMethod: {
          id: charge.payment_method,
          methodType: methodtype,
          brand: charge.payment_method_details[methodtype].brand,
        },
        amount: charge.amount,
        receiptUrl: charge.receipt_url,
      };
      try {
        const paymentInfo = await createOneDoc("FlightPayment", flightPayment);
        const bookingInfo = await updateOneDoc(
          "FlightBooking",
          {
            _id: charge.metadata.flightBookingId,
          },
          {
            bookingStatus: "confirmed",
            paymentStatus: "paid",
            paymentId: paymentInfo._id,
          },
        );
        await assignSeatsToFlightBooking(
          charge.metadata.flightBookingId,
          "permanent",
        );
        console.log("Received webhook:", event.type);
        return Response.json({ success: true, message: "Success" });
      } catch (err) {
        console.log(err);
        return Response.json({ success: false, message: err.message });
      }
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  return Response.json({ success: true, message: "Success" });
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
