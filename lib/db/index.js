import mongoose from "mongoose";
import { Subscription, UserInfo, UserDetail } from "./models";
class DB {
  async connect() {
    if (mongoose.connection.readyState === 0) {
      console.log("db connecting");
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("db connected");
    }
  }
  async disconnect() {
    await mongoose.connection.close();
    console.log("db disconnected");
  }

  async findUserInfo(email) {
    return await UserInfo.findOne({ email });
  }
  async findUserDetails(email) {
    try {
      const data = await UserDetail.findOne({
        "profileInfo.email.username": email,
      });

      return data;
    } catch (err) {
      console.log(err);
      throw new Error("User not found");
    }
  }
  async createUserInfo({ email, password }) {
    if (await UserInfo.exists({ email }))
      throw new Error("User already exists");
    return await UserInfo.create({ email, password });
  }
  async createUserDetails(userInfo) {
    const profileData = {
      email: [{ username: userInfo["email"], verified: false }],
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      images: {
        avatar: userInfo.image["avatar"],
        cover: userInfo.image["cover"],
      },
    };

    //if user form contain phone number, then add it, else do nothing
    if (userInfo.phone) {
      profileData.phone = {
        number: userInfo.phone,
        verified: false,
      };
    }

    if (
      await UserDetail.exists({
        "profileInfo.email.username": userInfo.email,
      })
    ) {
      throw new Error("User already exists");
    }
    try {
      const profile = await UserDetail.create({ profileInfo: profileData });
      return profile;
    } catch (err) {
      throw err;
    }
  }

  async updateUserDetails(data) {
    try {
      await UserDetail.updateOne(
        { _id: data._id },
        { profileInfo: data.profileInfo }
      );
    } catch (err) {
      throw err;
    }
  }
  // async subscribe(email) {
  //   if (await Subscription.exists({ email })) {
  //     return new Error("User already exists");
  //   }
  //   const info = await Subscription.create({
  //     email,
  //   });
  //   return { subscribed: info?.subscribed };
  // }
}

const db = new DB();
export default db;
