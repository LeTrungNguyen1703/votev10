import { api } from 'encore.dev/api';
import applicationContext from '../applicationContext';
import { CreateUserDto } from './dto/create-user.dto';
import { Logger } from '@nestjs/common';

export const logger = () => {
  return new Logger();
};

interface User {
  id: number;
  name: string;
  surname: string;
  age: number;
}

interface GetAllUserResponse {
  users: User[];
}

export const getAllUser = api(
  { method: 'GET', path: '/user', expose: true },
  async (): Promise<GetAllUserResponse> => {
    const { userService } = await applicationContext;
    const users = await userService.findAll();
    logger().log(users);
    return { users};
  },
);

export const createUser = api(
  { method: 'POST', path: '/user', expose: true },
  async (dto: CreateUserDto) => {
    const { userService } = await applicationContext;
    const users = await userService.findAll();
    logger().log(users);
    return { users: await userService.create(dto) };
  },
);