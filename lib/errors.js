// not used yet. Will be further modified

export const ERROR_CATEGORIES = {
  SYSTEM: "SYSTEM",
  AUTHENTICATION: "AUTHENTICATION",
  AUTHORIZATION: "AUTHORIZATION",
  VALIDATION: "VALIDATION",
  BUSINESS_LOGIC: "BUSINESS_LOGIC",
  EXTERNAL_SERVICE: "EXTERNAL_SERVICE",
  RATE_LIMITING: "RATE_LIMITING",
  SECURITY: "SECURITY",
};

export const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

export const ErrorCodes = {
  //SYS
  INTERNAL_SERVER_ERROR: {
    code: "SYS_001",
    category: ERROR_CATEGORIES.SYSTEM,
    name: "InternalServerError",
    message:
      "We're experiencing technical difficulties. Please try again in a few moments.",
    userMessage: "Something went wrong on our end. We're working to fix it.",
    statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    retryable: true,
    guidance:
      "Please try again in a few minutes. If the problem persists, contact support.",
  },

  SERVICE_UNAVAILABLE: {
    code: "SYS_002",
    category: ERROR_CATEGORIES.SYSTEM,
    name: "ServiceUnavailable",
    message:
      "The service is temporarily unavailable due to maintenance or high load.",
    userMessage: "We're temporarily unavailable. Please check back soon.",
    statusCode: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
    retryable: true,
    guidance: "Please try again later. We're working to restore service.",
  },

  DATABASE_CONNECTION_FAILED: {
    code: "SYS_003",
    category: ERROR_CATEGORIES.SYSTEM,
    name: "DatabaseConnectionFailed",
    message: "Unable to connect to the database. Please try again.",
    userMessage: "We're having trouble accessing your data. Please try again.",
    statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    retryable: true,
    guidance:
      "Please try again in a moment. If the issue persists, contact support.",
  },

  EXTERNAL_API_TIMEOUT: {
    code: "SYS_004",
    category: ERROR_CATEGORIES.EXTERNAL_SERVICE,
    name: "ExternalApiTimeout",
    message: "External service request timed out. Please try again.",
    userMessage:
      "We're having trouble connecting to our partners. Please try again.",
    statusCode: HTTP_STATUS_CODES.GATEWAY_TIMEOUT,
    retryable: true,
    guidance:
      "Please try again. If the issue continues, try a different search.",
  },

  //  AUTH
  INVALID_CREDENTIALS: {
    code: "AUTH_001",
    category: ERROR_CATEGORIES.AUTHENTICATION,
    name: "InvalidCredentials",
    message: "The provided email or password is incorrect.",
    userMessage: "Email or password is incorrect. Please check and try again.",
    statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
    retryable: false,
    guidance:
      "Please verify your email and password. You can reset your password if needed.",
  },

  TOKEN_EXPIRED: {
    code: "AUTH_002",
    category: ERROR_CATEGORIES.AUTHENTICATION,
    name: "TokenExpired",
    message: "Your session has expired. Please log in again.",
    userMessage: "Your session has expired. Please log in again.",
    statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
    retryable: false,
    guidance: "Please log in again to continue.",
  },

  TOKEN_INVALID: {
    code: "AUTH_003",
    category: ERROR_CATEGORIES.AUTHENTICATION,
    name: "TokenInvalid",
    message: "The provided authentication token is invalid or malformed.",
    userMessage: "Please log in again to continue.",
    statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
    retryable: false,
    guidance: "Please log in again to refresh your session.",
  },

  TOO_MANY_LOGIN_ATTEMPTS: {
    code: "AUTH_004",
    category: ERROR_CATEGORIES.SECURITY,
    name: "TooManyLoginAttempts",
    message: "Too many failed login attempts. Account temporarily locked.",
    userMessage: "Too many failed attempts. Please try again in 15 minutes.",
    statusCode: HTTP_STATUS_CODES.TOO_MANY_REQUESTS,
    retryable: true,
    guidance:
      "Please wait 15 minutes before trying again, or reset your password.",
  },

  EMAIL_NOT_VERIFIED: {
    code: "AUTH_005",
    category: ERROR_CATEGORIES.AUTHENTICATION,
    name: "EmailNotVerified",
    message:
      "Email address has not been verified. Please verify your email first.",
    userMessage: "Please verify your email address before continuing.",
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    retryable: false,
    guidance: "Check your email for a verification link, or request a new one.",
  },

  // Authorization Errors (AUTHZ_XXX)
  ACCESS_DENIED: {
    code: "AUTHZ_001",
    category: ERROR_CATEGORIES.AUTHORIZATION,
    name: "AccessDenied",
    message: "You do not have permission to access this resource.",
    userMessage: "You don't have permission to access this.",
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    retryable: false,
    guidance: "Please contact support if you believe this is an error.",
  },

  INSUFFICIENT_PERMISSIONS: {
    code: "AUTHZ_002",
    category: ERROR_CATEGORIES.AUTHORIZATION,
    name: "InsufficientPermissions",
    message:
      "Your account does not have sufficient permissions for this action.",
    userMessage: "You don't have permission to perform this action.",
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    retryable: false,
    guidance: "Please upgrade your account or contact support for assistance.",
  },

  // User & Account Errors (USR_XXX)
  USER_NOT_FOUND: {
    code: "USR_001",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "UserNotFound",
    message: "User account not found with the provided identifier.",
    userMessage: "User account not found.",
    statusCode: HTTP_STATUS_CODES.NOT_FOUND,
    retryable: false,
    guidance: "Please check your account details or contact support.",
  },

  DUPLICATE_EMAIL: {
    code: "USR_002",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "DuplicateEmail",
    message: "An account with this email address already exists.",
    userMessage: "An account with this email already exists.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance: "Please use a different email or try logging in with this email.",
  },

  ACCOUNT_LOCKED: {
    code: "USR_003",
    category: ERROR_CATEGORIES.SECURITY,
    name: "AccountLocked",
    message: "Account has been locked due to suspicious activity.",
    userMessage:
      "Your account has been temporarily locked for security reasons.",
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    retryable: true,
    guidance: "Please contact support to unlock your account.",
  },

  ACCOUNT_DELETED: {
    code: "USR_004",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "AccountDeleted",
    message: "This account has been deleted and is no longer accessible.",
    userMessage: "This account has been deleted.",
    statusCode: HTTP_STATUS_CODES.NOT_FOUND,
    retryable: false,
    guidance: "Please create a new account to continue.",
  },

  // Flight Errors (FLG_XXX)
  FLIGHT_NOT_FOUND: {
    code: "FLG_001",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "FlightNotFound",
    message: "The requested flight could not be found.",
    userMessage: "Flight not found. It may have been removed or changed.",
    statusCode: HTTP_STATUS_CODES.NOT_FOUND,
    retryable: false,
    guidance: "Please search for available flights or try different dates.",
  },

  FLIGHT_FULLY_BOOKED: {
    code: "FLG_002",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "FlightFullyBooked",
    message:
      "This flight is fully booked for the requested number of passengers.",
    userMessage: "This flight is fully booked for your party size.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance: "Try searching for alternative flights or different dates.",
  },

  FLIGHT_BOOKING_CLOSED: {
    code: "FLG_003",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "FlightBookingClosed",
    message:
      "Booking for this flight is no longer available (too close to departure).",
    userMessage: "Booking for this flight is no longer available.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance: "Please search for flights with later departure times.",
  },

  SEAT_CLASS_UNAVAILABLE: {
    code: "FLG_004",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "SeatClassUnavailable",
    message: "The requested seat class is not available for this flight.",
    userMessage: "The selected seat class is not available.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance:
      "Please select a different seat class or search for alternative flights.",
  },

  FLIGHT_PRICE_CHANGED: {
    code: "FLG_005",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "FlightPriceChanged",
    message: "The flight price has changed since your last search.",
    userMessage: "The flight price has changed. Please review the new price.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance: "Please confirm the new price to continue with your booking.",
  },

  FLIGHT_SCHEDULE_CHANGED: {
    code: "FLG_006",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "FlightScheduleChanged",
    message: "The flight schedule has changed. Please review the new times.",
    userMessage:
      "The flight schedule has changed. Please review the new times.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance:
      "Please review the new schedule and confirm if you'd like to proceed.",
  },

  // Hotel Errors (HTL_XXX)
  HOTEL_NOT_FOUND: {
    code: "HTL_001",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "HotelNotFound",
    message: "The requested hotel could not be found.",
    userMessage:
      "Hotel not found. It may have been removed or is no longer available.",
    statusCode: HTTP_STATUS_CODES.NOT_FOUND,
    retryable: false,
    guidance: "Please search for other hotels in the area.",
  },

  ROOM_NOT_AVAILABLE: {
    code: "HTL_002",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "RoomNotAvailable",
    message: "The requested room type is not available for the selected dates.",
    userMessage: "This room type is not available for your selected dates.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance: "Try different dates or select a different room type.",
  },

  INVALID_BOOKING_DATES: {
    code: "HTL_003",
    category: ERROR_CATEGORIES.VALIDATION,
    name: "InvalidBookingDates",
    message: "The selected check-in or check-out dates are invalid.",
    userMessage: "Please select valid check-in and check-out dates.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: false,
    guidance: "Check-in must be before check-out and cannot be in the past.",
  },

  MINIMUM_STAY_REQUIRED: {
    code: "HTL_004",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "MinimumStayRequired",
    message: "This hotel requires a minimum stay for the selected dates.",
    userMessage: "This hotel requires a minimum stay for your selected dates.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance: "Please extend your stay to meet the minimum requirement.",
  },

  HOTEL_BOOKING_CLOSED: {
    code: "HTL_005",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "HotelBookingClosed",
    message:
      "Booking for this hotel is no longer available for the selected dates.",
    userMessage: "Booking is no longer available for your selected dates.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance: "Please try different dates or search for alternative hotels.",
  },

  // Payment Errors (PAY_XXX)
  PAYMENT_FAILED: {
    code: "PAY_001",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "PaymentFailed",
    message:
      "Payment could not be processed. Please try again or use a different method.",
    userMessage: "Payment could not be processed. Please try again.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: true,
    guidance:
      "Please check your payment details or try a different payment method.",
  },

  INVALID_CARD_DETAILS: {
    code: "PAY_002",
    category: ERROR_CATEGORIES.VALIDATION,
    name: "InvalidCardDetails",
    message: "The provided card details are invalid or incomplete.",
    userMessage: "Please check your card details and try again.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: false,
    guidance: "Please verify your card number, expiry date, and CVV.",
  },

  CARD_DECLINED: {
    code: "PAY_003",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "CardDeclined",
    message: "Your card was declined by the bank. Please try a different card.",
    userMessage:
      "Your card was declined. Please try a different payment method.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: false,
    guidance: "Please contact your bank or try a different payment method.",
  },

  INSUFFICIENT_FUNDS: {
    code: "PAY_004",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "InsufficientFunds",
    message: "Insufficient funds on the provided payment method.",
    userMessage: "Insufficient funds on your payment method.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: false,
    guidance: "Please try a different payment method or contact your bank.",
  },

  PAYMENT_GATEWAY_ERROR: {
    code: "PAY_005",
    category: ERROR_CATEGORIES.EXTERNAL_SERVICE,
    name: "PaymentGatewayError",
    message:
      "Payment service is temporarily unavailable. Please try again later.",
    userMessage:
      "Payment service is temporarily unavailable. Please try again.",
    statusCode: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
    retryable: true,
    guidance:
      "Please try again in a few minutes or use a different payment method.",
  },

  DUPLICATE_PAYMENT: {
    code: "PAY_006",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "DuplicatePayment",
    message: "A payment for this booking has already been processed.",
    userMessage: "Payment has already been processed for this booking.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance: "Please check your booking confirmation or contact support.",
  },

  // Booking Errors (BKG_XXX)
  BOOKING_NOT_FOUND: {
    code: "BKG_001",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "BookingNotFound",
    message: "The requested booking could not be found.",
    userMessage: "Booking not found. It may have been cancelled or removed.",
    statusCode: HTTP_STATUS_CODES.NOT_FOUND,
    retryable: false,
    guidance: "Please check your booking reference or contact support.",
  },

  BOOKING_ALREADY_CANCELLED: {
    code: "BKG_002",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "BookingAlreadyCancelled",
    message: "This booking has already been cancelled.",
    userMessage: "This booking has already been cancelled.",
    statusCode: HTTP_STATUS_CODES.CONFLICT,
    retryable: false,
    guidance: "Please check your booking status or contact support.",
  },

  CANCELLATION_NOT_ALLOWED: {
    code: "BKG_003",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "CancellationNotAllowed",
    message: "This booking cannot be cancelled due to policy restrictions.",
    userMessage: "This booking cannot be cancelled according to our policy.",
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    retryable: false,
    guidance:
      "Please review our cancellation policy or contact support for assistance.",
  },

  MODIFICATION_NOT_ALLOWED: {
    code: "BKG_004",
    category: ERROR_CATEGORIES.BUSINESS_LOGIC,
    name: "ModificationNotAllowed",
    message: "This booking cannot be modified due to policy restrictions.",
    userMessage: "This booking cannot be modified according to our policy.",
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    retryable: false,
    guidance:
      "Please review our modification policy or contact support for assistance.",
  },

  // Validation Errors (VAL_XXX)
  MISSING_REQUIRED_FIELDS: {
    code: "VAL_001",
    category: ERROR_CATEGORIES.VALIDATION,
    name: "MissingRequiredFields",
    message: "Required fields are missing from the request.",
    userMessage: "Please fill in all required fields.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: false,
    guidance:
      "Please check the form and fill in all required fields marked with *.",
  },

  INVALID_FORMAT: {
    code: "VAL_002",
    category: ERROR_CATEGORIES.VALIDATION,
    name: "InvalidFormat",
    message: "The provided data format is invalid.",
    userMessage: "Please check the format of your input.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: false,
    guidance: "Please ensure your input matches the expected format.",
  },

  INVALID_DATE_RANGE: {
    code: "VAL_003",
    category: ERROR_CATEGORIES.VALIDATION,
    name: "InvalidDateRange",
    message: "The provided date range is invalid or not allowed.",
    userMessage: "Please select a valid date range.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: false,
    guidance: "Please ensure your dates are valid and within allowed ranges.",
  },

  INVALID_PASSENGER_COUNT: {
    code: "VAL_004",
    category: ERROR_CATEGORIES.VALIDATION,
    name: "InvalidPassengerCount",
    message: "The number of passengers exceeds the allowed limit.",
    userMessage: "The number of passengers exceeds our limit.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: false,
    guidance:
      "Please reduce the number of passengers or contact us for group bookings.",
  },

  INVALID_GUEST_COUNT: {
    code: "VAL_005",
    category: ERROR_CATEGORIES.VALIDATION,
    name: "InvalidGuestCount",
    message: "The number of guests exceeds the room capacity.",
    userMessage: "The number of guests exceeds the room capacity.",
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    retryable: false,
    guidance: "Please select a room that accommodates your party size.",
  },

  // Rate Limiting & Security (RATE_XXX)
  TOO_MANY_REQUESTS: {
    code: "RATE_001",
    category: ERROR_CATEGORIES.RATE_LIMITING,
    name: "TooManyRequests",
    message: "Too many requests from this IP address. Please slow down.",
    userMessage: "Too many requests. Please wait a moment before trying again.",
    statusCode: HTTP_STATUS_CODES.TOO_MANY_REQUESTS,
    retryable: true,
    guidance: "Please wait a few minutes before making another request.",
  },

  SUSPICIOUS_ACTIVITY: {
    code: "RATE_002",
    category: ERROR_CATEGORIES.SECURITY,
    name: "SuspiciousActivity",
    message: "Suspicious activity detected. Access temporarily blocked.",
    userMessage: "Suspicious activity detected. Please try again later.",
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    retryable: true,
    guidance: "Please try again later or contact support if this persists.",
  },

  GEOGRAPHIC_RESTRICTION: {
    code: "RATE_003",
    category: ERROR_CATEGORIES.SECURITY,
    name: "GeographicRestriction",
    message: "Service is not available in your geographic location.",
    userMessage: "Service is not available in your location.",
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    retryable: false,
    guidance:
      "Please contact support for assistance or try from a different location.",
  },
};

