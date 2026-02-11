import connectDB from "../../lib/db";
import User from "../../models/User";
import  requireAuth  from "../../lib/auth";

export default async function handler(req,res){
    if(req.method!=="PUT"){
        return res.status(405).json({error:"Method not allowed"});

    }

    const auth=await requireAuth(req,res);
    if(auth.error){
        return res.status(401).json({error:auth.error});
    }

    const { name, bio, department, graduationYear, skills, profileImage } =req.body;

    await connectDB();
    const updatedUser=await User.findByIdAndUpdate(auth.user.userId,{
        name,
        bio,
        department,
        graduationYear,
        skills,
        profileImage
    },{new:true}).select("-password -__v");

    return res.status(200).json({message:"profile updated",user:updatedUser});

}