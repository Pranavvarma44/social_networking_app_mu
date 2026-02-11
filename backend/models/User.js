import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    bio:{
      type: String,
      maxlength:300,
    },

    department:{
      type:String,
      trim:true,
    },
    graduationYear:{
      type:Number,

    },
    skills:[{
      type:String,
      trim:true,
    }],

    profilePicture:{
      type:String,
    },


    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "alumni","admin"],
      default: "student",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);


export default mongoose.models.User || mongoose.model("User", userSchema);