import nodemailer from "nodemailer";

// Create a reusable transporter using environment variables
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL, // Email address used for sending
        pass: process.env.PASS_MAIL, // App password (NOT regular password)
    },
});
