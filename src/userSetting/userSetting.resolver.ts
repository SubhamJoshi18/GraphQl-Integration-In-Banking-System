import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { User } from 'src/graphql/models/User';
import { CreateUserSettingInput } from './Inputs/CreateUserSetting';
import { HttpException, Inject, UseGuards } from '@nestjs/common';
import { UserSettingService } from './user.Setting.service';
import { AuthGuard } from 'src/auth/jwt.guard';
import { CreateUserSettingResponse } from './CustomResponses/CreateUserSettingResponse';
import { UserService } from 'src/users/user.service';
import { DeactivateAccountInput } from './Inputs/DeactivateAccount';
import { PubSub } from 'graphql-subscriptions';
import { DeactivateAccountResposne } from './CustomResponses/DeactivateAccountResponse';

export interface IDeactivateAccount {
  userId: string | number | any;
  deactivate_status: boolean;
}

export class UserSettingResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSub,
    @Inject(UserSettingService)
    private readonly userSettingService: UserSettingService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation((returns) => CreateUserSettingResponse, { nullable: false })
  async createUserSetting(
    @Context() Context,
    @Args('CreateUserSetting') CreateUserSettingInput: CreateUserSettingInput,
  ) {
    try {
      const { sub } = Context.req.user;
      const userId = sub;
      const data = this.userSettingService.createUserSetting(
        userId,
        CreateUserSettingInput,
      );
      return data;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => String, { nullable: true })
  async deactivateAccount(
    @Context() Context,
    @Args('DeactivateAccountInput')
    DeactivateAccountInput: DeactivateAccountInput,
  ) {
    try {
      const { sub } = Context.req.user;
      const { deactivate_status }: { deactivate_status: boolean } =
        Context.req.body.variables;
      const functionParameter: IDeactivateAccount = {
        userId: sub,
        deactivate_status: deactivate_status,
      };
      const data =
        await this.userSettingService.deActivateAccount(functionParameter);
      console.log(data);
      return data;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
