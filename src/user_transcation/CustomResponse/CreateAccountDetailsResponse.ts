import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateAccountDetaislResponse {
  @Field()
  message: string;
}
