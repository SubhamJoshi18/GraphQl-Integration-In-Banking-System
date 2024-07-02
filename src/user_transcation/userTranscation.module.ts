import { Module } from '@nestjs/common';
import { UserTranscationResolver } from './userTranscation.resolver';
import { UserTranscationService } from './userTranscation.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserTranscationResolver, UserTranscationService],
})
export class UserTranscationModule {}
