import { api } from 'encore.dev/api';
import { LoginRequest } from './dto/create-auth.dto';
import applicationContext from '../applicationContext';


export const login = api(
  { expose: true, method: 'POST', path: '/auth/login' },
  async (dto: LoginRequest): Promise<{ access_token: string }> => {
    const { authService } = await applicationContext;
    return authService.signIn(dto);
  },
);