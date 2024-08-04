import { model, models } from "mongoose";

import {
  subscriptionSchema,
  userDetailsSchema,
  userSchema,
  flightSchema,
  accountsSchema,
} from "../schema";

const dataModels = {
  Subscription:
    models?.Subscription || model("Subscription", subscriptionSchema),
  UserDetail: models?.UserDetail || model("UserDetail", userDetailsSchema),
  UserInfo: models?.User || model("User", userSchema),
  Flight: models?.Flight || model("Flight", flightSchema),
  Account: models?.Account || model("Account", accountsSchema),
};

export const { Subscription, UserDetail, UserInfo, Flight } = dataModels;
