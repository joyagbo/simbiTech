const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
//const { google } = require("../controllers/userController");


const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "please enter your email"],
            lowercase: true,
            trim: true,
            lowercase: true,
            unique: true,
           
        },
        password: {
            type: String,
             required: [true, "please enter a password"],
             minlength: [8, "minimum password length is 8 character"],
            
             

         },
        googleId: {
            type: String
        },
         authenticationMethod: {
           type: String,
             enum:['local','google'],
             
         }
    },

    {
        timestamps: true,
    }
);
userSchema.plugin(passportLocalMongoose,{usernameField: 'email'})

userSchema.methods.comparePassword = async function (candidatePassword){
    try {
        if (!this.password || !candidatePassword) {
            return false;
        }
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};


const User = mongoose.model("user", userSchema);
module.exports = { User };
