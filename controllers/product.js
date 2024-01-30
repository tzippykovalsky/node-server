
import { Product, productValidator } from "../models/product.js";
import mongoose from "mongoose";


export const getAllProducts = async (req, res) => {
    let { searchText, page, itemsPerPage = 10 } = req.query;
    try {
        let filterObject = {}
        if (searchText)
            filterObject.name = new RegExp(searchText, "i")//מתעלם מאותיות קטנות/גדולותi  יצירת תנאי חיפוש טקסט חופשי בשאילתה
        let allProducts = await Product.find(filterObject)
            .skip((page - 1) * itemsPerPage)//דילוג- מביא אותי לפריטים הספציפיים לפי העמוד שביקשתי
            .limit(itemsPerPage)
            .sort({ "name": 1 })

        res.json(allProducts);
    }
    catch (err) {
        res.status(400).send("error in getting all products");
        console.log(err.message);
    }
}



export const getProductById = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id))
        return res.status(400).send("invalid paramter id");

    try {
        let productId = await Product.findOne({ _id: req.params.id });
        if (!productId)
            return res.status(404).send("no product with such id");
        res.json(productId);
    }
    catch (err) {
        res.status(400).send("problem in getting product id " + req.params.id)
        console.log(err);
    }
}


export const deleteProductById = async (req, res) => {


    try {
        let { id } = req.params;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send("invalid paramter id");

        let deletedProductId = await Product.findById(id);
        if (!deletedProductId)
            return res.status(404).send("no product with such id");

        if (deletedProductId.userAdded != req.myUser._id)
            return res.status(403).send("according to the website regulations, you are not allowed to delete the product")
        let deletedProductId2 = await Product.findByIdAndDelete(id);
        return res.status(200).json(deletedProductId2);
    }
    catch (err) {
        console.log(err).send("problem in deleting a product");
    }
}



export const addPoduct = async (req, res) => {
    let { name, size, color, company, category, price, imgUrl } = req.body;
    let validate = productValidator(req.body);
    if (validate)
        return res.status(400).send(validate);
    let sameProduct = await Product.findOne({ name, company });
    if (sameProduct)
        return res.status(409).send("A product with the same name and size already exists.");


    try {
        let newProduct = await Product.create({ name, size, color, company, category, price, imgUrl, userAdded: req.myUser._id })
        res.status(201).json(newProduct)
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("problem in adding a new product")

    }
}

export const updateProduct = async (req, res) => {
    try {
        let { id } = req.params;
        let { name, size, color, company, category, price, imgUrl } = req.body;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send("invalid paramter id");

        if (name || price || size || company) {
            let validate = productValidator(req.body);
            if (validate)
                return res.status(400).send(validate);
        }


        let productToApdate = await Product.findById(id);
        if (!productToApdate)
            return res.status(404).send("no product with such id");
        productToApdate.name = name || productToApdate.name;
        productToApdate.size = size || productToApdate.size;
        productToApdate.color = color || productToApdate.color;
        productToApdate.company = company || productToApdate.company;
        productToApdate.category = category || productToApdate.category;
        productToApdate.price = price || productToApdate.price;
        productToApdate.imgUrl = imgUrl || productToApdate.imgUrl;

        await productToApdate.save();
        res.status(200).json(productToApdate);

    }
    catch (err) {
        res.status(400).send("problem in updating the product")
        console.log(err.message);
    }
}
