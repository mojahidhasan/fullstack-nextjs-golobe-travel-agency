/**
 * @description
 * Parse hotel check-in or check-out policy time from string in format HH:MM
 * into an object with hour and minute properties.
 *
 * @example
 * parseHotelCheckInOutPolicy("12:00") // {hour: 12, minute: 0}
 * parseHotelCheckInOutPolicy("12:59") // {hour: 12, minute: 59}
 *
 * @param {string} checkInOrOut - time string in format HH:MM
 * @returns {{hour: number, minute: number}} - parsed time object
 * @throws {Error} - if the input string is not in the correct format
 */
export function parseHotelCheckInOutPolicy(checkInOrOut) {
  const timeStrRegex = /(\d{2}):(\d{2})/g;
  const isValid = timeStrRegex.test(checkInOrOut);

  if (!isValid) {
    throw new Error(
      "Invalid time format. Expected HH:MM format. Got: " + checkInOrOut,
    );
  }

  const result = {};

  const timeArr = checkInOrOut.split(":");
  result.hour = Number(timeArr[0]);
  result.minute = Number(timeArr[1]);

  return result;
}
