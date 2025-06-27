import { cookies } from "next/headers";
import { createManyDocs } from "../db/createOperationDB";
import validatePassengersDetailsAction from "./validatePassengerDetailsAction";
import validatePassengersPreferencesAction from "./validatePassengersPreferencesAction";

export default async function createPassengersAction(
  detailsArr,
  preferencesArr,
  mongodbSession,
) {
  const pDetailsValidation = await validatePassengersDetailsAction(detailsArr);
  const pPreferencesValidation =
    await validatePassengersPreferencesAction(preferencesArr);

  if (
    pDetailsValidation?.success === false ||
    pPreferencesValidation?.success === false
  ) {
    return {
      success: false,
      errors: {
        passengersPreferences: pPreferencesValidation?.errors,
        passengersDetails: pDetailsValidation?.errors,
      },
    };
  }

  const searchState = JSON.parse(
    cookies().get("flightSearchState")?.value || "{}",
  );
  if (Object.keys(searchState).length === 0) {
    return {
      success: false,
      message: "No search state found, please search again",
    };
  }

  const passengersDetailsArr = Object.entries(pDetailsValidation.data).map(
    ([keyI, p]) => {
      const preferences = Object.entries(pPreferencesValidation.data).find(
        ([keyJ, pref]) => keyI === keyJ,
      )[1];
      const preferencesObj = {
        seatPreferences: {
          position: preferences.seating.position,
          location: preferences.seating.location,
          legroom: preferences.seating.legroom,
          quietZone: preferences.seating.quietZone,
        },
        baggagePreferences: {
          type: preferences.baggage.type,
          extraAllowance: preferences.baggage.extraAllowance,
        },
        mealPreferences: {
          type: preferences.meal.type,
          specialMealType: preferences.meal.specialMealType,
        },
        specialAssistance: {
          wheelChair: preferences.specialAssistance.wheelChair,
          boarding: preferences.specialAssistance.boarding,
          elderlyInfant: preferences.specialAssistance.elderlyInfant,
          medicalEquipment: preferences.specialAssistance.medicalEquipment,
        },
        other: {
          entertainment: preferences.other.entertainment,
          wifi: preferences.other.wifi,
          powerOutlet: preferences.other.powerOutlet,
        },
      };
      return {
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: new Date(p.dateOfBirth),
        gender: p.gender,
        passengerType: p.passengerType.toLowerCase(),
        email: p.email,
        phoneNumber: {
          dialCode: p.phoneNumber.dialCode,
          number: p.phoneNumber.number,
        },
        // address: p.address,
        passportNumber: p.passportNumber,
        passportExpiryDate: new Date(p.passportExpiryDate),
        country: p.country,
        seatClass: searchState.class,
        // visaDetails: p.visaDetails,
        frequentFlyerNumber: p.frequentFlyerNumber || null,
        frequentFlyerAirline: p.frequentFlyerAirline || null,
        preferences: preferencesObj,
        isPrimary: p.isPrimary,
      };
    },
  );

  try {
    const passengers = await createManyDocs("Passenger", passengersDetailsArr, {
      session: mongodbSession,
    });
    return { success: true, data: passengers, message: "Passengers created" };
  } catch (e) {
    return { success: false, message: "Failed to create passengers" };
  }
}
