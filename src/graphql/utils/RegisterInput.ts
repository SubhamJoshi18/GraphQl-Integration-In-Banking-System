import { Field, InputType } from '@nestjs/graphql';
import { FILE } from 'dns';

@InputType()
export class RegisterInput {
  @Field()
  username: string;

  @Field()
  displayName?: string;

  @Field()
  password: string;
}
