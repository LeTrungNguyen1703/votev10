import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequest } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtPayload';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(@Inject(UserService) private readonly usersService: UserService, @Inject(JwtService) private readonly jwtService: JwtService) {
  }

  async signIn(loginRequest: LoginRequest) {
    const user = await this.handleMissingCredentials(loginRequest);

    const payload: JwtPayload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async handleMissingCredentials(loginRequest: LoginRequest) {
    const { username, password } = loginRequest;
    const user = await this.usersService.findOneByUsername(username);
    if (!bcrypt.compareSync(password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
