import { model, models } from "mongoose";

import {
  subscriptionSchema,
  userdetailsSchema,
  userinfoSchema,
  flightSchema,
} from "../schema";

const dataModels = {
  Subscription:
    models.Subscription || model("Subscription", subscriptionSchema),
  UserDetail: models.UserDetail || model("UserDetail", userdetailsSchema),
  UserInfo: models.UserInfo || model("UserInfo", userinfoSchema),
  Flight: models.Flight || model("Flight", flightSchema),
};

export const { Subscription, UserDetail, UserInfo, Flight } = dataModels;
