import { PrismaClient } from '@prisma/client';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DB } from '../../database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const fallbackUrl = process.env.DATABASE_URL;
    const datasourceUrl = DB?.connectionString ?? fallbackUrl;

    super({
      datasources: {
        db: {
          url: datasourceUrl,
        },

      },
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      this.logger.log(`Using DB.connectionString: ${DB.connectionString ?? process.env.DATABASE_URL}`);
      await this.$connect();
      // Run a lightweight connectivity check
      try {
        // Use a raw query that works on Postgres
        // Type is any because $queryRaw returns unknown
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await (this as any).$queryRaw`SELECT 1 as ok`;
        this.logger.log(`Database connectivity test result: ${JSON.stringify(res)}`);
      } catch (pingErr) {
        this.logger.warn('Connectivity test failed after successful connect', pingErr as Error);
      }

      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database', error as Error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }
}