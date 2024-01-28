import mongoose from "mongoose";
import Joi from 'joi';

const userSchema = mongoose.Schema({
    userName: String,
    password: String,
    email: { type: String, unique: true },
    address: {
        street: String,
        city: String
    },
  
    dateOfJoiningTheSite: { type: Date, default: Date.now() },
    role: { type: Number, default: 1 }
    //  1-user  2-admin

});

export const User = mongoose.model("users", userSchema);




export const userValidator = (_userToValidate) => {

    let userJoi = Joi.object({
        userName: Joi.string().min(3).required(),
        password: Joi.string()
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
            .required(),
        email: Joi.string().email().required(),
        address: Joi.object({
            street: Joi.alternatives().try(
                Joi.string(),
                Joi.number()
            ),
            city: Joi.string().required(),
        }).required()
    }).unknown();

    return userJoi.validate(_userToValidate);


};


export const userValidator2 = (userToValidate) => {
    const userJoi = Joi.object({
        password: Joi.string()
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
            .required(),
        email: Joi.string().email().required(),
    }).unknown();

    const validationResult = userJoi.validate(userToValidate);

    if (validationResult.error) {
        return validationResult.error.details.map((error) => error.message);
    }

    return null;
}
