import nodemailer from 'nodemailer';

export const sendEmailServise = async (to, subject, text,html) => {
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS_MAIL,
      },
    });
  
    const mailOptions = {
      from: process.env.MAIL,
      to,
      subject,
      text,
      html
    };
  
    return transporter.sendMail(mailOptions);
  };