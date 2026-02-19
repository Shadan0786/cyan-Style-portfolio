require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// 1. Move transporter OUTSIDE the route for better performance
// 2. Use explicit host/port settings to bypass Render's network blocks
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS/STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // MUST be a 16-character Google App Password
    },
    tls: {
        // This helps prevent connection issues in containerized environments
        rejectUnauthorized: false
    }
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

app.post('/contact', async (req, res) => {
    const { name, email, number, subject, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER, // Gmail usually ignores the 'from' if it's not your own email
        replyTo: email,              // This ensures you reply to the user, not yourself
        to: process.env.EMAIL_USER,
        subject: `New Portfolio Message: ${subject}`,
        text: `From: ${name}\nEmail: ${email}\nPhone: ${number}\n\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Success!" });
    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));