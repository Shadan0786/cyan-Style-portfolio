require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));


app.post('/contact', async (req, res) => {
    const { name, email, number, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `New Portfolio Message: ${subject}`,
        text: `From: ${name}\nEmail: ${email}\nPhone: ${number}\n\nMessage: ${message}`
    };

    // try {
    //     await transporter.sendMail(mailOptions);
    //     res.status(200).send({ message: 'Success' });
    // } catch (error) {
    //     res.status(500).send({ message: 'Failed to send' });
    // }
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Success!" });
    } catch (error) {
        console.error("Detailed Error:", error); // This will now show up in Render logs!
        res.status(500).json({ error: error.message });
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));