"use server";
import validatePassengerPreferences from "../zodSchemas/passengersPreferencesValidation";

export default async function validatePassengersPreferencesAction(
  passengersPreferencesArr,
) {
  const errors = {};
  const validatedPassengersPreferences = {};
  passengersPreferencesArr.forEach((value) => {
    const { success, errors: e, data: d } = validatePassengerPreferences(value);
    if (success === false) {
      errors[value.key] = e;
    }
    if (success === true) {
      validatedPassengersPreferences[value.key] = d;
    }
  });

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  if (Object.keys(validatedPassengersPreferences).length > 0) {
    return {
      success: true,
      data: validatedPassengersPreferences,
    };
  }
}
