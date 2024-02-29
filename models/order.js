import Joi from "joi";
import mongoose from "mongoose";


const productSchema = mongoose.Schema({
    productCode: String,//של מוצר _id 
    name: String,
    price: Number,
    company: String,
    quantity: Number,
    
});



const orderSchema = mongoose.Schema({
    orderDate: { type: Date, default: Date.now() },
    deliveryDate: Date,
    costumerId: String,//_id
    address: {
        street: String,
        city: String
    },
    products: [productSchema],
    isOrderSent: { type: Boolean, default: false }
})

export const Order = mongoose.model("orders", orderSchema);

export const orderValidator = (orderToValidate) => {
    const orderJoi = Joi.object({
        deliveryDate: Joi.date().required(),
        address: Joi.object({
            street: Joi.alternatives().try(
                Joi.string(),
                Joi.number()
            ),
            city: Joi.string().required(),
        }).required(),
        products: Joi.array().items(Joi.object({
            productCode: Joi.string().required(),
            name: Joi.string().required(),
            price: Joi.number().min(0).required(),
            company: Joi.string(),
            quantity: Joi.number().min(1).required(),
            
        }).unknown()),
     
    }).unknown();

    return orderJoi.validate(orderToValidate);
};



