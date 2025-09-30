import { api, APIError } from 'encore.dev/api';
import { UserInterface } from './interfaces/user-interface';
import { CreateUserDto } from './dto/create-user.dto';
import applicationContext from '../applicationContext';
import { getAuthData } from '~encore/auth'

export const create = api(
  { expose: true, method: 'POST', path: '/user' },
  async (dto: CreateUserDto): Promise<UserInterface> => {
    const { userService } = await applicationContext;
    return userService.create(dto);
  },
);

export const findById = api(
  { expose: true, method: 'GET', path: '/user/:id' },
  async ({ id }: { id: number }): Promise<{ user: UserInterface }> => {
    const { userService } = await applicationContext;
    return { user: await userService.findOne(id) };
  },
);

export const findAll = api(
  { expose: true, method: 'GET', path: '/user' },
  async (): Promise<{ users: UserInterface[] }> => {
    const { userService } = await applicationContext;
    return { users: await userService.findAll() };
  },
);

export const update = api(
  { expose: true, method: 'PUT', path: '/user/:id' },
  async ({ id, ...dto }: { id: number } & Partial<CreateUserDto>): Promise<{ messages: string }> => {
    const { userService } = await applicationContext;
    await userService.update(id, dto);

    return { messages: 'User updated successfully' };
  },
);

export const remove = api(
  { expose: true, method: 'DELETE', path: '/user/:id' },
  async ({ id }: { id: number }): Promise<{ messages: string }> => {
    const { userService } = await applicationContext;
    await userService.remove(id);
    return { messages: 'User deleted successfully' };
  },
);

export const getProfile = api(
  { expose: true, method: 'GET', path: '/user/profile', auth: true },
  async (): Promise<{ user: UserInterface }> => {
    const user = getAuthData();
    if (!user) {
      throw APIError.notFound('User not found in auth data');
    }
    const { userID, ...result } = user;
    return {
      user: {
        ...result,
        id: Number(userID),
      },
    };
  },
);