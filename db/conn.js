const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://BlogUser:sanjay@blogapp.vyepz.mongodb.net/BlogAppDataBase?retryWrites=true&w=majority",{
    useCreateIndex:true,
    useNewUrlParser:true,   
    useUnifiedTopology:true,
    useFindAndModify:false,
}).then(()=>{
    console.log("connections is successful");
}).catch((err)=>{
    console.log('Connection Faild');
});