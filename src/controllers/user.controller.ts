import { Request, Response } from 'express';
import { User } from '../models/User.model';
import jwt, { Algorithm } from 'jsonwebtoken';
import { PasswordUtils } from '../utils/PasswordUtils';
import { UserService } from '../services/user.service';

const ALGORITHM = process.env.ALGORITHM as Algorithm;
const JWT_SECRET = process.env.JWT_SECRET!;
const SECRET_KEY = process.env.JWT_SECRET!;

export class UserController {
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await UserService.login(email, password);

      if (!user) {
        return res.status(400).send({
          message: 'Invalid email or password',
        });
      }

      const payload = {
        sub: user._id,
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        algorithm: ALGORITHM,
      });

      res.status(200).send({
        token,
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message: 'Internal server error',
      });
    }
  };

  static logout = (req: Request, res: Response) => {
    // TODO: implement user logout
    res.status(200).send({
      message: 'Logout successful',
    });
  };

  static register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await UserService.register(email, password);

      if (!user) {
        return res.status(500).send({
          message: 'Internal server error',
        });
      }

      const payload = {
        sub: user._id,
      };

      const token = jwt.sign(payload, SECRET_KEY, {
        algorithm: ALGORITHM,
      });

      return res.status(201).send({
        token,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).send({
        message: 'Internal server error',
      });
    }
  };

  static remove = async (req: Request, res: Response) => {
    // TODO: Implement user remove
    res.status(200).send({
      message: 'User removed',
    });
  };
}
