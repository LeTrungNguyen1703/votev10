import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    // Debug injection
    this.logger.log(`PrismaService injected: ${!!this.prisma}`);
    this.logger.debug(`PrismaService type: ${typeof this.prisma}`);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log('Creating user with payload:', JSON.stringify(createUserDto));
      const user = await this.prisma.user.create({
        data: createUserDto as any, // DTO shape matches Prisma model; cast to any for safety
      });
      this.logger.log('User created with id:', user.id);
      return user;
    } catch (error) {
      this.logger.error('Error creating user', error as Error);
      throw error;
    }
  }

  async findAll() {
    // Kiểm tra xem prisma có được inject đúng không
    if (!this.prisma) {
      this.logger.error('PrismaService not injected');
      throw new Error('PrismaService not injected');
    }
    this.logger.log('Fetching all users from DB');
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
