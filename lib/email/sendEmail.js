import { Recipient, EmailParams, MailerSend, Sender } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAIL_API_TOKEN,
});

const sendFrom = new Sender(
  process.env.MAIL_SENDER_EMAIL,
  "Golobe Travel Agency"
);

async function sendEmail(recipientEmails = [], subject = "", body) {
  const recipients = recipientEmails.map((email) => new Recipient(email));

  const emailParams = new EmailParams();
  emailParams.setFrom(sendFrom);
  emailParams.setTo(recipients);
  emailParams.setSubject(subject);
  emailParams.setHtml(body);
  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default sendEmail;
