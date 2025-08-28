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
import { signUpAction } from "./signUpAction";
import trackUserFlightClass from "./trackUserFlightClass";
import {
  updatePasswordAction,
  updateProfilePictureAction,
  updateCoverPhotoAction,
  updateNameAction,
  updatePhoneAction,
  updateAddressAction,
  updateDateOfBirthAction,
  addNewEmailAction,
  updateEmailAction,
  deletePaymentCardAction,
} from "./updateProfileActions";
import likeOrUnlikeAction from "./likeOrUnlikeAction";
import sendPassResetCodeAction from "./sendPassResetCodeAction";
import { sendEmailConfimationLinkAction } from "./sendEmailActions";
import resendCodeAction from "./resendCodeAction";
import setNewPasswordAction from "./setNewPasswordAction";
import flagReviewAction from "./flagReviewAction";
import {
  authenticateAction,
  authenticateWithFacebook,
  authenticateWithGoogle,
} from "./authenticateActions";
import signOutAction from "./signOutAction";
import {
  getCookiesAction,
  deleteCookiesAction,
  setCookiesAction,
} from "./cookiesActions";
import deleteAccountAction from "./deleteAccountAction";
import { validateSearchStateAction } from "./validateSearchstateAction";
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
  setCookiesAction,
  deleteCookiesAction,
  getCookiesAction,
  updatePasswordAction,
  updatePhoneAction,
  updateAddressAction,
  updateDateOfBirthAction,
  addNewEmailAction,
  updateEmailAction,
  deleteAccountAction,
  deletePaymentCardAction,
  validateSearchStateAction,
};
