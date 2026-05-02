import mongoose from "mongoose";

const studyGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,

    subject: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("StudyGroup", studyGroupSchema);