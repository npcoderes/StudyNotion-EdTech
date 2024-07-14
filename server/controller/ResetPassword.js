
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//generate reset password link

exports.resetToken = async (req, res) => {
    try{
        //get email from request body
        const {email} = req.body;
        //check email is empty or not
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Please provide email",
            });
        }
        //check user is exist or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        //generate token
        const token= crypto.randomUUID();
        const updateDetails= await User.findOneAndUpdate({email}, {
            token: token,
            tokenExp: Date.now() + 5*60*1000, //5 minutes
        }, {new:true});
         const url = `http://localhost:3000/update-password/${token}`
        //send email
        await mailSender(email, "Reset Password Link", url);
        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });


    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Email can not be sent at this time please try again later",
            error: err.message,
        });

    }
}


//reset password

exports.resetPassword = async (req, res) => {   
    try{
        const{token, password,confirmPassword} = req.body;
        //check password and confirm password
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and confirm password does not match",
            });
        }

        // check token in db
        const user= await User.findOne({token:token})
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid token",
            });
        }
        //check token expiry
        if(user.tokenExp < Date.now()){
            return res.status(400).json({
                success: false,
                message: "Token expired",
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //update password
        const updateDetails = await User.findOneAndUpdate({token:token}, {
            password: hashedPassword,
            token: token,
        }, {new:true});
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Password can not be reset at this time please try again later",
            error: err.message,
        });
    }
}