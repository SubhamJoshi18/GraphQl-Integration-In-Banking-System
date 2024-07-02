import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeactivateAccountResposne {
  @Field()
  message: string;
}
