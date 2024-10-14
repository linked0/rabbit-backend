import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../../model/user';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if(user) return next(new Error('User already exists'));

  const newUser = new User({
    email,
    password
  });
  
  await newUser.save();

  req.session = {
    jwt: jwt.sign({ userId: newUser.id, email }, process.env.JWT_KEY!)
  }

  // create user
  res.status(201).send(newUser);
});
export { router as SignupRouter };