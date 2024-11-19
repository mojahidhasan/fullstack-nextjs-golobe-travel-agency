import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MAIL_API_TOKEN,
  apiSecret: process.env.MAIL_SECRET_TOKEN,
});

/**
 * @param {Array} recipientEmails array of objects
 * @example
  recipientEmails: [{
    Email: "email@mail.com",
    Name: "name" //optional
}]
 * @param {String} subject
 * @param {String} body
*/
async function sendEmail(recipientEmails = [], subject = "", body) {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_SENDER_EMAIL,
            Name: "Golobe Travel Agency",
          },
          To: recipientEmails,
          Subject: subject,
          HTMLPart: body,
        },
      ],
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default sendEmail;
