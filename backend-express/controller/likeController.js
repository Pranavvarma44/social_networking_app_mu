import Like from "../../models/likeModel.js";
import Post from "../../models/postModel.js";

export const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const existing = await Like.findOne({
      user: req.user.id,
      post: postId,
    });

    if (existing) {
      await existing.deleteOne();

      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 },
      });

      return res.json({ message: "Unliked" });
    }

    await Like.create({
      user: req.user.id,
      post: postId,
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { likesCount: 1 },
    });

    res.json({ message: "Liked" });
  } catch (err) {
    next(err);
  }
};