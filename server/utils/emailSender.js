import nodemailer from "nodemailer";
import { text } from "stream/consumers";

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: {
        name: "ChatApp",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject,
      html,
      text: `${html}\n\nThis is an automated message from ${process.env.APP_NAME}. Please do not reply to this email.`
    };

     const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export default sendEmail;