import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PollService } from '../poll/poll.service';

@Injectable()
export class VoteService {
  constructor(@Inject(PrismaService) private readonly prismaService: PrismaService
    , @Inject(PollService) private readonly pollService: PollService,
  ) {
  }

  async create(userId: number, createVoteDto: CreateVoteDto) {
    const { pollId, option } = createVoteDto;

    const pollForCheck = await this.prismaService.poll.findUnique({ where: { id: pollId } });

    if (!pollForCheck) {
      throw new NotFoundException('Poll not exits');
    }

    await this.prismaService.vote.create({
      data: {
        userId,
        pollId,
        option,
      },
    });
    const pollAfterVoted = await this.pollService.findOne(pollId);

    const { id, createdBy, ...rest } = pollAfterVoted;
    const username = createdBy!.username;
    return {
      id,
      createdBy,
      ...rest,
    };
  }

  findAll() {
    return `This action returns all vote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vote`;
  }

  update(id: number, updateVoteDto: UpdateVoteDto) {
    return `This action updates a #${id} vote`;
  }

  remove(id: number) {
    return this.prismaService.vote.delete({ where: { id } });
  }
}
