import { LoginInput } from './../graphql/utils/LoginInput';
import { User } from 'src/graphql/models/User';
import { RegisterInput } from './../graphql/utils/RegisterInput';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt, { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

export interface IResponseObject {
  message: string;
}

export interface ILoginResponseObject {
  access_token: string;
  user: User;
}

export interface IPayload {
  id: number;
  username: string;
  displayName: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser({
    username,
    displayName,
    password,
  }: RegisterInput): Promise<Partial<IResponseObject>> {
    const existsUser = await this.userRepository
      .createQueryBuilder()
      .where('username = :username', { username: username })
      .getOne();
    if (existsUser)
      throw new BadRequestException({ message: 'User is already Registered' });

    //I am not hashing Password here
    const newUser = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          username: username,
          displayName: displayName,
          password: password,
        },
      ])
      .execute();

    const ResposneObject: Partial<IResponseObject> = {};
    ResposneObject.message = 'User Registered SuccessFully';
    return ResposneObject;
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<ILoginResponseObject>> {
    const checkUser = await this.userRepository
      .createQueryBuilder()
      .where('username = :username', { username: username })
      .getOne();
    if (!checkUser) throw new UnauthorizedException();
    let LoginResponseObject: Partial<ILoginResponseObject> = {};
    const payload: Required<IPayload> = {
      id: checkUser.id,
      username: checkUser.username,
      displayName: checkUser.displayName,
    };
    if (checkUser.password === password) {
      LoginResponseObject.access_token = this.jwtService.sign({
        username: checkUser.username,
        sub: checkUser.id,
      });
      LoginResponseObject.user = checkUser;
      return LoginResponseObject;
    }
    return null;
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: 'hide-me',
    });
  }
}
