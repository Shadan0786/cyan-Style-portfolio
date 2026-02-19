require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend'); // Import Resend

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
    origin: 'https://shadanaliportfolio.netlify.app',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/contact', async (req, res) => {
    const { name, email, number, subject, message } = req.body;

    try {
        const data = await resend.emails.send({
            // MANDATORY: Use 'onboarding@resend.dev' for free tier testing
            from: 'Contact Form <onboarding@resend.dev>',
            to: process.env.EMAIL_USER, // Your Gmail
            reply_to: email,            // So you can click 'Reply' in your inbox
            subject: `Portfolio: ${subject}`,
            html: `
                <h3>New Message Received</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>User Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${number}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Resend API Error:", error);
        return res.status(500).json({ error: "Failed to send email." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});