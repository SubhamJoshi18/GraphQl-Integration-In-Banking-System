import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccountDetailsInputs {
  @Field()
  amount: number;
}
