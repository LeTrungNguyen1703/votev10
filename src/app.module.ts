import { Module } from '@nestjs/common';
import { PollModule } from './poll/poll.module';
import { VoteModule } from './vote/vote.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule, PollModule, VoteModule, UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {
}
