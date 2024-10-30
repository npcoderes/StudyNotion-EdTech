const {userQueryEmail}=require("../mail/templates/userquerytemplate")

const mailSender=require("../utils/mailSender")
const User=require("../models/User")

exports.senduserquery=async(req,res)=>{
    try{
      const {firstName,email,message}=req.body;
      const user=await User.findOne({accountType:"Admin"})
      // console.log("admin find")
      const mailOptions=userQueryEmail(firstName,email,message)
      
      // console.log("mailOptions")
      await mailSender(user.email,"Query from User",mailOptions)
      return res.status(200).json({message:"User query sent successfully"})
    }catch(error){
        // console.error(error)
        return res.status(500).json({message:"Failed to send user query"})
    }
}