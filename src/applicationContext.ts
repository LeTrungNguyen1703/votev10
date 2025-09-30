import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatsService } from './cats/cats.service';
import { CatsModule } from './cats/cats.module';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';

// Mounting the application as bare Nest standalone application so that we can use
// the Nest services inside our Encore endpoints
const applicationContext: Promise<{
  catsService: CatsService,
  userService: UsersService,
}> =
  NestFactory.createApplicationContext(AppModule).then(async (app) => {
    const prismaService = app.get(PrismaService);
    if (prismaService.onModuleInit) {
      await prismaService.onModuleInit();
    }
    return {
      catsService: app.select(CatsModule).get(CatsService, { strict: true }),
      userService: app.select(UsersModule).get(UsersService, { strict: true }),
    };
  });

export default applicationContext;
