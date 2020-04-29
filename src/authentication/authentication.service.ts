import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import userModel from "../users/user.model";
import CreateUserDto from "../users/user.dto";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import TokenData from "../interfaces/tokenData.interface";
import User from "../users/user.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import LogInDto from "./login.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";

export default class AuthenticationService {
  private user = userModel;

  public async register(userData: CreateUserDto) {
    if (await this.user.findOne({ email: userData.email })) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.user.create({
      ...userData,
      password: hashedPassword
    });
    user.password = undefined;

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    return { cookie, user };
  }

  private createToken(user: User): TokenData {
    const expiresIn: number = 60 * 60;
    const secret: string = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = { _id: user._id };

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  public login = async (loginData: LogInDto) => {
    const user = await this.user.findOne({ email: loginData.email });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);

      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData: TokenData = this.createToken(user);
        const cookie: string = this.createCookie(tokenData);

        return { cookie, user };
      } else {
        throw new WrongCredentialsException();
      }
    } else {
      throw new WrongCredentialsException();
    }
  }
}