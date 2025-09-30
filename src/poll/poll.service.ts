import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PrismaService } from '../prisma/prisma.service';
import { APIError } from 'encore.dev/api';
import { Poll } from '@prisma/client';

@Injectable()
export class PollService {
  constructor(@Inject(PrismaService) private readonly prismaService: PrismaService) {
  }

  async create(userID: number, createPollDto: CreatePollDto) {
    // Create poll với JSON options
    const poll = await this.prismaService.poll.create({
      data: {
        question: createPollDto.question,
        createdBy: userID,
        options: createPollDto.options, // ← Prisma tự convert array to JSON
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    // Get vote counts for each option
    const voteStats = await this.getVoteStats(poll.id);

    return {
      id: poll.id,
      question: poll.question,
      createdBy: poll.user,
      options: (poll.options as string[]).map(option => ({
        option,
        votes: voteStats[option] || 0, // ← Map vote count by option string
      })),
    };
  }

  async findAll() {
    return this.prismaService.poll.findMany({
      include: {
        user: {
          omit: { passwordHash: true, createdAt: true },
        },
      },
    });
  }

  async findAllByUser(userID: number) {
    const polls = await this.prismaService.poll.findMany({
      where: { createdBy: userID },
      include: {
        user: {
          select: {
            username: true,
            id: true,
            email: true,
          },
        },
      },
    });

    const getAllVoteStats = await Promise.all(polls.map(poll => this.getVoteStats(poll.id)));

    return polls.map(poll => ({
      id: poll.id,
      question: poll.question,
      createdBy: poll.user,
      options: (poll.options as string[]).map(option => ({
        option,
        votes: getAllVoteStats.map(vote => vote[option] || 0).reduce((a, b) => a + b, 0),
      })),
    }));
  }

  async findOne(id: number) {
    const poll = await this.getPollById(id);
    return this.buildPollPayload(poll);
  }

  async getPollById(id: number) {
    const poll = await this.prismaService.poll.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!poll) throw new NotFoundException(`Poll with ID ${id} does not exist.`);

    return poll;
  }

  async buildPollPayload(poll: any) {
    const voteStats = await this.getVoteStats(poll.id);

    return {
      id: poll.id,
      question: poll.question,
      createdBy: poll.user,
      options: (poll.options as string[]).map(option => ({
        option,
        votes: voteStats[option] || 0,
      })),
    };
  }


  async update(id: number, updatePollDto: Partial<CreatePollDto>) {
    const count = await this.prismaService.poll.updateMany({
      where: { id },
      data: updatePollDto,
    });
    if (count.count === 0) {
      throw new NotFoundException(`Poll with ID ${id} does not exist.`);
    }
  }

  async remove(id: number) {
    const count = await this.prismaService.poll.deleteMany({
      where: { id },
    });
    if (count.count === 0) {
      throw new NotFoundException(`Poll with ID ${id} does not exist.`);
    }
  }


  // Helper method to get vote statistics
  private async getVoteStats(pollId: number): Promise<Record<string, number>> {
    const votes = await this.prismaService.vote.groupBy({
      by: ['option'],
      where: { pollId },
      _count: { option: true },
    });

    return votes.reduce((acc, vote) => {
      acc[vote.option] = vote._count.option;
      return acc;
    }, {} as Record<string, number>);
  }

}
