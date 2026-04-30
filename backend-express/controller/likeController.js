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

    let likesCount;

    if (existingLike) {
      // 🔴 UNLIKE
      await existingLike.deleteOne();

      const post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { new: true }
      );

      likesCount = Math.max(post.likesCount, 0); // 🔥 prevent negative

    } else {
      // 🟢 LIKE
      await Like.create({
        user: userId,
        post: postId,
      });

      const post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: 1 } },
        { new: true }
      );

      likesCount = post.likesCount;
    }

    res.json({ likesCount });

  } catch (err) {
    console.error("LIKE ERROR:", err);
    next(err);
  }
};