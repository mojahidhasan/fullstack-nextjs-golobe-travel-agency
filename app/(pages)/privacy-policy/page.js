import "./privacy-policy.css";
export default function PrivacyPolicyPage() {
  return (
    <div
      id={"privacy-policy-container"}
      className={"mx-auto w-[90%] lg:mb-[80px] mb-[40px] mt-5"}
    >
      <h1>Privacy Policy</h1>
      <p>
        <strong>Effective Date: 2024-12-03</strong>
      </p>

      <h2>1. Information We Collect</h2>
      <h3>1.1 Information You Provide</h3>
      <ol>
        <li>
          <b>Account Information:</b> First name, last name, email, phone number
          (optional).
        </li>
        <li>
          <b>Profile Data:</b> Profile picture and cover photo.
        </li>
        <li>
          <b>Booking and Search Data:</b> Flight and hotel search queries,
          booking details.
        </li>
        <li>
          <b>Subscription:</b> Email addresses provided for subscribing to
          updates.
        </li>
      </ol>

      <h3>1.2 Automatically Collected Information</h3>
      <ol>
        <li>
          <b>Cookies:</b>
          <ol>
            <li>
              A cookie is set to track the client’s timezone for localizing
              flight times.
            </li>
            <li>
              Temporary cookies are used for password reset and email
              verification, which are deleted after the process completes.
            </li>
          </ol>
        </li>
        <li>
          <b>Analytics Data:</b>
          <ol>
            <li>Visitor behavior is tracked using analytics services.</li>
            <li>
              Hosting provider (Vercel) also collects visitor behavior data.
            </li>
          </ol>
        </li>
      </ol>

      <h3>1.3 Third-Party Services</h3>
      <ol>
        <li>
          <b>Mailjet:</b> Used for sending emails, which may collect information
          independently.
        </li>
        <li>
          <b>Firebase Storage:</b> Stores profile and cover photos.
        </li>
        <li>
          <b>MongoDB:</b> Used as the primary database for storing user and
          booking data.
        </li>
      </ol>

      <h2>2. How We Use Your Information</h2>
      <ol>
        <li>Provide and improve our flight and hotel booking services.</li>
        <li>Send updates, verifications, and communications using Mailjet.</li>
        <li>
          Customize flight and hotel search results based on timezone and
          preferences.
        </li>
      </ol>

      <h2>3. Sharing Your Information</h2>
      <div>
        <b>We may share your data with:</b>
        <ol>
          <li>
            <b>Service Providers:</b> Mailjet, Firebase, MongoDB, and analytics
            services to deliver our services.
          </li>
          <li>
            <b>Legal Authorities:</b> As required by law.
          </li>
        </ol>
      </div>

      <h2>4. Cookies and Tracking</h2>
      <p>
        We use cookies to track user timezone for displaying local times and
        manage password resets and email verifications temporarily. You can
        control cookies through your browser settings.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We take reasonable measures to protect your data. However, as this is a
        development project, users should avoid providing real sensitive
        information, including card details.
      </p>

      <h2>6. User Rights</h2>
      <ol>
        <li>Access, correct, or delete your personal data.</li>
        <li>Withdraw consent for email communications.</li>
      </ol>
      <p>
        For requests, contact us at{" "}
        <strong>
          <a href="mailto:example@email.com">example@email.com</a>
        </strong>
        .
      </p>

      <h2>7. Disclaimer</h2>
      <p>
        This is a development project, and services, including payments, are
        simulated. Users are responsible for understanding and agreeing to the
        limitations of this project.
      </p>

      <h2>8. Updates to This Policy</h2>
      <p>
        We may revise this Privacy Policy. Updates will be posted here with the
        effective date.
      </p>

      <h2>9. Contact</h2>
      <p>
        For privacy-related inquiries, contact us at{" "}
        <strong>
          <a href="mailto:example@email.com">example@email.com</a>
        </strong>
        .
      </p>
    </div>
  );
}
