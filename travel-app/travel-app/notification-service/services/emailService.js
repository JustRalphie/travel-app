const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.EMAIL_FROM
  ) {
    throw new Error("SMTP is not configured. Please set EMAIL_FROM, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

exports.sendEmail = async ({ to, subject, text }) => {
  const mailer = getTransporter();

  await mailer.verify();

  const info = await mailer.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text
  });

  return info;
};