import express from 'express';
require('dotenv').config();
const app = express();



app.get('/home' , (req , res) => {
    res.send('hello world')
})

app.listen(process.env.PORT ,  ()=>{
    console.log(`Example port is running on the port ${port}`)
})