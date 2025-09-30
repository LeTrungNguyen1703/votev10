import { PollInterface } from '../../poll/interfaces/poll.interface';
import { VoteInterface } from '../../vote/interfaces/vote.interface';

export interface UserInterface {
  id: number;
  username: string;
  email: string;
}

export interface UsersInterface {
  users: UserInterface[];
}

export interface UserWithPolls extends UserInterface {
  polls: PollInterface[];
}

export interface UserWithVotes extends UserInterface {
  votes: VoteInterface[];
}

