import emailDefaultData from "@/data/emailDefaultData";
import { assignSeatsToFlightBooking } from "@/lib/controllers/flights";
import { createOneDoc } from "@/lib/db/createOperationDB";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { updateOneDoc } from "@/lib/db/updateOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";
import sendEmail from "@/lib/email/sendEmail";
import { flightBookingConfirmedEmailTemplate } from "@/lib/email/templates";
import initStripe from "@/lib/paymentIntegration/stripe";
import mongoose from "mongoose";
import { revalidateTag } from "next/cache";

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
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        if (charge.metadata?.type === "flightBooking") {
          const flightPayment = {
            bookingId: charge.metadata.flightBookingId,
            transactionId: charge.balance_transaction,
            paymentDate: charge.created,
            paymentMethod: {
              id: charge.payment_method,
              methodType: methodtype,
              brand: charge.payment_method_details[methodtype].brand,
              last4: charge.payment_method_details[methodtype].last4,
            },
            amount: charge.amount,
            receiptUrl: charge.receipt_url,
          };

          const booking = await getOneDoc(
            "FlightBooking",
            {
              _id: strToObjectId(charge.metadata.flightBookingId),
            },
            ["userFlightBooking"],
            0,
          );
          try {
            const paymentInfo = await createOneDoc(
              "FlightPayment",
              flightPayment,
              { session },
            );
            const bookingInfo = await updateOneDoc(
              "FlightBooking",
              {
                _id: charge.metadata.flightBookingId,
              },
              {
                ticketStatus: "confirmed",
                paymentStatus: "paid",
                paymentId: paymentInfo._id,
                bookedAt: new Date(charge.created * 1000),
              },
              { session },
            );

            await assignSeatsToFlightBooking(booking, "permanent", 0, session);
            await session.commitTransaction();
          } catch (err) {
            console.log(err);
            if (session.inTransaction()) {
              await session.abortTransaction();
            }
            return Response.json({ success: false, message: err.message });
          } finally {
            await session.endSession();
            revalidateTag("userFlightBooking");
          }

          const flight = await getOneDoc(
            "FlightItinerary",
            {
              _id: strToObjectId(booking.flightItineraryId),
            },
            ["flight"],
            0,
          );
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

          const { emailFlightDetails, emailBookingDetails } =
            processFlightBookingDataForEmail(flight, booking);

          const htmlEmail = flightBookingConfirmedEmailTemplate({
            ...emailDefaultData,
            main: {
              manageBookingUrl:
                baseUrl + `/user/my_bookings/flights/${booking._id}`,
              downloadTicketUrl:
                baseUrl + `/user/my_bookings/flights/${booking._id}/ticket`,
              flightDetails: emailFlightDetails,
              bookingDetails: emailBookingDetails,
            },
          });
          await sendEmail(
            [{ Email: charge.metadata.userEmail }],
            "Thank you for booking flight with golobe",
            htmlEmail,
          );
        }
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

function processFlightBookingDataForEmail(dbFlightData, dbBookingData) {
  return {
    emailFlightDetails: {
      itineraryFlightNumber: dbFlightData.flightCode,
      segments: dbFlightData.segmentIds.map((s) => ({
        flightNumber: s.flightNumber,
        airlineName: s.airlineId.name,
        departureDateTime: s.from.scheduledDeparture,
        departureAirportName: s.from.airport.name,
        departureAirportIataCode: s.from.airport.iataCode,
        arrivalDateTime: s.to.scheduledArrival,
        arrivalAirportName: s.to.airport.name,
        arrivalAirportIataCode: s.to.airport.iataCode,
        totalDurationMinutes: s.durationMinutes,
        airplaneModelName: s.airplaneId.model,
      })),
    },
    emailBookingDetails: {
      pnrCode: dbBookingData.pnrCode,
      userTimeZone: dbBookingData.userTimeZone,
      totalfare: dbBookingData.totalFare,
      currency: dbBookingData.currency || "USD",
      bookedAt: dbBookingData.bookedAt || dbBookingData.createdAt,
      ticketType: "refundable",
      fareClass: "",
      paymentMethod: {
        brand: dbBookingData.paymentId.paymentMethod.brand,
        last4: dbBookingData.paymentId.paymentMethod.last4,
        receiptUrl: dbBookingData.paymentId.receiptUrl,
      },
      passengers: dbBookingData.passengers.map((p) => {
        const seat = dbBookingData.selectedSeats.find(
          (s) => s.passengerId === p._id,
        );

        return {
          firstName: p.firstName,
          lastName: p.lastName,
          seatNumber: seat.seatId.seatNumber,
          seatClass: seat.seatId.class,
          passengerType: p.passengerType,
        };
      }),
    },
  };
}
