import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validateBody =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (!error) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(', ');

      console.log('error', message);

      res.status(400).json({ message });
    }
  };
