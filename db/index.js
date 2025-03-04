import mongoose from "mongoose";
import { DB_Name } from "../src/constant.js";


const connectDB = async () => {
    try {
      const connectionInstance = await  mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`)
      console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
      console.log(connectionInstance.connection.host);
      
    } catch (error) {
        console.log("MongoDB Error", error);
        process.exit(1);
        
    }
}

export default connectDB;