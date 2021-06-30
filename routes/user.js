const express = require("express")
const User = require("../models/users.model")
const jwt = require("jsonwebtoken")
const config = require("../config")
const middleware = require("../middleware")

const router = new express.Router();

router.get("/user/view",(req,res) =>{
    res.send("hello Worl From the profile section");
})  

router.get("/user/:username",middleware.checkToken,async (req,res)=>{
    try {
        const username = req.params.username;
        const userDetails = await User.findOne({username});
        res.status(201).send({
            data: userDetails,
            username: req.params.username,
        })

    } catch (error) {
        res.status(404).send({ msg: error })
    }
})

router.get("/user/checkusername/:username",async (req,res)=>{
    try {
        const username = req.params.username;
        const userDetails = await User.findOne({username});
        if(userDetails !== null){
            return res.send({Status:true})
        }else{
            return res.send({Status:false})
        }
    } catch (error) {
        res.status(500).send({ msg: error })
    }
})

router.post("/user/register", async (req,res)=>{
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        const result = await user.save();
        console.log("user registered");
        res.status(200).send({ msg: "User Successfully Registered" });
    } catch (error) {
        res.status(403).send({ msg: error });
    }
})


router.post("/user/login",async (req,res)=>{
    try {
        const username = req.body.username;
        const userDetails = await User.findOne({username});
        if(!userDetails){
            return res.status(403).json("invalid crediantial");
        }   
        if(userDetails.password === req.body.password){
            let token = jwt.sign({ username: username}, config.key, {});
            res.send({
              token: token,
              msg: "success",
            });
            
        }else{
            res.status(403).json("invalid crediantial");
        }
        

    } catch (error) {
        res.status(500).send({ msg: error });
    }
})


router.patch("/user/update/:username",(req, res) => {
    console.log(req.params.username);
    User.findOneAndUpdate(
      { username: req.params.username },
      {$set: { password: req.body.password }},
      (err, result) => {
        if (err) return res.status(500).send({ msg: err });
        const msg = {
          msg: "password successfully updated",
          username: req.params.username,
        };
        return res.send(msg);
      }
    );
  });

  router.delete("/user/delete/:username", middleware.checkToken,async (req,res)=>{
     try {
        const username = req.params.username
        const deleteuser = await User.findOneAndDelete({username})
        if(!username){
          return res.status(404).send();
      }
      const msg = {
        msg: "User deleted",
        username: req.params.username,
      };
      res.send(msg);
     } catch (error) {
        return res.status(404).send(error);
     }
  })


module.exports = router