export interface PollInterface {
  id: number;
  question: string;
  options: { option: string; votes: number }[];
  createdBy: { username: string} | null;
}
