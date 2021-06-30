const mongoose = require("mongoose")

const Profile = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        name: String,
        profession: String,
        DOB: String,
        titleline: String,
        about: String,
        img: {
                type: String,
                default: "",
        },
    },
    {
    timestamp: true,
    }
);


module.exports = mongoose.model("Profile",Profile)