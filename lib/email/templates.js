/**
 * @typedef {Object} BrandingInfo
 * @property {string} logoImageUrl
 * @property {string} baseUrl
 */

/**
 * @typedef {Object} SocialIcons
 * @property {string} facebookIconUrl
 * @property {string} twitterIconUrl
 * @property {string} instagramIconUrl
 * @property {string} youtubeIconUrl
 */

/**
 * @typedef {Object} SocialLinks
 * @property {string} facebook
 * @property {string} twitter
 * @property {string} instagram
 * @property {string} youtube
 */

/**
 * @typedef {Object} FooterLink
 * @property {string} url
 * @property {string} text
 */

/**
 * @typedef {Object} FooterInfo
 * @property {FooterLink[]} footerLinks
 * @property {string} companyAddress
 * @property {string} currentYear
 */

/**
 * @typedef {Object} EmailConfirmation
 * @property {BrandingInfo} branding - Branding data (logo, name, base URL)
 * @property {SocialIcons} socialIcons - Social media icon URLs
 * @property {SocialLinks} socialLinks - Social media links
 * @property {FooterInfo} footer - Footer metadata
 * @property {{verificationUrl: string, expirationTime: string}} main - Verification data
 * @returns {string}
 */

/**
 * @typedef {Object} Segment
 * @property {string} flightNumber
 * @property {string} airlineName
 * @property {string} departureDateTime
 * @property {string} departureAirportName
 * @property {string} departureAirportIataCode
 * @property {string} arrivalDateTime
 * @property {string} arrivalAirportName
 * @property {string} arrivalAirportIataCode
 * @property {number} totalDurationMinutes
 * @property {string} airplaneModelName
 */

/**
 * @typedef {Object} FlightDetails
 * @property {string} itineraryFlightNumber
 * @property {Segment[]} segments
 */

/**
 * @typedef {Object} Passengers
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} passengerType
 * @property {string} seatNumber
 * @property {string} seatClass
 */

/**
 * @typedef {Object} PaymentMethod
 * @property {string} brand
 * @property {string} last4
 * @property {string} receiptUrl
 */

/**
 * @typedef {Object} BookingDetails
 * @property {string} pnrCode
 * @property {string} userTimeZone
 * @property {Passengers} passengers
 * @property {string} ticketType
 * @property {string} fareClass
 * @property {PaymentMethod} paymentMethod
 * @property {string} totalFare
 * @property {string} currency
 */

/**
 * @typedef {Object} FlightBookingConfirmed
 * @property {BrandingInfo} branding - Branding data (logo, name, base URL)
 * @property {SocialIcons} socialIcons - Social media icon URLs
 * @property {SocialLinks} socialLinks - Social media links
 * @property {FooterInfo} footer - Footer metadata
 * @property {{bookingDetails: BookingDetails, flightDetails: FlightDetails, manageBookingUrl: string, downloadTicketUrl: string }} main - Flight data
 * @returns {string}
 */
/**
 * @typedef {Object} NewUserSignup
 * @property {BrandingInfo} branding - Branding data (logo, name, base URL)
 * @property {SocialIcons} socialIcons - Social media icon URLs
 * @property {SocialLinks} socialLinks - Social media links
 * @property {FooterInfo} footer - Footer metadata
 * @property {{firstName: string}} main - Flight data
 * @returns {string}
 */

/**
 * @typedef {Object} PasswordResetVerification
 * @property {BrandingInfo} branding - Branding data (logo, name, base URL)
 * @property {SocialIcons} socialIcons - Social media icon URLs
 * @property {SocialLinks} socialLinks - Social media links
 * @property {FooterInfo} footer - Footer metadata
 * @property {{code: string, expirationTime: string}} main - Verification data
 * @returns {string}
 */

import emailConfirmation from "./emailTemplates/emailConfirmation.hbs";
import flightBookingConfirmed from "./emailTemplates/flightBookingConfirmed.hbs";
import newUserSignup from "./emailTemplates/newUserSignup.hbs";
import passwordResetVerification from "./emailTemplates/passwordResetVerification.hbs";

/**
 * @type {(data: EmailConfirmation) => string}
 */
export const emailConfirmationEmailTemplate = emailConfirmation;

/**
 * @type {(data: FlightBookingConfirmed) => string}
 */
export const flightBookingConfirmedEmailTemplate = flightBookingConfirmed;

/**
 * @type {(data: NewUserSignup) => string}
 */
export const newUserSignupEmailTemplate = newUserSignup;

/**
 * @type {(data: PasswordResetVerification) => string}
 */
export const passwordResetVerificationEmailTemplate = passwordResetVerification;
