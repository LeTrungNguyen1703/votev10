import { api } from 'encore.dev/api';
import { CreateVoteDto } from './dto/create-vote.dto';
import applicationContext from '../applicationContext';
import { ParseIntPipe } from '@nestjs/common';
import { getAuthData } from '~encore/auth'

export const create = api(
  { expose: true, path: '/vote', method: 'POST', auth: true },
  async (dto: CreateVoteDto) => {
    const user = getAuthData();
    const { voteService } = await applicationContext;
    return voteService.create(Number(user!.userID), dto);
  },
);

export const remove = api(
  { expose: true, path: '/vote/:id', method: 'DELETE', auth: true },
  async ({ id }: { id: number }) => {
    const { voteService } = await applicationContext;
    return voteService.remove(Number(id));
  },
);