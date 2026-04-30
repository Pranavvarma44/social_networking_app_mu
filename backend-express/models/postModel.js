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

    media: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String, // image | video
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
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
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// 🔹 for fast feed queries
postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);