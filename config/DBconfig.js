import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const mongoURI = process.env.DB_CONNECTION || "mongodb://localhost:27017/myFirstDB"
    await mongoose.connect(mongoURI);
    console.log("Mongo DB connected");
  } catch (err) {
    console.log("Cannot connect to Mongo DB");
    console.log(err);
    process.exit(1);
  }
};

