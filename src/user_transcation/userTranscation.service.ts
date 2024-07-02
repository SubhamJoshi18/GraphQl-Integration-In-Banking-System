import { CreateAccountDetailsInputs } from './Inputs/CreateAccountDetailsInput';
import {
  BadGatewayException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { findBreakingChanges } from 'graphql';
import { AccountDetails } from 'src/graphql/models/AccountDetails';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSetting';
import { Repository } from 'typeorm';
import { EntityManager } from 'typeorm';
import { CreateWithdrawnAmountInput } from './Inputs/CreateWithDrawnInput';
type StrNum = string | number;

@Injectable()
export class UserTranscationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserSetting)
    private userSettingRepositroy: Repository<UserSetting>,

    @InjectRepository(AccountDetails)
    private accountDetailsRepository: Repository<AccountDetails>,
  ) {}

  async depositedAmount(
    userId: StrNum,
    { amount }: CreateAccountDetailsInputs,
  ) {
    return await this.userRepository.manager.transaction(
      async (manager: EntityManager) => {
        const existsUser = await this.userRepository
          .createQueryBuilder()
          .where('id = :id', { id: userId })
          .getOne();
        if (!existsUser)
          throw new HttpException(`User not found or jwt is expired`, 403);
        const validateAmount =
          typeof amount === 'number' ? amount : Number(amount);
        if (amount < 0)
          throw new BadGatewayException('Amount must not be lesser than 0');

        await this.accountDetailsRepository
          .createQueryBuilder()
          .insert()
          .into(AccountDetails)
          .values([
            {
              user: existsUser,
              deposited_amount: typeof amount === 'number' ? amount : 0,
            },
          ])
          .execute();

        const findAccountDetails = await this.userRepository.findOne({
          where: {
            id: Number(userId),
          },
          relations: ['account_details'],
        });

        const result = await this.accountDetailsRepository
          .createQueryBuilder()
          .update(AccountDetails)
          .set({
            total_money: findAccountDetails.accountDetails.total_money + amount,
            current_money:
              findAccountDetails.accountDetails.current_money + amount,
          })
          .where('userId = :userId', { userId: userId })
          .execute();

        if (
          result.affected.toString().startsWith('0') &&
          !result.affected.toString().endsWith('1')
        ) {
          throw new HttpException(`User Deposited Operation Failed`, 401);
        }

        const message = `${findAccountDetails.username} Has SuccessFully Desposited ${amount} At ${new Date().toLocaleDateString()}`;
        return message;
      },
    );
  }

  async withDrawnAmount(
    userId: StrNum | undefined | any,
    { amount }: CreateWithdrawnAmountInput,
  ) {
    return this.userRepository.manager.transaction(
      async (manager: EntityManager) => {
        if (typeof amount !== 'number' || !amount)
          throw new HttpException(`Amount is not valid format`, 401);

        const user = await this.userRepository.findOne({
          where: {
            id: userId,
          },
          relations: ['account_details'],
        });

        if (user.accountDetails.total_money.toString().startsWith('0'))
          throw new HttpException(`Amount is 0`, 401);

        if (user.accountDetails.total_money < amount)
          throw new HttpException('Ammount is not Enough', 401);

        const totalMoney = user.accountDetails.total_money - amount;
        const currentMoney = user.accountDetails.current_money - amount;
        const result = await this.accountDetailsRepository
          .createQueryBuilder()
          .update(AccountDetails)
          .set({
            total_money: totalMoney,
            current_money: currentMoney,
          })
          .execute();
        if (result.affected.toString().startsWith('0'))
          throw new HttpException(`User Withdraw Opertion Failed`, 403);
        const message = `${user.username} Has Withdrawn ${amount} Amount SuccessFully at ${new Date().toLocaleDateString()}`;
        return message;
      },
    );
  }
}
