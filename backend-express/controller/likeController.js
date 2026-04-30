import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";

export const toggleLike = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    const existingLike = await Like.findOne({
      user: userId,
      post: postId,
    });

    let post;

    if (existingLike) {
      // 🔴 UNLIKE
      await existingLike.deleteOne();

      post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { new: true }
      );

    } else {
      // 🟢 LIKE
      await Like.create({
        user: userId,
        post: postId,
      });

      post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: 1 } },
        { new: true }
      );
    }

    // 🔥 HARD FIX: NEVER allow negative
    if (post.likesCount < 0) {
      post.likesCount = 0;
      await post.save();
    }

    res.json({ likesCount: post.likesCount });

  } catch (err) {
    console.error("LIKE ERROR:", err);
    next(err);
  }
};