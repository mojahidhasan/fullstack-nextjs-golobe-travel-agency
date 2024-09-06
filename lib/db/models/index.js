import { model, models } from "mongoose";

import {
  subscriptionSchema,
  userDetailsSchema,
  userSchema,
  flightSchema,
  accountsSchema,
  airlineSchema,
  airportSchema,
  flightBookingSchema,
  hotelBookingSchema,
  hotelRoomSchema,
  hotelSchema,
  passengerSchema,
  reviewSchema,
  verificationTokenSchema,
} from "../schema";

const dataModels = {
  Subscription:
    models?.Subscription || model("Subscription", subscriptionSchema),
  UserDetail: models?.UserDetail || model("UserDetail", userDetailsSchema),
  User: models?.User || model("User", userSchema),
  Flight: models?.Flight || model("Flight", flightSchema),
  Account: models?.Account || model("Account", accountsSchema),
  Airline: models?.Airline || model("Airline", airlineSchema),
  Airport: models?.Airport || model("Airport", airportSchema),
  FlightBooking:
    models?.FlightBooking || model("FlightBooking", flightBookingSchema),
  HotelBooking:
    models?.HotelBooking || model("HotelBooking", hotelBookingSchema),
  HotelRoom: models?.HotelRoom || model("HotelRoom", hotelRoomSchema),
  Hotel: models?.Hotel || model("Hotel", hotelSchema),
  Passenger: models?.Passenger || model("Passenger", passengerSchema),
  Review: models?.Review || model("Review", reviewSchema),
  Verification_Token:
    models?.Verification_Token ||
    model("Verification_Token", verificationTokenSchema),
};

export const {
  Subscription,
  UserDetail,
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
  Review,
  Verification_Token,
} = dataModels;
