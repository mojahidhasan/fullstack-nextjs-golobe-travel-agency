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
 * @typedef {Object} FlightBookingConfirmed
 * @property {BrandingInfo} branding - Branding data (logo, name, base URL)
 * @property {SocialIcons} socialIcons - Social media icon URLs
 * @property {SocialLinks} socialLinks - Social media links
 * @property {FooterInfo} footer - Footer metadata
 * @property {{bookingDetails: object, flightDetails: object,manageBookingUrl: string,downloadTicketUrl: string }} main - Flight data
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
