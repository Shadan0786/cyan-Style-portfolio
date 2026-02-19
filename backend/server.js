require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

// 1. Improved CORS Configuration
app.use(cors({
    origin: 'https://shadanaliportfolio.netlify.app',
    methods: ['POST', 'GET', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());

// 2. Transporter with IPv4 focus
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    }
});

// Non-blocking verification
transporter.verify((error) => {
    if (error) {
        console.log("Email Service Status: ❌ Not Ready");
        console.error(error);
    } else {
        console.log("Email Service Status: ✅ Ready");
    }
});

app.post('/contact', async (req, res) => {
    const { name, email, number, subject, message } = req.body;

    // Basic validation to prevent crashes on empty bodies
    if (!email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        replyTo: email,
        to: process.env.EMAIL_USER,
        subject: `New Portfolio Message: ${subject}`,
        text: `From: ${name}\nEmail: ${email}\nPhone: ${number}\n\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Success!" });
    } catch (error) {
        console.error("Mail Error:", error);
        return res.status(500).json({ error: "Server could not send email." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});