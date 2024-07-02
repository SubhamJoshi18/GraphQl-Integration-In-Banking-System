import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { User } from './graphql/models/User';
import { AuthModule } from './auth/auth.module';
import { UserSetting } from './graphql/models/UserSetting';
import { UserSettingModule } from './userSetting/userSetting.module';
import { AccountDetails } from './graphql/models/AccountDetails';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      installSubscriptionHandlers: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'google',
      entities: [User, UserSetting, AccountDetails],
      synchronize: true,
    }),

    UsersModule,
    UserSettingModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
