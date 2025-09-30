require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Handle form submission
app.post('/send', async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Website Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO.split(','), // multiple emails
      subject: `New Inquiry: ${subject}`,
      html: `
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    });

    res.send('Inquiry sent successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending inquiry.');
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


