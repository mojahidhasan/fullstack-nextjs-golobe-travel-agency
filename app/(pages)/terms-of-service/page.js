import "./terms-of-service.css";
export default function TermsOfServicePage() {
  return (
    <div
      id="terms-of-service-container"
      className="mx-auto w-[90%] lg:mb-[80px] mb-[40px] mt-5"
    >
      <h1>Terms of Service</h1>
      <p>
        <strong>Effective Date: 2024-12-03</strong>
      </p>

      <h2>1. Use of Services</h2>

      <h3>1.1 Eligibility</h3>
      <ol>
        <li>
          You are at least 18 years old or have parental consent to use the
          website.
        </li>
        <li>
          You are using the website in compliance with all applicable laws.
        </li>
      </ol>

      <h3>1.2 Account Creation</h3>
      <ol>
        <li>
          You don&apos;t need to provide accurate and complete information
          (first name, last name, email, and phone number).
        </li>
        <li>
          If you want to test email verification or forget password features,
          use a valid email address for verification purposes otherwise any fake
          email.
        </li>
      </ol>

      <h2>2. Booking Policies</h2>

      <h3>2.1 Flights and Hotels</h3>
      <ol>
        <li>All bookings are subject to availability.</li>
        <li>
          Prices displayed are simulated and may not reflect real-world pricing.
        </li>
        <li>
          Users can search for and book flights or hotels based on personal
          preferences.
        </li>
      </ol>

      <h3>2.2 Payments and Deposits</h3>
      <ol>
        <li>
          Payments are simulated; users can deposit using fake card details for
          testing purposes.
        </li>
        <li>
          Users are advised not to store real card information as this project
          is for development purposes only.
        </li>
      </ol>

      <h2>3. Data and User Responsibilities</h2>
      <p>
        Users can upload profile and cover photos. These are stored securely on
        Firebase. Users are advised to avoid providing real sensitive data,
        including phone numbers, addresses, or dates of birth. Golob Travel
        Agency is not liable for any data misuse caused by the user providing
        real information.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        All content on the website, including text, images, and designs, is
        owned by Golob Travel Agency. Unauthorized use of the content is
        prohibited.
      </p>

      <h2>5. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. The updated version will be
        posted here, with the effective date.
      </p>

      <h2>6. Contact</h2>
      <p>
        For questions regarding these Terms, contact us at{" "}
        <strong>
          <a href="mailto:example@email.com">example@email.com</a>
        </strong>
        .
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        This is a development project, and services, including payments, are
        simulated. Users are responsible for understanding and agreeing to the
        limitations of this project.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        Golob Travel Agency is not responsible for any data misuse or losses
        arising from users providing real sensitive information. All use of the
        website is at the user’s own risk.
      </p>
    </div>
  );
}
