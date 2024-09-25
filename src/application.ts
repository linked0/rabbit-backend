import  express, { Request, Response, Router, NextFunction }  from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { AdminRoute } from './routes/admin';
import { NewArticleRoute } from './routes/article/new';
import { NewCommentRoute } from './routes/comment/new';
import { DeleteCommentRoute } from './routes/comment/delete';
import mongoose from 'mongoose';
import cors from 'cors';

//For env File 
dotenv.config();

declare global {
  interface CustomError extends Error {
    status?: number;
  }
}

export default class Application {
  public expressApp!: express.Application;

  public connect = async (): Promise<void> => {
    if(!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }
    try { 
      mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
      console.log('Error while connecting to MongoDB  :', error);
      throw new Error('Error while connecting to MongoDB');
    }
    
  }

  public async init() {
    const port = process.env.PORT || 8000;

    this.expressApp = express();
    
    this.expressApp.use(cors(
      {
        origin: "*",
        optionsSuccessStatus: 200
      }
    ))
    this.expressApp.use(bodyParser.urlencoded({ extended: true }));
    this.expressApp.use(bodyParser.json());

    this.expressApp.get('/', (_req, res) => res.send('Hello, World!'));

    this.expressApp.use("/admin", AdminRoute);
    this.expressApp.use("/api/article", NewArticleRoute);
    this.expressApp.use(NewCommentRoute);
    this.expressApp.use(DeleteCommentRoute);

    this.expressApp.all('*', (_req, res, next) => {
      const error = new Error('Route not found') as CustomError;
      error.status = 404;
      next(error);
    });

    this.expressApp.use((error: CustomError, req:Request, res: Response, next: NextFunction) => {
      if(error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    });

    this.expressApp.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
  }
}
