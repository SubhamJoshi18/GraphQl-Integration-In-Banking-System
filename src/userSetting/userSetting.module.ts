import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSetting';
import { UserSettingService } from './user.Setting.service';
import { UserSettingResolver } from './userSetting.resolver';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PubSub } from 'graphql-subscriptions';
import { AccountDetails } from 'src/graphql/models/AccountDetails';

const pubSub = new PubSub();

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSetting, AccountDetails])],
  providers: [
    UserSettingResolver,
    UserSettingService,
    JwtService,
    AuthService,
    {
      provide: 'PUB_SUB',
      useValue: pubSub,
    },
  ],
})
export class UserSettingModule {}
