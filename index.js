const express = require("express")
const mongoose = require("mongoose")
require("./db/conn");
const userRoute = require("./routes/user")

const app = express()

const port = process.env.PORT || 3000

app.use("/uploads",express.static("uploads"));

app.use(express.json());
app.use(userRoute);
const profileRoute = require("./routes/profile");
app.use("/profile",profileRoute);
const blogRoute = require("./routes/blogpost");
app.use("/blogPost", blogRoute);


app.get("/",(req,res)=>{
    res.send("hello world its my first api hosting pleas give a thums up, my name is sanjay and I am here to show you how the data work")
})

app.listen(port , "0.0.0.0" ,()=>{
    console.log(`server is scuccessfully running at ${port}`);
})