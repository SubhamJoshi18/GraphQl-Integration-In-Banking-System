import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateUserSettingResponse {
  @Field()
  message: string;
}
