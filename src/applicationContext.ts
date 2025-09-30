import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PollService } from './poll/poll.service';
import { VoteService } from './vote/vote.service';
import { PollModule } from './poll/poll.module';
import { VoteModule } from './vote/vote.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

// Mounting the application as bare Nest standalone application so that we can use
// the Nest services inside our Encore endpoints
const applicationContext: Promise<{
  userService: UserService,
  pollService: PollService,
  voteService: VoteService,
  authService: AuthService,
  jwtService: JwtService,
  prismaService: PrismaService
}> =
  NestFactory.createApplicationContext(AppModule).then((app) => {
    return {
      userService: app.select(UserModule).get(UserService, { strict: true }),
      pollService: app.select(PollModule).get(PollService, { strict: true }),
      voteService: app.select(VoteModule).get(VoteService, { strict: true }),
      authService: app.select(AuthModule).get(AuthService, { strict: true }),
      jwtService: app.select(JwtModule).get(JwtService, { strict: true }),
      prismaService: app.select(PrismaModule).get(PrismaService, { strict: true }),
    };
  });

export default applicationContext;
