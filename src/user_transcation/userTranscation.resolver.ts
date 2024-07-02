import { HttpException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { AccountDetails } from 'src/graphql/models/AccountDetails';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSetting';
import { UserTranscationService } from './userTranscation.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAccountDetaislResponse } from './CustomResponse/CreateAccountDetailsResponse';
import { CreateAccountDetailsInputs } from './Inputs/CreateAccountDetailsInput';
import { CreateWithdrawnAmountInput } from './Inputs/CreateWithDrawnInput';

@Resolver((of) => User)
export class UserTranscationResolver {
  constructor(
    private readonly UserTranscationService: UserTranscationService,
  ) {}

  @UseGuards(AuthGuard)
  @Query((returns) => AccountDetails, { nullable: true })
  async getAccountDetails(@Context() Context) {
    try {
      const { sub } = Context.req.user;
      const userId = sub;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => CreateAccountDetaislResponse, { nullable: false })
  async depositedAmountOnUser(
    @Context() Context,
    @Args('AccountDetailsInput')
    CreateAccountDetailsInputs: CreateAccountDetailsInputs,
  ) {
    try {
      const user = Context.req.user;
      const { sub } = user;
      const userId = sub;
      const data = await this.UserTranscationService.depositedAmount(
        userId,
        CreateAccountDetailsInputs,
      );
      return data;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => String, { nullable: false })
  async witHDrawMoney(
    @Context() Context,
    @Args('WithDrawnAmountInput')
    CreateWithdrawnAmountInput: CreateWithdrawnAmountInput,
  ) {
    try {
      const user = Context.req.user;
      const { sub } = user;
      const userId = sub;
      const data = await this.UserTranscationService.withDrawnAmount(
        userId,
        CreateWithdrawnAmountInput,
      );
      return data;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
