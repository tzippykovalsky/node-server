
import { Product, productValidator, productValidator2 } from "../models/product.js";
import mongoose from "mongoose";
import multer from 'multer';
import path from 'path';

export const getAllProducts = async (req, res) => {
    let { searchText, page, itemsPerPage = 8 ,category  } = req.query;
    try {
        let filterObject = {};

       
        
        if (searchText)
            filterObject.name = new RegExp(searchText, "i")//מתעלם מאותיות קטנות/גדולותi  יצירת תנאי חיפוש טקסט חופשי בשאילתה

          if (category)
            filterObject.category = category;
        
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
export const getCountPages = async (req, res) => {
    let { itemsPerPage = 8 } = req.query;
    try {
        let count = await Product.find({}).count();
        let numPages = count / itemsPerPage;
        res.json(numPages).status(200)
    }
    catch (err) {
        console.log(err);
        res.status(400).send("an error in getting num pages")
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

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, 'staticFile/images/');
//     },
//     filename: function(req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
//   });
  
//   const upload = multer({ storage: storage }).single('file');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'staticFile/images/');
    },
    filename: function (req, file, cb) {
        // Extract the original filename from the file object
        const originalFilename = file.originalname;

        cb(null, originalFilename);
    }
});

const upload = multer({ storage: storage }).single('file');


export const addPoduct = async (req, res) => {
    

    upload(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error uploading image.');
        }
        let originalFilename = req.file.originalname;
        let { name, size, color, company, category, price, imgUrl, imgUrl2, quantityInStock } = req.body;
        let validate = productValidator(req.body);
    
        if (validate) {
          return res.status(400).send(validate);
        }
    
        let sameProduct = await Product.findOne({ name, company });
    
        if (sameProduct) {
          return res.status(409).send("A product with the same name and size already exists.");
        }
    
        try {
          let newProduct = await Product.create({ name, size, color, company, category, price, imgUrl:originalFilename, imgUrl2, quantityInStock, userAdded: req.myUser._id });
          res.status(201).json(newProduct);
        } catch (err) {
          console.error(err);
          return res.status(400).send("Problem in adding a new product.");
        }
      });
}

// export const addPoduct = async (req, res) => {
//     let { name, size, color, company, category, price, imgUrl,imgUrl2, quantityInStock } = req.body;
//     let validate = productValidator(req.body);
//     if (validate)
//         return res.status(400).send(validate);
//     let sameProduct = await Product.findOne({ name, company });
//     if (sameProduct)
//         return res.status(409).send("A product with the same name and size already exists.");


//     try {
//         let newProduct = await Product.create({ name, size, color, company, category, price,imgUrl2, imgUrl, userAdded: req.myUser._id, quantityInStock })
//         res.status(201).json(newProduct)
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(400).send("problem in adding a new product")

//     }
// }

export const updateProduct = async (req, res) => {
    try {
        let { id } = req.params;
        let { name, size, color, company, category, price, imgUrl,imgUrl2, quantityInStock } = req.body;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send("invalid paramter id");


        let validate = productValidator2(req.body);
        if (validate)
            return res.status(400).send(validate);



        let productToUpdate = await Product.findById(id);
        if (!productToUpdate)
            return res.status(404).send("no product with such id");
        productToUpdate.name = name || productToUpdate.name;
        productToUpdate.size = size || productToUpdate.size;
        productToUpdate.color = color || productToUpdate.color;
        productToUpdate.company = company || productToUpdate.company;
        productToUpdate.category = category || productToUpdate.category;
        productToUpdate.price = price || productToUpdate.price;
        productToUpdate.imgUrl = imgUrl || productToUpdate.imgUrl;
        productToUpdate.imgUrl2 = imgUrl2 || productToUpdate.imgUrl2;
        productToUpdate.quantityInStock = quantityInStock || productToUpdate.quantityInStock;

        await productToUpdate.save();
        res.status(200).json(productToUpdate);

    }
    catch (err) {
        res.status(400).send("problem in updating the product")
        console.log(err.message);
    }
}
