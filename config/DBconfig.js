import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    //const mongoURI = process.env.DB_CONNECTION || "mongodb://localhost:27017/myFirstDB"
    //נראה שרנדר לא קולט את משתני הסביבה לא ברור למה
    const mongoURI = process.env.DB_CONNECTION || "mongodb+srv://malki537:5PHgvwi0vMKMrJgf@myfirstdb.k30br6q.mongodb.net/myFirstDB?retryWrites=true&w=majority"
    
    await mongoose.connect(mongoURI);
    console.log("Mongo DB connected");
  } catch (err) {
    console.log("Cannot connect to Mongo DB");
    console.log(err);
    process.exit(1);
  }
};

