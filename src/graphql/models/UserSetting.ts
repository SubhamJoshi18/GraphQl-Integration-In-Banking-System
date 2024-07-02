import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'user_settings' })
@ObjectType()
export class UserSetting {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field((type) => Int)
  id: number;

  @Column({ default: false })
  @Field()
  receivedNotifications: boolean;

  @Column({ default: false })
  @Field()
  receivedEmails: boolean;

  @Column({ default: false })
  @Field({ nullable: true })
  deactivate_status: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  @Field()
  user: User;
}
