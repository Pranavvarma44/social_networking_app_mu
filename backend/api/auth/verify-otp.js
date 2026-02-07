import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import EmailOtp from "../../models/EmailOtp.js";
import connectDB from "../../lib/db.js";

export default async function handler(req,res){
    if(req.method!=="POST"){
        return res.status(405).json({error:"Method not allowed"});
    }
    const{email,otp}=req.body;
    if(!email||!otp){
        return res.status(400).json({error:"Email and otp are required"});
    }
    const normalizedEmail=email.toLowerCase();
    try{
        await connectDB();
        const otpRecord=await EmailOtp.findOne({email:normalizedEmail});
        if(!otpRecord){
            return res.status(400).json({error:"otp expired or invalid"});
        }
        if(otpRecord.attempts>=5){
            await EmailOtp.deleteOne({_id:otpRecord._id});
            return res.status(400).json({ error: "Too many attempts. OTP expired." });
        }
        const isValid=await bcrypt.compare(otp,otpRecord.otp);
        if(!isValid){
            otpRecord.attempts+=1;
            await otpRecord.save();
            return res.status(400).json({error:"Invalid Otp"});

        }
        await User.updateOne({
            email:normalizedEmail

        },{$set:{emailVerified:true}});
        await EmailOtp.deleteOne({ _id: otpRecord._id });
        return res.status(200).json({message:"Email verified successfully"});

    }catch(error){
        console.error("Verify OTP error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}