import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';


@Module({
  providers: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {
}
