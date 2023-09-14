var nodemailer = require('nodemailer');

export async function sendMail(
  subject: string,
  toEmail: string,
  html: string,
  text: string
) {
  var transportOptions: any = {
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT
  };

  if (process.env.NODEMAILER_USER && process.env.NODEMAILER_PASSWORD) {
    transportOptions.auth = {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    };
  }

  var transporter = nodemailer.createTransport(transportOptions);

  var mailOptions = {
    from: process.env.NODEMAILER_FROM,
    to: toEmail,
    subject: subject,
    html,
    text
  };

  transporter.sendMail(mailOptions, function (error: any) {
    if (error) {
      throw new Error(error);
    } else {
      return true;
    }
  });
}
