import mongoose from "mongoose";
import { Subscription, UserInfo, UserDetail, Flight } from "./models";

class DB {
  async connect() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URL);
    }
  }
  async disconnect() {
    await mongoose.connection.close();
  }

  async getFlightSearchResult(options) {
    const departIataCode = options.departIataCode || "AAA",
      arriveIataCode = options.arriveIataCode || "AAE";

    try {
      const filteredFlights = await Flight.find({
        "flightDetails.departFrom.iataCode": departIataCode,
        "flightDetails.arriveTo.iataCode": arriveIataCode,
      });

      const flightResult = filteredFlights.map((flight) => {
        return {
          ...flight._doc,
          _id: flight._id.toString(),
        };
      });
      return flightResult || [];
    } catch (e) {
      console.log(e);
      return { error: "Something went wrong. Try again" };
    }
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
