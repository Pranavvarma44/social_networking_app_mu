import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";

export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// Get comments of a post
export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// Delete comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();

    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};