/**
 * Creates a structured error response
 * @param {Object} errorObj - Error object from ErrorCodes
 * @param {Object} options - Additional options
 * @param {string} options.requestId - Unique request identifier
 * @param {string} options.timestamp - Error timestamp
 * @param {Object} options.details - Additional error details
 * @param {string} options.correlationId - Correlation ID for tracking
 * @returns {Object} Structured error response
 */
export function createStructuredError(errorObj, options = {}) {
  const {
    requestId = generateRequestId(),
    timestamp = new Date().toISOString(),
    details = null,
    correlationId = null,
  } = options;

  return {
    success: false,
    error: {
      code: errorObj.code,
      name: errorObj.name,
      category: errorObj.category,
      message: errorObj.message,
      userMessage: errorObj.userMessage,
      statusCode: errorObj.statusCode,
      retryable: errorObj.retryable,
      guidance: errorObj.guidance,
      requestId,
      timestamp,
      correlationId,
      ...(details && { details }),
    },
  };
}

/**
 * Creates an Error instance with structured error information
 * @param {Object} errorObj - Error object from ErrorCodes
 * @param {number} statusCode - HTTP status code (optional, uses errorObj.statusCode if not provided)
 * @returns {Error} Error instance with structured information
 */
export function createAppError(errorObj, statusCode = null) {
  const err = new Error(errorObj.message);
  err.name = errorObj.name;
  err.statusCode = statusCode || errorObj.statusCode;
  err.errorCode = errorObj.code;
  err.category = errorObj.category;
  err.userMessage = errorObj.userMessage;
  err.retryable = errorObj.retryable;
  err.guidance = errorObj.guidance;

  return err;
}

