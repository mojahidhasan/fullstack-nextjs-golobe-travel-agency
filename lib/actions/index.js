"use server";

import mongoose from "mongoose";

if (mongoose.connection.readyState === 0) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.log(e.message);
    throw e;
  }
}

import subscribeAction from "./subscribeAction";
import writeReviewAction from "./writeReviewAction";
import signUpAction from "./signUpAction";
import trackUserFlightClass from "./trackUserFlightClass";
import updateCoverPhotoAction from "./updateCoverPhotoAction";
import updateProfilePictureAction from "./updateProfilePictureAction";
import likeOrUnlikeAction from "./likeOrUnlikeAction";
import sendPassResetCodeAction from "./sendPassResetCodeAction";
import { sendEmailConfimationLinkAction } from "./sendEmailActions";
import resendCodeAction from "./resendCodeAction";
import updateNameAction from "./updateNameAction";
import setNewPasswordAction from "./setNewPasswordAction";
import flagReviewAction from "./flagReviewAction";
import {
  authenticateAction,
  authenticateWithFacebook,
  authenticateWithGoogle,
} from "./authenticateActions";
import signOutAction from "./signOutAction";
import setNecessaryCookiesAction from "./setNecessaryCookiesAction";
import deleteCookies from "./deleteCookies";
export {
  subscribeAction,
  writeReviewAction,
  signUpAction,
  trackUserFlightClass,
  updateCoverPhotoAction,
  updateProfilePictureAction,
  likeOrUnlikeAction,
  sendPassResetCodeAction,
  sendEmailConfimationLinkAction,
  resendCodeAction,
  updateNameAction,
  setNewPasswordAction,
  flagReviewAction,
  authenticateAction,
  authenticateWithFacebook,
  authenticateWithGoogle,
  signOutAction,
  setNecessaryCookiesAction,
  deleteCookies,
};
