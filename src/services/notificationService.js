import nodemailer from 'nodemailer';
import User from '../models/User.js'; // Adjust the path to your models directory

const send = async (message) => {
  try {
    // Fetch all user emails from the database
    const users = await User.findAll({
      attributes: ['email'], // Only fetch the email field
    });

    // Extract email addresses into an array
    const recipients = users.map(user => user.email);

    if (recipients.length === 0) {
      throw new Error('No recipients found.');
    }

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(', '), // Combine emails into a comma-separated string
      subject: 'Notification from Fintech App',
      text: message,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error('Error sending notification: ' + error.message);
  }
};

export default { send };
