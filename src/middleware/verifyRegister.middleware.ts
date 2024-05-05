import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const emailExists = await UserService.emailExists(email);

  if (emailExists) {
    return res.status(400).send({
      message: 'Email already exists',
    });
  }

  next();
};

export const verifyRegister = { checkUserExists };
