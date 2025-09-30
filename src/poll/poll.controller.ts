import { api, APIError } from 'encore.dev/api';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollInterface } from './interfaces/poll.interface';
import applicationContext from '../applicationContext';
import { getAuthData } from '~encore/auth';


export const createPoll = api(
  { method: 'POST', path: '/polls', auth: true, expose: true },
  async (req: CreatePollDto): Promise<{ poll: PollInterface }> => {
    const user = getAuthData();
    if (!user) {
      throw APIError.unauthenticated('User not authenticated');
    }
    const { pollService } = await applicationContext;

    const poll = await pollService.create(parseInt(user.userID), req);
    return { poll };
  },
);

export const getPolls = api(
  { method: 'GET', path: '/polls', auth: true, expose: true },
  async (): Promise<{ polls: PollInterface[] }> => {
    const user = getAuthData();
    if (!user) {
      throw APIError.unauthenticated('User not authenticated');
    }
    const { pollService } = await applicationContext;

    const polls = await pollService.findAllByUser(parseInt(user.userID));
    return { polls: polls };
  });


export const getPollById = api(
  { method: 'GET', path: '/polls/:id', auth: true, expose: true },
  async ({ id }: { id: number }): Promise<{ poll: PollInterface }> => {
    const user = getAuthData();
    if (!user) {
      throw APIError.unauthenticated('User not authenticated');
    }
    const { pollService } = await applicationContext;

    const poll = await pollService.findOne(id);

    return { poll };
  });

export const updatePoll = api(
  { method: 'PUT', path: '/polls/:id', auth: true, expose: true },
  async ({ id, ...req }: { id: number } & Partial<CreatePollDto>): Promise<{ message: string }> => {
    const user = getAuthData();
    if (!user) {
      throw APIError.unauthenticated('User not authenticated');
    }
    const { pollService } = await applicationContext;

    await pollService.update(id, req);
    return { message: 'Poll updated successfully' };
  },
);

export const deletePoll = api(
  { method: 'DELETE', path: '/polls/:id', auth: true, expose: true },
  async ({ id }: { id: number }): Promise<{ message: string }> => {
    const user = getAuthData();
    if (!user) {
      throw APIError.unauthenticated('User not authenticated');
    }
    const { pollService } = await applicationContext;

    await pollService.remove(id);
    return { message: 'Poll deleted successfully' };
  });