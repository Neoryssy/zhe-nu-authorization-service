import ms from 'ms';
import { Request, Response } from 'express';
import jwt, { Algorithm } from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { Session } from '../models/session.model';

const ALGORITHM = process.env.ALGORITHM as Algorithm;
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN!;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN!;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export class UserController {
  static login = async (req: Request, res: Response) => {
    const { email, password, fingerprint } = req.body;

    try {
      const user = await UserService.login(email, password);

      if (!user) {
        return res.status(400).send({
          message: 'Invalid email or password',
        });
      }

      const accessExpiresIn = ms(JWT_ACCESS_EXPIRES_IN);
      const refreshExpiresIn = ms(JWT_REFRESH_EXPIRES_IN);

      const payload = {
        sub: user._id,
      };

      const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: accessExpiresIn,
      });

      const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: refreshExpiresIn,
      });

      await Session.create({
        userId: user._id,
        refreshToken,
        userAgent: req.headers['user-agent'],
        fingerprint,
        ip: req.ip,
        expiresIn: refreshExpiresIn,
      });

      res.cookie('refresh_token', refreshToken, {
        //domain: COOKIE_DOMAIN,
        path: '/api/v1/oauth/',
        httpOnly: true,
        maxAge: refreshExpiresIn,
      });

      res.status(200).send({
        access_token: accessToken,
        expires_in: accessExpiresIn,
        scope: '',
        refresh_token: refreshToken,
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message: 'Internal server error',
      });
    }
  };

  static logout = async (req: Request, res: Response) => {
    const { refresh_token: refreshToken } = req.cookies;

    const session = await Session.findOneAndDelete({ refreshToken });

    if (!session) {
      return res.status(401).send({
        message: 'INVALID_REFRESH_TOKEN',
      });
    }

    res.clearCookie('refresh_token');

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

      const token = jwt.sign(payload, JWT_ACCESS_SECRET, {
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

  static refreshToken = async (req: Request, res: Response) => {
    const { fingerprint } = req.body;
    const { refresh_token: refreshToken } = req.cookies;

    try {
      const session = await Session.findOneAndDelete({ refreshToken });

      if (!session) {
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }

      const isExpired =
        session.createdAt.setDate(
          session.createdAt.getDate() + session.expiresIn
        ) < Date.now();

      if (isExpired) {
        return res.status(401).send({
          error: 'TOKEN_EXPIRED',
        });
      }

      const isFingerprintValid = session.fingerprint === fingerprint;

      if (!isFingerprintValid) {
        return res.status(401).send({
          error: 'INVALID_REFRESH_SESSION',
        });
      }

      const accessExpiresIn = ms(JWT_ACCESS_EXPIRES_IN);
      const refreshExpiresIn = ms(JWT_REFRESH_EXPIRES_IN);

      const payload = {
        sub: session.userId,
      };

      const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: accessExpiresIn,
      });

      const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: refreshExpiresIn,
      });

      await Session.create({
        userId: session.userId,
        refreshToken: newRefreshToken,
        userAgent: req.headers['user-agent'],
        fingerprint,
        ip: req.ip,
        expiresIn: refreshExpiresIn,
      });

      res.cookie('refresh_token', newRefreshToken, {
        //domain: COOKIE_DOMAIN,
        path: '/api/v1/oauth/',
        httpOnly: true,
        maxAge: refreshExpiresIn,
      });

      res.status(200).send({
        access_token: accessToken,
        expires_in: accessExpiresIn,
        scope: '',
        refresh_token: refreshToken,
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
