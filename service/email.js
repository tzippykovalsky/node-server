import { transporter } from "../config/emailConfig.js";

/**
 * Sends an email using Nodemailer.
 *
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} [text] - Plain text email body.
 * @param {string} [html] - HTML email body.
 * @returns {Promise<{success: boolean, message: string}>} - Status and message.
 */
export const sendEmailService = async (to, subject, text , html) => {
    try {
        if (!to || !subject) {
            throw new Error("Missing required email parameters: 'to' and 'subject'");
        }

        const mailOptions = {
            from: process.env.MAIL,
            to,
            subject,
            text,
            html,
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error.message);
        return { success: false, message: "Failed to send email" };
    }
};
