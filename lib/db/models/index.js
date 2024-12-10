import { model, models } from "mongoose";

import {
  subscriptionSchema,
  userSchema,
  flightSchema,
  accountsSchema,
  airlineSchema,
  airportSchema,
  flightBookingSchema,
  flightReviewSchema,
  hotelBookingSchema,
  hotelRoomSchema,
  hotelSchema,
  hotelReviewSchema,
  passengerSchema,
  verificationTokenSchema,
  sessionSchema,
  seatSchema,
  airplaneSchema,
  utilsSchema,
} from "../schema";

const dataModels = {
  Subscription:
    models?.Subscription || model("Subscription", subscriptionSchema),
  User: models?.User || model("User", userSchema),
  Flight: models?.Flight || model("Flight", flightSchema),
  Account: models?.Account || model("Account", accountsSchema),
  Airline: models?.Airline || model("Airline", airlineSchema),
  Airport: models?.Airport || model("Airport", airportSchema),
  FlightBooking:
    models?.FlightBooking || model("FlightBooking", flightBookingSchema),
  FlightReview:
    models?.FlightReview || model("FlightReview", flightReviewSchema),
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
  Util: models?.Util || model("Util", utilsSchema),
};

export const {
  Subscription,
  User,
  Flight,
  Account,
  Airline,
  Airport,
  FlightBooking,
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
  Util,
} = dataModels;

export default dataModels;
