import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'account_details' })
@ObjectType()
export class AccountDetails {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column({ default: 0 })
  @Field({ nullable: true })
  current_money: number;

  @Column({ default: 0 })
  @Field()
  total_money: number;

  @Column({ default: 0 })
  @Field({ nullable: true })
  deposited_amount: number;

  @OneToOne(() => User, (user) => user.accountDetails)
  @JoinColumn()
  user: User;
}
