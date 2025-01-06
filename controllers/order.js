import { Order, orderValidator } from "../models/order.js";
import mongoose from "mongoose";
import { Product } from "../models/product.js"




export const addOrder = async (req, res) => {
  let { products, address: { city, street }, deliveryDate } = req.body;
  let validate = orderValidator({ products, address: { city, street }, deliveryDate })
  if (validate.error)
    return res.status(400).send(validate.error);
  try {
    const productCodes = products.map(product => product.productCode);
    const existingProducts = await Product.find({ _id: { $in: productCodes } });

    if (existingProducts.length != productCodes.length)
      return res.status(400).send("one or more products do not exist");

    let newOrder = await Order.create({ products, address: { city, street }, deliveryDate, costumerId: req.myUser._id })
    res.status(201).json(newOrder);
  }
  catch (err) {
    console.log(err)
    res.status(400).send("an error occurred while adding a new order");

  }
}

export const getAllOrders = async (req, res) => {

  try {
    let allOrders = await Order.find({}).sort({ "orderDate": 1 });
    res.status(200).json(allOrders)

  }
  catch (err) {
    res.status(500).send("an error in getting all orders");
    console.log(err);
  }

}

export const updateOrder = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).send("invalid paramter id");
  try {
    let order = await Order.findById(id);
    if (!order)
      return res.status(404).send("no order with such id");

    let updatedOrder = await Order.findOneAndUpdate({ _id: id }, { isOrderSent: true }, { new: true })
    res.status(200).json(updatedOrder);
  }
  catch (err) {
    res.status(500).send('failed to update order');
    console.log(err);
  }
}


export const deleteOrder = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).send("invalid paramter id");
  try {
    let orderToDelete = await Order.findById(id)
    if (!orderToDelete)
      return res.status(404).send("no order with such id");
    if (orderToDelete.isOrderSent)
      return res.status(400).send("you cannot delete an order already sent");
    if (req.myUser._id == orderToDelete.costumerId || req.myUser.role == 2) {
      let deletedOrder = await Order.findByIdAndDelete(id);
      res.status(200).json(deletedOrder);
    }
    else
      res.status(401).send("you are not allowed to delete the order");

  }
  catch (err) {
    res.status(500).send('failed to delete order');
    console.log(err);
  }

}

export const getAllOrdersFromCurrentUser = async (req, res) => {
  let { _id } = req.myUser;
  try {
    let orders = await Order.find({ costumerId: _id });
    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).send("Cannot fetch all orders of the current user")
  }
}