import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserSettingInput {
  @Field()
  receivedNotifications: boolean;

  @Field()
  receivedEmails: boolean;
}
