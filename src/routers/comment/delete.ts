import { Request, Response, Router, NextFunction } from 'express';
import Article from '../../model/article';
import Comment from '../../model/comment';
import { ExplainVerbosity } from 'mongodb';

const router = Router();

router.delete('/api/comment/:commentId/delete/:articleId', async (req:Request, res: Response, next: NextFunction ) => {
  const { articleId, commentId } = req.params;

  if(!commentId || !articleId) {
    const error = new Error('Article ID and Comment ID are required') as CustomError;
    error.status = 400;
    return next(error);
  }

  try {
    await Comment.findOneAndDelete({ _id: commentId });
  } catch (error) {
    next(new Error(`Error while deleting comment ${error}`));
  }

  await Article.findOneAndUpdate({ _id: articleId }, { $pull: { comments: commentId } });
  res.status(200).json({ success: true });
});

export { router as DeleteCommentRoute };