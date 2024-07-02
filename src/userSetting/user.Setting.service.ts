import { CreateUserSettingInput } from './Inputs/CreateUserSetting';
import { CreateUserInput } from 'src/graphql/utils/CreateUserInput';
import {
  BadGatewayException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSetting';
import { Repository } from 'typeorm';
import { IDeactivateAccount } from './userSetting.resolver';

@Injectable()
export class UserSettingService {
  constructor(
    @InjectRepository(UserSetting)
    private userSettingRepository: Repository<UserSetting>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUserSetting(
    userId: string | number,
    { receiveEmails, receiveNotifications }: CreateUserSettingInput,
  ) {
    const findUser = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: userId })
      .getOne();
    const checkUserLength = (await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: userId })
      .getCount())
      ? 1
      : 0;
    if (checkUserLength.toString().startsWith('0'))
      throw new BadGatewayException();

    const createUserSetting = await this.userSettingRepository
      .createQueryBuilder()
      .insert()
      .into(UserSetting)
      .values([
        {
          receivedEmails: receiveEmails,
          receivedNotifications: receiveNotifications,
          user: findUser,
        },
      ])
      .execute();

    const message = `${findUser.username} Has Created Its User Setting`;
    return message;
  }

  async deActivateAccount({ userId, deactivate_status }: IDeactivateAccount) {
    const user = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: userId })
      .getOne();

    if (!user) throw new HttpException('User not Found', 401);

    const userSetting = await this.userSettingRepository.findOne({
      where: {
        user: user,
      },
      relations: ['user'],
    });

    if (userSetting.deactivate_status)
      throw new HttpException(`User is already Deactivated`, 401);

    const result = await this.userSettingRepository
      .createQueryBuilder()
      .update(UserSetting)
      .set({
        deactivate_status: deactivate_status,
      })
      .where('userId = :userId', { userId: user.id })
      .execute();

    const message = `User Has Deactivated This Account`;
    return message;
  }
}
