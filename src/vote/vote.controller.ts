import { api, StreamOut } from 'encore.dev/api';
import { CreateVoteDto } from './dto/create-vote.dto';
import applicationContext from '../applicationContext';
import { getAuthData } from '~encore/auth';
import { PollInterface } from '../poll/interfaces/poll.interface';

export const create = api(
  { expose: true, path: '/vote', method: 'POST', auth: true },
  async (dto: CreateVoteDto): Promise<{ poll: PollInterface }> => {
    const user = getAuthData();
    const { voteService } = await applicationContext;
    return { poll: await voteService.create(Number(user!.userID), dto) };
  },
);

export const remove = api(
  { expose: true, path: '/vote/:id', method: 'DELETE', auth: true },
  async ({ id }: { id: number }) => {
    const { voteService } = await applicationContext;
    return voteService.remove(Number(id));
  },
);

// Used to pass initial data.
interface LogHandshake {
  rows: number;
}

// What the server sends over the stream.
interface LogMessage {
  message: PollInterface;
}

// This function generates an async iterator that yields mocked log rows
async function* mockedLogs(rows: number, stream: StreamOut<LogMessage>) {
  for (let i = 0; i < rows; i++) {
    yield new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`Log row ${i + 1}`);
      }, 500);
    });
  }

  // Close the stream when all logs have been sent
  await stream.close();
}