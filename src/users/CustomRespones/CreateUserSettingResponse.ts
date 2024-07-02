import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateUserSettingResposne {
  @Field()
  message: string;
}
