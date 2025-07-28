export const ErrorCodes = {
  // ✅ General Errors
  INTERNAL_SERVER_ERROR: {
    code: "SYS_001",
    name: "InternalServerError",
    message: "Something went wrong on the server.",
  },
  SERVICE_UNAVAILABLE: {
    code: "SYS_002",
    name: "ServiceUnavailable",
    message: "Service is temporarily unavailable.",
  },
  TIMEOUT: {
    code: "SYS_003",
    name: "Timeout",
    message: "The server took too long to respond.",
  },
  DATABASE_CONNECTION_FAILED: {
    code: "SYS_004",
    name: "DatabaseConnectionFailed",
    message: "Failed to connect to the database.",
  },

  // 🔐 Authentication / Authorization
  INVALID_CREDENTIALS: {
    code: "AUTH_001",
    name: "InvalidCredentials",
    message: "Invalid email or password.",
  },
  TOKEN_EXPIRED: {
    code: "AUTH_002",
    name: "TokenExpired",
    message: "Authentication token expired.",
  },
  ACCESS_DENIED: {
    code: "AUTH_003",
    name: "AccessDenied",
    message: "You do not have permission to access this resource.",
  },
  TOO_MANY_LOGIN_ATTEMPTS: {
    code: "AUTH_004",
    name: "TooManyLoginAttempts",
    message: "Too many login attempts. Please try again later.",
  },

  // 👤 User & Account
  USER_NOT_FOUND: {
    code: "USR_001",
    name: "NotFound",
    message: "User not found.",
  },
  DUPLICATE_EMAIL: {
    code: "USR_002",
    name: "DuplicateEmail",
    message: "Email already exists.",
  },
  MISSING_USER_FIELDS: {
    code: "USR_003",
    name: "MissingFields",
    message: "Required user fields are missing.",
  },
  INVALID_USER_INPUT: {
    code: "USR_004",
    name: "InvalidFormat",
    message: "Invalid format in user data.",
  },
  UNAUTHORIZED_UPDATE: {
    code: "USR_005",
    name: "UnauthorizedUpdate",
    message: "You are not authorized to update this account.",
  },

  // ✈️ Flight
  FLIGHT_NOT_FOUND: {
    code: "FLG_001",
    name: "NotFound",
    message: "Flight not found.",
  },
  FLIGHT_FULLY_BOOKED: {
    code: "FLG_002",
    name: "FlightFullyBooked",
    message: "Flight is already fully booked.",
  },
  INVALID_FLIGHT_PARAMS: {
    code: "FLG_003",
    name: "InvalidParameters",
    message: "Invalid flight search parameters.",
  },
  SEAT_CLASS_UNAVAILABLE: {
    code: "FLG_004",
    name: "SeatClassUnavailable",
    message: "Requested seat class is not available.",
  },
  FLIGHT_BOOKING_CLOSED: {
    code: "FLG_005",
    name: "BookingClosed",
    message: "Booking for this flight is no longer available.",
  },

  // 🏨 Hotel
  HOTEL_NOT_FOUND: {
    code: "HTL_001",
    name: "NotFound",
    message: "Hotel not found.",
  },
  ROOM_ALREADY_BOOKED: {
    code: "HTL_002",
    name: "RoomAlreadyBooked",
    message: "Room already booked for selected dates.",
  },
  ROOM_ALREADY_RESERVED: {
    code: "HTL_003",
    name: "RoomAlreadyReserved",
    message: "Room already booked for selected dates.",
  },
  INVALID_BOOKING_DATES: {
    code: "HTL_004",
    name: "InvalidDates",
    message: "Invalid check-in or check-out date.",
  },
  CANNOT_CANCEL_PAST_BOOKING: {
    code: "HTL_005",
    name: "CannotCancelPastBooking",
    message: "You cannot cancel past bookings.",
  },

  // 💳 Payment
  PAYMENT_FAILED: {
    code: "PAY_001",
    name: "PaymentFailed",
    message: "Payment could not be processed.",
  },
  INVALID_CARD_DETAILS: {
    code: "PAY_002",
    name: "InvalidCardDetails",
    message: "Card details are invalid.",
  },
  DUPLICATE_PAYMENT: {
    code: "PAY_003",
    name: "DuplicatePayment",
    message: "Duplicate payment attempt detected.",
  },
  PAYMENT_NOT_ALLOWED: {
    code: "PAY_004",
    name: "PaymentNotAllowed",
    message: "This booking cannot be paid.",
  },
  PAYMENT_GATEWAY_ERROR: {
    code: "PAY_005",
    name: "PaymentGatewayError",
    message: "Error from payment service provider.",
  },

  // 📥 Validation
  MISSING_FIELDS: {
    code: "VAL_001",
    name: "MissingFields",
    message: "Some required fields are missing.",
  },
  INVALID_FORMAT: {
    code: "VAL_002",
    name: "InvalidFormat",
    message: "Input format is invalid.",
  },
  PAYLOAD_TOO_LARGE: {
    code: "VAL_003",
    name: "PayloadTooLarge",
    message: "Request payload exceeds size limits.",
  },

  // 🧱 Rate Limiting & Abuse
  TOO_MANY_REQUESTS: {
    code: "RATE_001",
    name: "TooManyRequests",
    message: "Too many requests. Slow down.",
  },
  SUSPICIOUS_ACTIVITY: {
    code: "RATE_002",
    name: "SuspiciousActivity",
    message: "Suspicious behavior detected. Access blocked.",
  },
};
export function createAppError(errorObj, status = 500) {
  const err = new Error(errorObj.message, {
    cause: {
      code: errorObj.code,
      status,
    },
  });
  err.name = errorObj.name;
  return err;
}
