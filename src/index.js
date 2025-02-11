import express from 'express';
const app = express();

import dotenv from "dotenv";
import connectDB from "../db/index.js";


dotenv.config(
    {
        path:'.env'
    }
);


connectDB()
.then(() => {
   const server =  app.listen(process.env.PORT || 8000 , () => {
        console.log(`Servere is running on port ${process.env.PORT}`);
    });
    server.on("error" , (err) =>{
        console.error("Server encountered an erroe" , err);
        
    })
})
.catch((err) => {
    console.log("MongoDB connection failed" , err );
})