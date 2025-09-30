import { Module } from '@nestjs/common';
import { PollService } from './poll.service';

@Module({
  providers: [PollService],
  exports: [PollService],
})
export class PollModule {}
