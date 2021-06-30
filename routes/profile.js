const express = require("express")
const Profile = require("../models/profile.model")
const middleware = require("../middleware")
const multer = require("multer")
const path = require("path")
const User = require("../models/users.model")

const storage = multer.diskStorage({

    //cb -> its a call back function
    destination: (req,file,cb)=>{
        cb(null,"./uploads")
    },
    filename: (req,file,cb)=>{
        cb(null,req.decoded.username+".jpg")
    }
});

const fileFilter = (req,file,cb)=>{
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
    } else {
    cb(null, false);
    }
};
const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*6,
    },
   // fileFilter: fileFilter,
});

const router = new express.Router();

router.patch("/add/image", middleware.checkToken,upload.single("img"), (req,res)=>{


         Profile.findOneAndUpdate(
            
            {username:req.decoded.username},
            {
                $set:{
                    img:req.file.path,
                }
            },
            {new:true,},
            (err,profile)=>{
                if (err) return res.status(500).send(err);
                const response = {
                    message: "image added and successfully updated",
                    data: profile,
                  };
                  return res.status(200).send(response);
            }
        );
        
   
})


router.post("/add",  middleware.checkToken,async (req,res)=>{
    try {

        const profile = Profile({
            username: req.decoded.username,
            name: req.body.name,
            profession:req.body.profession,
            DOB: req.body.DOB,
            titleline: req.body.titleline,
            about: req.body.about,
        })
        const result = await profile.save();
        return res.json({ msg: "profile successfully stored" });
    } catch (err) {
        return res.status(400).json({ err: err});
    }
    
});

router.get("/checkprofile/",middleware.checkToken,async(req,res)=>{
    try {
        const username = req.decoded.username;   
        //console.log(username);
        const profileData = await Profile.findOne({username});
        // res.send(profileData);
        if(profileData !== null){
            return res.send({Status:true})
        }else{
            return res.send({Status:false})
        }
    } catch (err) {
        return res.status(400).json({ err: err.message});
    }
})


router.route("/getData").get(middleware.checkToken, (req, res) => {
    Profile.findOne({ username: req.decoded.username }, (err, result) => {
      if (err) return res.json({ err: err });
      if (result == null) return res.json({ data: [] });
      else return res.json({ data: result });
    });
  });

  router.route("/update").patch(middleware.checkToken, async (req, res) => {
    let profile = {};
    await Profile.findOne({ username: req.decoded.username }, (err, result) => {
      if (err) {
        profile = {};
      }
      if (result != null) {
        profile = result;
      }
    });
    Profile.findOneAndUpdate(
      { username: req.decoded.username },
      {
        $set: {
          name: req.body.name ? req.body.name : profile.name,
          profession: req.body.profession
            ? req.body.profession
            : profile.profession,
          DOB: req.body.DOB ? req.body.DOB : profile.DOB,
          titleline: req.body.titleline ? req.body.titleline : profile.titleline,
          about: req.body.about ? req.body.about : profile.about, //about:""
        },
      },
      { new: true },
      (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: [] });
        else return res.json({ data: result });
      }
    );
  });
    
module.exports = router