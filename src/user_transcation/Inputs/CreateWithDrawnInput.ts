import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWithdrawnAmountInput {
  @Field()
  amount: number;
}
