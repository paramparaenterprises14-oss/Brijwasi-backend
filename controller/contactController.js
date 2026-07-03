const sendEmail = require('../utils/sendEmail');

const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Name, email, and message are required',
      });
    }

    // Send the message to the restaurant's own inbox
    await sendEmail(
      process.env.RESTAURANT_CONTACT_EMAIL || process.env.EMAIL_USER,
      `New Contact Form Message from ${name}`,
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    res.status(200).json({
      success: true,
      data: null,
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

module.exports = { submitContactForm };