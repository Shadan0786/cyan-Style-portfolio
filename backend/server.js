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
            // Note: On the free tier, you must send FROM 'onboarding@resend.dev' 
            // unless you verify your own domain.
            from: 'Contact Form <onboarding@resend.dev>',
            to: process.env.EMAIL_USER, // Your Gmail address
            reply_to: email,            // Allows you to hit 'reply' to the user
            subject: `Portfolio: ${subject}`,
            html: `
                <h3>New Message from Portfolio</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${number}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        console.log("Email sent successfully:", data);
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: "Failed to send message via Resend." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server active with Resend on port ${PORT}`);
});