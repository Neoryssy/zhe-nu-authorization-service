import { Request, Response } from 'express';
import { User } from '../models/User.model';
import jwt, { Algorithm } from 'jsonwebtoken';
import { PasswordUtils } from '../utils/PasswordUtils';

const ALGORITHM = process.env.ALGORITHM as Algorithm;
const JWT_SECRET = process.env.JWT_SECRET!;
const SALT_LENGTH = Number(process.env.SALT_LENGTH);
const SECRET_KEY = process.env.JWT_SECRET!;

export class UserController {
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({
          message: 'Invalid email or password',
        });
      }

      const isPasswordValid = await PasswordUtils.comparePassword(
        password,
        user.passwordHash,
        user.passwordSalt
      );

      if (!isPasswordValid) {
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
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(409).send({
          message: 'User already exists',
        });
      }

      const passwordSalt = PasswordUtils.generateSalt(SALT_LENGTH);
      const passwordHash = await PasswordUtils.generateHash(
        password,
        passwordSalt
      );

      const user = new User({
        email,
        passwordHash,
        passwordSalt,
      });

      await user.save();


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
