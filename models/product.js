import Joi from "joi";
import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: String,
    size: String,
    color: String,
    company: String,
    category: String,
    dateAdded:{ type: Date, default: Date.now() },
    price: Number,
    imgUrl: String,
    userAdded: String,
    inSale: { type: Boolean, default: false }
});

export const Product = mongoose.model("products", productSchema);


export const productValidator = (productToValidate) => {

    let productJoi = Joi.object({
        name: Joi.string().min(3).required(),
        price: Joi.number().min(0).required(),
        size: Joi.string().min(0).required(),
        company: Joi.string().min(2).required(),
        
    }).unknown();//מאפשר לשאר השדות להכנס ללא בדיקות

    const validationResult = productJoi.validate(productToValidate);

    if (validationResult.error) {
        return validationResult.error.details.map((error) => error.message);
    }
    return null;
}