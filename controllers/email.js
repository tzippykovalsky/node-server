import { sendEmailServise } from '../utils/emailService.js';

export const sendEmail = async (req, res) => {

    const { to, subject, text, htmlContent } = req.body;

    if (!to || !subject || (!text && !htmlContent)) {
        return res.status(400).send("Missing required fields: 'to', 'subject', and either 'text' or 'htmlContent'");
    }
    try {

        await sendEmailServise(to, subject, text, htmlContent);
        console.log('Email sent successfully');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
};
