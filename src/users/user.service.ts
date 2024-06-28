import { DeleteUserInput } from './../graphql/utils/DeleteUserInput';
import { CreateUserInput } from './../graphql/utils/CreateUserInput';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'rxjs';
import { User } from 'src/graphql/models/User';
import { Repository } from 'typeorm';
import { NOTFOUND } from 'dns';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUser(): Promise<User[] | User> {
    const findAllUser = await this.userRepository.find();
    return findAllUser;
  }

  async createUser({ username, displayName }: CreateUserInput) {
    const newUser = this.userRepository.create({
      username: username,
      displayName: displayName,
    });
    return this.userRepository.save(newUser);
  }

  async getUserByName(name: string): Promise<User> {
    const findUser = await this.userRepository.findOne({
      where: {
        username: name,
      },
    });
    if (!findUser) throw new UnauthorizedException();
    return findUser;
  }
  async getUserById(id: number): Promise<User> {
    const findUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!findUser) throw new UnauthorizedException();
    return findUser;
  }

  async deleteUserById({ id }: DeleteUserInput): Promise<boolean> {
    const findUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!findUser) throw new NotFoundException();
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id: id })
      .execute();
    return true;
  }
}
