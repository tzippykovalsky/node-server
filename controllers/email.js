import nodemailer from 'nodemailer';

export const sendEmail = async (req, res) => {
    try {
        const { to, subject, text, htmlContent } = req.body;

        if (!to || !subject || (!text && !htmlContent)) {
            return res.status(400).send("Missing required fields: 'to', 'subject', and either 'text' or 'htmlContent'");
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS_MAIL,
            },
            tls: {
                rejectUnauthorized: false 
            }
        });

        let mailOptions = {
            from: process.env.MAIL,
            to,
            subject,
            text: text || undefined, // שולח טקסט אם קיים
            html: htmlContent || undefined // שולח HTML אם קיים
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
};
