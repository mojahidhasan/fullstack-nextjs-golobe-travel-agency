// in development
"use server";

import { cookies } from "next/headers";
import { auth } from "../auth";
import validateGuestForm from "../zodSchemas/hotelGuestsFormValidation";

/**
 * This function is responsible for reserving a hotel room based on the provided booking data.
 *
 * @param {{
 *   guests: Array<Object>,
 *   selectedRooms: Array<Object>
 * }} bookingData - The data required to reserve a hotel room, including guest information,
 * room selection, and any other necessary booking details.
 *
 * @returns {Promise<Object>} - Returns a promise that resolves with the result of the reservation action,
 * which may include confirmation details or error information.
 */

export default async function hotelRoomReserveAction(bookingData) {
  const session = await auth();
  const loggedIn = !!session?.user;
  if (!loggedIn) return { success: false, message: "Please login first" };

  //validation
  const { guests, selectedRooms } = bookingData;
  const searchState = cookies().get("hotelSearchState");

  let key = 0;
  let err = {};
  let data = {};
  for (const guestForm of guests) {
    const validate = validateGuestForm(guestForm);
    if (validate.success === false) {
      err = JSON.parse(JSON.stringify(err));
      err[key] = validate.errors;
    }
    if (validate.success) {
      data = JSON.parse(JSON.stringify(data));
      data[key] = validate.data;
    }
    key++;
  }

  if (Object.keys(err).length || !selectedRooms.length) {
    return {
      success: false,
      errors: { guestInfo: err, roomInfo: { message: "Please select a room" } },
    };
  }

  data = Object.values(data);
}
