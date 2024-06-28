import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/graphql/models/User';

@ObjectType()
export class LoginResposne {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}
