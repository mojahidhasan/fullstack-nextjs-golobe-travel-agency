"use server";

import validatePassengerDetails from "../zodSchemas/passengerDetailsValidation";

export default async function validatePassengersDetailsAction(
  passengersDetailsArr,
) {
  const errors = {};
  const validatedPassengersDetails = {};
  passengersDetailsArr.forEach((value) => {
    const { success, errors: e, data: d } = validatePassengerDetails(value);
    if (success === false) {
      errors[value.key] = e;
    }
    if (success === true) {
      validatedPassengersDetails[value.key] = d;
    }
  });

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  if (Object.keys(validatedPassengersDetails).length > 0) {
    return {
      success: true,
      data: validatedPassengersDetails,
    };
  }
}
