import { Recipient, EmailParams, MailerSend } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAIL_API_TOKEN,
});

const sendFrom = process.env.MAIL_USERNAME;

async function sendEmail(recipientEmails = [], subject = "", body) {
  const recipients = recipientEmails.map((email) => new Recipient(email));

  const emailParams = new EmailParams();
  emailParams.setFrom(sendFrom);
  emailParams.setTo(recipients);
  emailParams.setSubject(subject);
  emailParams.setHtml(body);

  await mailerSend.email(emailParams);
}

export default sendEmail;
