import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { connectToDB } from "./config/DBconfig.js";
import cors from "cors";
import { errorsHndling } from "./middlewares/errorsHndling.js";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";


config();
connectToDB();
const app = express();

app.use(cors());
app.use(morgan("common"))//פרוט בטרמינל שמישהו ניגש לשרת
app.use(express.static('staticFile/images'))
app.use(express.json())
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter)
app.use(express.urlencoded({ extended: false }));
app.use(errorsHndling);


let port = process.env.PORT || 9181;
app.listen(port, () => {
    console.log(`server is litening on port ${port}`)
})
