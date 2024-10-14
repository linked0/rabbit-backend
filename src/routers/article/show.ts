import { Request , Response, Router, NextFunction } from 'express';
import Article from '../../model/article';

const router = Router();

router.get('/api/article/show/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if(!id) {
        const error = new Error('Article ID is required') as CustomError;
        error.status = 400;
        return next(error);
    }

    const article = await Article.findOne({ _id: id });

    if(!article) {
        const error = new Error('Article not found') as CustomError;
        error.status = 404;
        return next(error);
    }

    res.status(200).send(article);
});

export { router as ShowArticleRouter };