import app from './app.js'
import dotenv from "dotenv";
import connectDB from "../db/index.js";


dotenv.config(
    {
        path:'.env'
    }
);




app.get("/", (req, res) => {
    res.send("API is running!");
});


connectDB()
.then(() => {
    const server =  app.listen(process.env.PORT || 8000 , () => {
        console.log(`Servere is running on port ${process.env.PORT}`);
    });
    server.on("error" , (err) =>{
        console.error("Server encountered an error" , err);
        
    })
})
.catch((err) => {
    console.log("MongoDB connection failed" , err );
})

