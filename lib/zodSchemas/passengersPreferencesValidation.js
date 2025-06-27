import { z } from "zod";

export const passengersPreferencesValidation = z.object({
  seating: z.object({
    position: z.enum(["window", "aisle", "middle", "exit", "any"], {
      message: "Only 'window', 'aisle', 'middle', 'exit' and 'any' are allowed",
      required_error: "Position is required",
    }),
    location: z.enum(["front", "middle", "back", "any"], {
      message: "Only 'front', 'middle', 'back' and 'any' are allowed",
      required_error: "Location is required",
    }),
    legroom: z.enum(["extra", "standard", "none"], {
      message: "Only 'extra', 'standard' and 'none' are allowed",
      required_error: "Legroom is required",
    }),
    quietZone: z.boolean(),
  }),
  baggage: z.object({
    type: z.enum(["carry-on", "checked", "any"], {
      message: "Only 'carry-on', 'checked' and 'none' are allowed",
      required_error: "Baggage type is required",
    }),
    extraAllowance: z.boolean(),
  }),
  meal: z.object({
    type: z.enum(
      [
        "vegan",
        "halal",
        "kosher",
        "child",
        "diabetic",
        "vegetarian",
        "gluten-free",
        "standard",
      ],
      {
        message:
          "Only 'vegan', 'halal', 'kosher', 'child', 'diabetic', 'vegetarian', 'gluten-free' and 'standard' are allowed",
        required_error: "Meal type is required",
      },
    ),
    specialMealType: z.string().optional(),
  }),
  specialAssistance: z.object({
    wheelchair: z.boolean(),
    boarding: z.boolean(),
    elderlyInfant: z.boolean(),
    medicalEquipment: z.boolean(),
  }),
  other: z.object({
    entertainment: z.boolean(),
    wifi: z.boolean(),
    powerOutlet: z.boolean(),
  }),
});

/**
 *
 * @typedef {Object} PassengerPreferencesZodError
 * @property {string} [seating.position]
 * @property {string} [seating.location]
 * @property {string} [seating.legroom]
 * @property {string} [seating.quietZone]
 * @property {string} [baggage.type]
 * @property {string} [baggage.extraAllowance]
 * @property {string} [meal.type]
 * @property {string} [meal.specialMealType]
 * @property {string} [specialAssistance.wheelchair]
 * @property {string} [specialAssistance.boarding]
 * @property {string} [specialAssistance.elderlyInfant]
 * @property {string} [specialAssistance.medicalEquipment]
 * @property {string} [other.entertainment]
 * @property {string} [other.wifi]
 * @property {string} [other.powerOutlet]
 */

function validatePassengerPreferences(preference) {
  const {
    success: s,
    error,
    data,
  } = passengersPreferencesValidation.safeParse(preference);
  let errors;
  let success = s;
  if (s === false) {
    success = false;
    errors = {};
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
  }
  return { success, errors, data };
}

export default validatePassengerPreferences;
