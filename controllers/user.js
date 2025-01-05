import mongoose from "mongoose";
import { User, userValidator, userValidator2 } from "../models/user.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js";
import nodemailer from 'nodemailer';


export const signUp = async (req, res) => {
    try {
        let { userName, email, password, address: { city, street } } = req.body;
        let validate = userValidator({ userName, email, password, address: { city, street } });
        if (validate.error)
            return res.status(400).send(validate.error.details);
        let sameEmail = await User.findOne({ email });
        if (sameEmail)
            return res.status(409).send("your email already exists in the database, you will not be able to register with it again")

        let hashedPassword = await bcrypt.hash(password, 10);
        let newUser = await User.create({ userName, email, password: hashedPassword, address: { city, street } });

        let token = generateToken(newUser);
        let { _id, userName: name, role, email: mail, address} = newUser;
        console.log(newUser);
        res.status(201).json({ _id, userName: name, role, email: mail, address, token });

    }
    catch (err) {
        res.status(400).send("an error occurred while adding a new user");
        console.log(err.message);
    }
}


export const signIn = async (req, res) => {
    try {
        let { password, email } = req.body;
        let validate = userValidator2({ password, email })
        if (validate)
            return res.status(400).send(validate);

        let loggedInUser = await User.findOne({ email });
        if (!loggedInUser)
            return res.status(404).send("no such user found")

       if (loggedInUser.role !== 1) {
            if (password !== loggedInUser.password) {
                return res.status(404).send("the password entered is incorrect");
            }
        } else {
            let p = await bcrypt.compare(password, loggedInUser.password);
            if (!p)
                return res.status(404).send("the password entered is incorrect");
        }


       
        let token = generateToken(loggedInUser);
        let { _id, userName, role, email: mail, address } = loggedInUser;
        res.status(200).json({ _id, userName, role, email: mail, address, token })
    }
    catch (err) {
        res.status(400).send("an error occurred while signin");
        console.log(err.message);
    }


}


export const signUpWithGoogle=async(req,res)=>{

    try{
            let { email, userName} = req.body;
    let sameEmail = await User.findOne({ email });
    if (sameEmail)
        return res.status(409).send("your email already exists in the database, you will not be able to register with it again")
        let newUser = await User.create({ email,userName});
        let token = generateToken(newUser);
        let { _id, userName: name, role, email: mail } = newUser;
        console.log(newUser);
        res.status(201).json({ _id, userName: name, role, email: mail, token });
    }
    catch(err){
        res.status(400).send("an error occurred while adding a new user with google");
        console.log(err.message);
    }

}


export const signInGoogle = async (req, res) => {
    try {
        let { email } = req.body;
        let loggedInUser = await User.findOne({ email });
        if (!loggedInUser)
            return res.status(404).send("no such user found")
        let token = generateToken(loggedInUser);
        let { _id, userName, role, email: mail, address } = loggedInUser;
        res.status(200).json({ _id, userName, role, email: mail, address, token })
    }
    catch
    (err) {
        res.status(400).send("an error occurred while signin with google");
        console.log(err.message);
    }
}



export const getAllUsers = async (req, res) => {
    try {
        let allUsers = await User.find({}, "-password").sort({ "userName": 1 });
        res.status(200).json(allUsers);
    }
    catch (err) {
        res.status(400).send("error in getting all users");
        console.log(err);
    }

}


export const getUserById = async (req, res) => {

    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).send("invalid paramter id");

    try {
        let user = await User.findOne({ _id: id }, "-password");
        if (!user)
            return res.status(404).send("no user with such id");
        res.json(user);
    }
    catch (err) {
        res.status(400).send("problem in getting user id " + id)
        console.log(err);
    }
}




export const sendEmail = async (req, res) => {
    
    const { to, subject, text } = req.body;
    const websiteUrl = 'https://tzippykovalsky.github.io/full-stack-project'; // Replace this with your website URL

    // Create a Nodemailer transporter
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

    // HTML content for the email with a button linking to your website
    let mailOptions = {
        from: process.env.MAIL,
        to: to,
        subject: subject,
     html: `<p style="direction: rtl; font-family: 'Arial', sans-serif; font-size: 16px; margin-bottom:100px;">${text}
         <br/>
      לכניסה לאתר לחצו על הקישור ואח"כ היכנסו לדף הבית
      <br/>
      <b>
      האתר בשיפוץ יתכן ויהיו בעיות
      מתנצלים על אי הנוחות הזמנית
      </b>
      </p>
               <p style="text-align: right; position: absolute; bottom: 1000px; right: 50px;">
                   <a href="${websiteUrl}" style="padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; font-size: 18px;">בקר באתר</a>
               </p>`,
               
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
}
