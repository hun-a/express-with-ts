// @ts-ignore
import { plainToClass } from 'class-transformer';
// @ts-ignore
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from "../exceptions/HttpException";

export default function validationMiddleware<T>(type: any, skipMissingProperties: boolean = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(", ");
          next(new HttpException(400, message));
        } else {
          next();
        }
      });
  };
}
