import { APIError, Gateway, Header } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwtPayload';
import applicationContext from '../applicationContext';

interface AuthParams {
  authorization: Header<'Authorization'>;
}

interface AuthData {
  userID: string;
  username: string;
  email: string;
}

// The function passed to authHandler will be called for all incoming API call that requires authentication.
export const myAuthHandler = authHandler(
  async (params: AuthParams): Promise<AuthData> => {
    const token = params.authorization?.replace('Bearer ', '');
    if (!token) {
      throw APIError.unauthenticated('no token provided');
    }

    try {
      const { userService, jwtService } = await applicationContext;

      const result: JwtPayload = await jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const { id, username, email } = await userService.findOneByUsername(result.username);

      return {
        userID: id.toString(),
        username: username,
        email: email,
      };
    } catch (e) {
      throw APIError.unauthenticated('invalid token', e as Error);
    }
  },
);

export const mygw = new Gateway({ authHandler: myAuthHandler });