/**
 * Generates a unique request ID for error tracking
 * @returns {string} Unique request identifier
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Maps common database errors to our error codes
 * @param {Error} dbError - Database error
 * @returns {Object} Mapped error object
 */
export function mapDatabaseError(dbError) {
  if (dbError.code === 11000) {
    // Duplicate key error
    const field = Object.keys(dbError.keyPattern)[0];
    if (field === "email") {
      return ErrorCodes.DUPLICATE_EMAIL;
    }
    return {
      ...ErrorCodes.BUSINESS_LOGIC_ERROR,
      message: `Duplicate value for field: ${field}`,
      userMessage: `This ${field} is already in use.`,
    };
  }

  if (dbError.name === "ValidationError") {
    return {
      ...ErrorCodes.INVALID_FORMAT,
      message: "Database validation failed",
      userMessage: "Please check your input and try again.",
    };
  }

  return ErrorCodes.INTERNAL_SERVER_ERROR;
}

/**
 * Maps common HTTP errors to our error codes
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @returns {Object} Mapped error object
 */
export function mapHttpError(statusCode, message = "") {
  switch (statusCode) {
    case 400:
      return ErrorCodes.INVALID_FORMAT;
    case 401:
      return ErrorCodes.TOKEN_EXPIRED;
    case 403:
      return ErrorCodes.ACCESS_DENIED;
    case 404:
      return ErrorCodes.FLIGHT_NOT_FOUND;
    case 409:
      return ErrorCodes.FLIGHT_FULLY_BOOKED;
    case 422:
      return ErrorCodes.MISSING_REQUIRED_FIELDS;
    case 429:
      return ErrorCodes.TOO_MANY_REQUESTS;
    case 500:
      return ErrorCodes.INTERNAL_SERVER_ERROR;
    case 503:
      return ErrorCodes.SERVICE_UNAVAILABLE;
    case 504:
      return ErrorCodes.EXTERNAL_API_TIMEOUT;
    default:
      return ErrorCodes.INTERNAL_SERVER_ERROR;
  }
}

