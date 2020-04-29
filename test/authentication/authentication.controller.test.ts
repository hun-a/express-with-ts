import * as mongoose from 'mongoose';
import * as request from 'supertest';

import CreateUserDto from "../../src/users/user.dto";
import AuthenticationController from "../../src/authentication/authentication.controller";
import App from "../../src/app";
import userModel from "../../src/users/user.model";

(mongoose as any).connect = jest.fn().mockImplementation(() => Promise.resolve());

describe('The AuthenticationController', () => {

  describe('POST /auth/register', () => {

    describe('if the email is not taken', () => {
      it('response should have the Set-Cookie header with the Authorization token', () => {
        const userData: CreateUserDto = {
          firstName: 'john',
          lastName: 'smith',
          email: 'john@smitch.com',
          password: 'strongPassword123!'
        };

        process.env.JWT_SECRET = 'jwt_secret';

        const authenticationController = new AuthenticationController();

        (userModel as any).findOne = jest.fn().mockImplementation(() => Promise.resolve(undefined));
        (userModel as any).create = jest.fn().mockReturnValue({
          ...userData,
          _id: 0,
        });

        const app = new App([
          authenticationController,
        ]);

        return request(app.getServer())
          .post(`${authenticationController.path}/register`)
          .send(userData)
          .expect('Set-Cookie', /^Authorization=.+/);
      });
    });
  });
});