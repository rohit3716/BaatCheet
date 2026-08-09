const sendEmail = async (email, subject, html) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not defined in the environment variables");
    }

    const payload = {
      sender: {
        name: process.env.APP_NAME || "ChatApp",
        email: process.env.EMAIL_USER,
      },
      to: [{ email: email }],
      subject: subject,
      htmlContent: html,
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API Error:", errorData);
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Email sent successfully via Brevo: %s", data.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email via Brevo:", error.message);
    throw error;
  }
};

export default sendEmail;