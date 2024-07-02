import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeactivateAccountInput {
  @Field()
  deactivate_status: boolean;
}
