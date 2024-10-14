import { Request, Response, Router, NextFunction } from 'express';
import Article from '../../model/article';

const router = Router();

router.post('/new', async (req:Request, res: Response, next: NextFunction ) => {
  const { title, content } = req.body;
  if (!title || !content) {
    const error = new Error('Title and content are required') as CustomError;
    error.status = 400;
    return next(error);
  }

  const newArticle = new Article({
    title,
    content
  });

  await newArticle.save();

  res.status(201).send(newArticle);
});

router.post('/update/:id', async (req:Request, res: Response, next: NextFunction ) => {
  const { id } = req.params;
  const { title, content } = req.body;

  console.log('id :', id);

  if(!id) {
    const error = new Error('Article ID is required') as CustomError;
    error.status = 400;
    return next(error);
  }

  let updatedArticle;
  try {
    updatedArticle = await Article.findOneAndUpdate(
      { _id: id },
      { $set: { title, content } },
      { new: true }
    )
  } catch (error) {
    const err = new Error(`Error while updating Article ${error}`) as CustomError;
    err.status = 400;
    return next(err);
  }

  res.status(200).send(updatedArticle);
});

router.delete('/delete/:id', async (req:Request, res: Response, next: NextFunction ) => {
  const { id } = req.params;

  console.log('id :', id);  

  if(!id) {
    const error = new Error('Article ID is required') as CustomError;
    error.status = 400;
    return next(error);
  }

  try {
    await Article.findOneAndDelete({ _id: id });
  } catch (error) {
    next( new Error(`Error while deleting Article ${error}`) );

  }

  res.status(200).json( { success : true } );
});



export { router as NewArticleRoute };