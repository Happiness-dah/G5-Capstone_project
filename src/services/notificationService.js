// services/notificationService.js

import nodemailer from 'nodemailer';

const send = async (message, recipients) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(', '),
      subject: 'Notification from Fintech App',
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error('Error sending notification: ' + error.message);
  }
};

export default { send };
