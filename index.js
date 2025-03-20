import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { connectToDB } from "./config/DBconfig.js";
import cors from "cors";
import { errorsHndling } from "./middlewares/errorsHndling.js";
import apiRouter from "./routes/api.js";


config();
connectToDB();
const app = express();

app.use(cors());
app.use(morgan("common"))//פרוט בטרמינל שמישהו ניגש לשרת
app.use(express.static('staticFile/images'))
app.use(express.json())

app.use("/api",apiRouter)

app.use(express.urlencoded({ extended: false }));
app.use(errorsHndling);


let port = process.env.PORT || 9181;
app.listen(port, () => {
    console.log(`server is litening on port ${port}`)
})
