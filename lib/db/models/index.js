import { model, models } from "mongoose";

import {
  subscriptionSchema,
  userSchema,
  anonymousUserSchema,
  flightItinerarySchema,
  flightSegmentSchema,
  flightSeatsSchema,
  accountsSchema,
  airlineSchema,
  airlineFlightPricesSchema,
  airportSchema,
  flightBookingSchema,
  flightReviewSchema,
  flightPaymentSchema,
  hotelBookingSchema,
  hotelRoomSchema,
  hotelSchema,
  hotelReviewSchema,
  passengerSchema,
  verificationTokenSchema,
  sessionSchema,
  seatSchema,
  airplaneSchema,
  promoCodeSchema,
  utilsSchema,
  websiteConfigSchema,
  analyticsSchema,
} from "../schema";

const dataModels = {
  Subscription:
    models?.Subscription || model("Subscription", subscriptionSchema),
  User: models?.User || model("User", userSchema),
  AnonymousUser:
    models?.AnonymousUser || model("AnonymousUser", anonymousUserSchema),
  FlightItinerary:
    models?.FlightItinerary || model("FlightItinerary", flightItinerarySchema),
  FlightSegment:
    models?.FlightSegment || model("FlightSegment", flightSegmentSchema),
  FlightSeat: models?.FlightSeat || model("FlightSeat", flightSeatsSchema),
  Account: models?.Account || model("Account", accountsSchema),
  Airline: models?.Airline || model("Airline", airlineSchema),
  AirlineFlightPrice:
    models?.AirlineFlightPrice ||
    model("AirlineFlightPrice", airlineFlightPricesSchema),
  Airport: models?.Airport || model("Airport", airportSchema),
  FlightBooking:
    models?.FlightBooking || model("FlightBooking", flightBookingSchema),
  FlightReview:
    models?.FlightReview || model("FlightReview", flightReviewSchema),
  FlightPayment:
    models?.FlightPayment || model("FlightPayment", flightPaymentSchema),
  HotelBooking:
    models?.HotelBooking || model("HotelBooking", hotelBookingSchema),
  HotelRoom: models?.HotelRoom || model("HotelRoom", hotelRoomSchema),
  Hotel: models?.Hotel || model("Hotel", hotelSchema),
  Passenger: models?.Passenger || model("Passenger", passengerSchema),
  HotelReview: models?.HotelReview || model("HotelReview", hotelReviewSchema),
  Verification_Token:
    models?.Verification_Token ||
    model("Verification_Token", verificationTokenSchema),
  Session: models?.Session || model("Session", sessionSchema),
  Seat: models?.Seat || model("Seat", seatSchema),
  Airplane: models?.Airplane || model("Airplane", airplaneSchema),
  PromoCode: models?.PromoCode || model("PromoCode", promoCodeSchema),
  WebsiteConfig:
    models?.WebsiteConfig || model("WebsiteConfig", websiteConfigSchema),
  Analytic: models?.Analytic || model("Analytic", analyticsSchema),
};

export const {
  Subscription,
  User,
  FlightItinerary,
  FlightSegment,
  FlightSeat,
  Account,
  Airline,
  AirlineFlightPrice,
  Airport,
  FlightBooking,
  FlightPayment,
  HotelBooking,
  HotelRoom,
  Hotel,
  Passenger,
  FlightReview,
  HotelReview,
  Verification_Token,
  Session,
  Seat,
  Airplane,
  PromoCode,
  WebsiteConfig,
  Analytic,
} = dataModels;

export default dataModels;
