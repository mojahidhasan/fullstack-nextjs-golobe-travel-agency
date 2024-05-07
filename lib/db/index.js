import db from "mongoose";
import { Subscription, UserInfo } from "./models";
const DB = {
  async connect() {
    await db.connect(process.env.MONGODB_URL);
  },
  async disconnect() {
    await db.connection.close();
  },

  async findUserInfo(email) {
    return await UserInfo.findOne({ email });
  },
  async subscribe(email) {
    if (await Subscription.exists({ email })) {
      return { exists: true };
    }
    const info = await Subscription.create({
      email,
    });
    return { subscribed: info?.subscribed };
  },
};

export const { connect, disconnect, findUserInfo, subscribe } = DB;
