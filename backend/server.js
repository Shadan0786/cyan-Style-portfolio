require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// 1. Force CORS to accept your Netlify URL
app.use(cors({
    origin: 'https://shadanaliportfolio.netlify.app',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 2. Configure Transporter using Port 587 (More reliable on Render)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Bypasses local certificate issues
    }
});

// 3. The Contact Route
app.post('/contact', async (req, res) => {
    const { name, email, number, subject, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        replyTo: email,
        to: process.env.EMAIL_USER,
        subject: `Portfolio: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${number}\n\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("SMTP Error:", error.message);
        // We send a 500 JSON response so CORS doesn't break
        return res.status(500).json({ error: "Mail failed, but server is alive." });
    }
});

// 4. Bind to 0.0.0.0 (Required for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server active on port ${PORT}`);
});