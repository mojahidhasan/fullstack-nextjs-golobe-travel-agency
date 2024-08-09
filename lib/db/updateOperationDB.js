import { User, UserDetail } from "./models";
import { auth } from "../auth";

async function updateUser({ email, image, name, emailVerified }) {
  const userId = (await auth()).user.id;

  const objToUpdate = {};

  if (email) {
    objToUpdate.email = email;
  }
  if (image) {
    objToUpdate.image = image;
  }
  if (name) {
    objToUpdate.name = name;
  }
  if (emailVerified) {
    objToUpdate.emailVerified = emailVerified;
  }

  return User.updateOne({ _id: userId }, objToUpdate);
}

async function updateUserDetails(updatedUserDetailsObj) {
  const userId = (await auth()).user.id;

  return UserDetail.updateOne({ userId }, updatedUserDetailsObj);
}

export { updateUser, updateUserDetails };
