import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import applicationContext from '../applicationContext';

@Injectable()
export class UserService {

  async create(createUserDto: CreateUserDto) {
    // Hash the provided password (field is named `passwordHash` in the DTO)
    const hashed = await bcrypt.hash(createUserDto.passwordHash, 10);

    const { prismaService } = await applicationContext;

    return prismaService.user.create({
      data: {
        ...createUserDto,
        passwordHash: hashed,
      },
      omit: {
        passwordHash: true,
      },
    });
  }

  async findAll() {
    const { prismaService } = await applicationContext;

    return prismaService.user.findMany({ omit: { passwordHash: true } });
  }

  async findOne(id: number) {
    const { prismaService } = await applicationContext;

    const user = await prismaService.user.findUnique({
      where: { id },
      omit: { passwordHash: true },
    });

    if (!user) {
      throw new Error(`User with ID ${id} does not exist.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>) {
    const { prismaService } = await applicationContext;
    try {
      // If a new password is provided, hash it before updating
      if (updateUserDto.passwordHash) {
        updateUserDto.passwordHash = await bcrypt.hash(updateUserDto.passwordHash, 10);
      }

      return prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`User with ID ${id} does not exist.`);
      }
    }
  }

  async remove(id: number) {
    const { prismaService } = await applicationContext;
    try {
      return prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`User with ID ${id} does not exist.`);
      }
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    const { prismaService } = await applicationContext;
    const user = await prismaService.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
