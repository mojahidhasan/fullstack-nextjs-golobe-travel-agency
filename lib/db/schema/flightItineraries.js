import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { baggageAllowanceSchema } from "./airlines";
import { singleSegmentFareBreakdown } from "../../helpers/flights/priceCalculations";

const flightItinerarySchema = new Schema(
  {
    flightCode: { type: String, required: true },
    date: { type: Date, required: true },
    carrierInCharge: {
      type: String,
      ref: "Airline",
      required: true,
      autopopulate: true,
    },
    departureAirportId: {
      type: String,
      ref: "Airport",
      required: true,
      autopopulate: true,
    },
    arrivalAirportId: {
      type: String,
      ref: "Airport",
      required: true,
      autopopulate: true,
    },
    segmentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "FlightSegment",
        required: true,
        autopopulate: true,
      },
    ],

    totalDurationMinutes: { type: Number, required: true },
    layovers: [
      {
        fromSegmentIndex: Number,
        durationMinutes: Number,
      },
    ],
    baggageAllowance: baggageAllowanceSchema.clone(),

    status: {
      type: String,
      enum: ["scheduled", "delayed", "departed", "arrived", "cancelled"],
      default: "scheduled",
    },
    expireAt: {
      type: Date,
      required: true,
      expires: 365 * 24 * 60 * 60, // 1 year in seconds
    },
  },
  { timestamps: true },
);

flightItinerarySchema.plugin(mongooseAutoPopulate);

/**
 * Calculates the duration of a flight segment in milliseconds.
 *
 * @param {Object} segment - The flight segment object containing departure and arrival information.
 * @param {Object} segment.from - The departure details.
 * @param {Date} segment.from.scheduledDeparture - The scheduled departure date and time.
 * @param {Object} segment.to - The arrival details.
 * @param {Date} segment.to.scheduledArrival - The scheduled arrival date and time.
 * @returns {number} The duration of the flight segment in milliseconds, or 0 if the segment is invalid.
 */

export function flightDuration(segment) {
  const depart = segment.from.scheduledDeparture;
  const arrive = segment.to.scheduledArrival;
  if (!(depart instanceof Date) || !(arrive instanceof Date)) return 0;
  return arrive - depart;
}
/**
 * Calculates the total duration of a set of flight segments in milliseconds.
 *
 * @param {Array<Object>} segments - An array of flight segment objects, each containing departure and arrival information.
 * @returns {number} The total duration of all flight segments in milliseconds, or 0 if the segments is invalid.
 */
export function totalFlightDuration(segments) {
  return segments.reduce((total, segment) => {
    return total + flightDuration(segment);
  }, 0);
}

export function multiSegmentCombinedFareBreakDown(
  segments = [],
  passengersCountObj = {},
  cabinClass = "economy",
) {
  const segmentBreakdowns = segments.map((segment) =>
    singleSegmentFareBreakdown(segment, passengersCountObj, cabinClass),
  );

  const combinedBreakdown = {
    fareBreakdowns: {},
    total: 0,
  };

  Object.keys(passengersCountObj).forEach((passengerType) => {
    if (!passengersCountObj[passengerType]) return;

    combinedBreakdown.fareBreakdowns[passengerType] = {
      base: 0,
      tax: 0,
      serviceFee: 0,
      discount: 0,
      totalBeforeDiscount: 0,
      discountedTotalPerPassenger: 0,
      total: 0,
      count: passengersCountObj[passengerType],
      baseUnit: 0,
      taxUnit: 0,
      serviceFeeUnit: 0,
      discountUnit: 0,
    };

    // Sum up values from all segments
    segmentBreakdowns.forEach((segmentBreakdown) => {
      const passengerBreakdown = segmentBreakdown.fareBreakdowns[passengerType];
      if (!passengerBreakdown) return;

      Object.keys(combinedBreakdown.fareBreakdowns[passengerType]).forEach(
        (key) => {
          if (key !== "count") {
            combinedBreakdown.fareBreakdowns[passengerType][key] +=
              +passengerBreakdown[key];
          }
        },
      );
    });
  });

  combinedBreakdown.total = Object.values(
    combinedBreakdown.fareBreakdowns,
  ).reduce((sum, breakdown) => sum + +breakdown.total, 0);

  return combinedBreakdown;
}

export default flightItinerarySchema;
