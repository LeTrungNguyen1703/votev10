import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { PollModule } from '../poll/poll.module';

@Module({
  imports: [PollModule],
  providers: [VoteService],
})
export class VoteModule {
}
