import { createTestAccount } from 'nodemailer';
import { sendEmailService } from '../service/email.js';

export const sendEmail = async (req, res) => {

    const { to, subject, text, htmlContent } = req.body;

    if (!to || !subject || !text || !htmlContent) {
        return res.status(400).send("Missing required fields: 'to', 'subject', 'text' and 'htmlContent'");
    }

    try {
        await sendEmailService(to, subject, text, htmlContent);
        console.log('Email sent successfully');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
};

export const getAdminEmail = async (req, res) => {
    try {
        let email = process.env.MAIL;
        if (!email) {
            return res.status(404).send("No admin email found");
        }
        res.json({ email });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Failed to get admin email');

    }
}