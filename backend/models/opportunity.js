import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    location: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["internship", "job", "research", "other"],
      default: "internship",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Opportunity ||
  mongoose.model("Opportunity", opportunitySchema);