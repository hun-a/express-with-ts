import * as bcrypt from 'bcrypt';

import AuthenticationService from "../../src/authentication/authentication.service";
import CreateUserDto from "../../src/users/user.dto";
import UserWithThatEmailAlreadyExistsException from "../../src/exceptions/UserWithThatEmailAlreadyExistsException";
import LogInDto from "../../src/authentication/login.dto";
import WrongCredentialsException from "../../src/exceptions/WrongCredentialsException";
import userModel from "../../src/users/user.model";

const firstName: string = 'john';
const lastName: string = 'smith';
const email: string = 'john@smith.com';
const password: string = 'strongPassword123!';

(bcrypt as any).compare = jest.fn().mockImplementation(
  (data: any, encrypted: string) => data == encrypted
);

describe('The AuthenticationService', () => {

  describe('when registering a user', () => {
    const userData: CreateUserDto = {
      firstName,
      lastName,
      email,
      password,
    };

    describe('if the email is already taken', () => {
      it('should throw an error', async () => {
        const authenticationService = new AuthenticationService();
        (userModel as any).findOne = jest.fn().mockImplementation(() => Promise.resolve(userData));

        await expect(authenticationService.register(userData))
          .rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(userData.email));
      });
    });

    describe('if the email is not taken', () => {
      it('should not throw an error', async () => {
        process.env.JWT_SECRET = 'jwt_secret';

        const authenticationService = new AuthenticationService();
        (userModel as any).findOne = jest.fn().mockImplementation(() => Promise.resolve(undefined));
        (userModel as any).create = jest.fn().mockReturnValue({
          ...userData,
          _id: 0
        });

        await expect(authenticationService.register(userData))
          .resolves.toBeDefined();
      });
    })
  });

  describe('when logging in a user', () => {
    const loginData: LogInDto = {
      email,
      password,
    };

    describe('if the password is invalid', () => {
      it('should throw an error', async () => {
        const authenticationService = new AuthenticationService();
        (userModel as any).findOne = jest.fn().mockImplementation(() => Promise.resolve({
          password: 'invalidStrongPassword123!',
        }));

        await expect(authenticationService.login(loginData))
          .rejects.toMatchObject(new WrongCredentialsException());
      });
    });

    describe('it the password is valid', () => {
      it('should not throw an error', async () => {
        const authenticationService = new AuthenticationService();
        (userModel as any).findOne = jest.fn().mockImplementation(() => Promise.resolve({ password }));

        await expect(authenticationService.login(loginData))
          .resolves.toBeDefined();
      });
    });
  });
});