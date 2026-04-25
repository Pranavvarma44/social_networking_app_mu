import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    images: [
      {
        type: String, // image URLs
      },
    ],

    // 🔥 Keep counts ONLY (not arrays)
    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    // optional future feature
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    visibility: {
      type: String,
      enum: ["public", "connections"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 for fast feed queries
postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);