/**
 * Creates a standardized API error response
 * @param {Object} errorObj - Error object from ErrorCodes
 * @param {Object} options - Additional options
 * @returns {Response} Standardized error response
 */
export function createErrorResponse(errorObj, options = {}) {
  const errorResponse = createStructuredError(errorObj, options);

  return new Response(JSON.stringify(errorResponse), {
    status: errorObj.statusCode,
    headers: {
      "Content-Type": "application/json",
      "X-Request-ID": errorResponse.error.requestId,
      ...(errorResponse.error.correlationId && {
        "X-Correlation-ID": errorResponse.error.correlationId,
      }),
    },
  });
}

/**
 * Handles and standardizes caught errors
 * @param {Error} error - Caught error
 * @param {Object} options - Additional options
 * @returns {Object} Standardized error response
 */
export function handleError(error, options = {}) {
  // If it's already a structured error, return it
  if (error.errorCode) {
    return createStructuredError(
      {
        code: error.errorCode,
        name: error.name,
        category: error.category || ERROR_CATEGORIES.SYSTEM,
        message: error.message,
        userMessage: error.userMessage || error.message,
        statusCode: error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        retryable: error.retryable || false,
        guidance: error.guidance || "Please try again or contact support.",
      },
      options,
    );
  }

  // Map common error types
  if (error.name === "ValidationError") {
    return createStructuredError(ErrorCodes.INVALID_FORMAT, options);
  }

  if (error.name === "CastError") {
    return createStructuredError(ErrorCodes.INVALID_FORMAT, options);
  }

  if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
    return createStructuredError(ErrorCodes.EXTERNAL_API_TIMEOUT, options);
  }

  // Default to internal server error
  return createStructuredError(ErrorCodes.INTERNAL_SERVER_ERROR, options);
}
