import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/User';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { UserSetting } from 'src/graphql/models/UserSetting';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSetting]),
    JwtModule.register({
      secret: 'hide-me',
      signOptions: {
        issuer: 'subhamJoshi',
        expiresIn: '1h',
      },
    }),
  ],
  providers: [UserResolver, UserService, AuthService, JwtService],
})
export class UsersModule {}
