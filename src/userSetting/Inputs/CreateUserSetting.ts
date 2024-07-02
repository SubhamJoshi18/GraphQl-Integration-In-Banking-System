import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserSettingInput {
  @Field()
  receiveNotifications: boolean;

  @Field()
  receiveEmails: boolean;
}
