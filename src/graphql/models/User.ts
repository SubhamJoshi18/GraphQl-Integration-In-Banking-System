import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSetting } from './UserSetting';
import { AccountDetails } from './AccountDetails';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  username: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  displayName: string;

  @Column()
  @Field()
  password: string;

  @OneToOne(() => AccountDetails, (accountDetails) => accountDetails.user)
  accountDetails: AccountDetails;
}
