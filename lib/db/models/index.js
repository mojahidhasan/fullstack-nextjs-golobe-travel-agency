import { model, models } from "mongoose";

import {
  subscriptionSchema,
  userSchema,
  anonymousUserSchema,
  flightSchema,
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
} from "../schema";

const dataModels = {
  Subscription:
    models?.Subscription || model("Subscription", subscriptionSchema),
  User: models?.User || model("User", userSchema),
  AnonymousUser:
    models?.AnonymousUser || model("AnonymousUser", anonymousUserSchema),
  Flight: models?.Flight || model("Flight", flightSchema),
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
  Util: models?.Util || model("Util", utilsSchema),
  WebsiteConfig:
    models?.WebsiteConfig || model("WebsiteConfig", websiteConfigSchema),
};

export const {
  Subscription,
  User,
  Flight,
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
  Util,
  WebsiteConfig,
} = dataModels;

export default dataModels;
