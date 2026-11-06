import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private redisClient: Redis | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.initRedis();
  }

  private initRedis() {
    try {
      let host = this.configService.get<string>('redis.host', '127.0.0.1');
      if (host === 'localhost') host = '127.0.0.1';
      const port = this.configService.get<number>('redis.port', 6379);
      const password = this.configService.get<string | undefined>('redis.password');

      this.redisClient = new Redis({
        host,
        port,
        password,
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        lazyConnect: false,
        retryStrategy: () => 1000,
      });
    } catch (err: any) {
      this.logger.warn(`Redis client initialization notice: ${err.message}`);
    }
  }

  async checkDatabase(): Promise<{ status: 'connected' | 'disconnected'; latencyMs?: number; message?: string }> {
    const result = await this.prisma.ping();
    if (result.connected) {
      return {
        status: 'connected',
        latencyMs: result.latencyMs,
      };
    }
    return {
      status: 'disconnected',
      latencyMs: result.latencyMs,
      message: result.error || 'Database unreachable',
    };
  }

  async checkRedis(): Promise<{ status: 'connected' | 'disconnected'; latencyMs?: number; message?: string }> {
    if (!this.redisClient) {
      this.initRedis();
    }
    if (!this.redisClient) {
      return { status: 'disconnected', message: 'Redis client not configured' };
    }

    const start = Date.now();
    try {
      const response = await Promise.race([
        this.redisClient.ping(),
        new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Redis ping timeout (1500ms)')), 1500)),
      ]);

      if (response === 'PONG') {
        return {
          status: 'connected',
          latencyMs: Date.now() - start,
        };
      }
      return {
        status: 'disconnected',
        message: `Unexpected response: ${response}`,
      };
    } catch (err: any) {
      return {
        status: 'disconnected',
        latencyMs: Date.now() - start,
        message: err.message,
      };
    }
  }

  async getFullHealth() {
    const [dbHealth, redisHealth] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const memoryUsage = process.memoryUsage();
    const isHealthy = dbHealth.status === 'connected';

    return {
      status: isHealthy ? 'ok' : 'degraded',
      appName: this.configService.get<string>('appName', 'Makaura Beauty API'),
      environment: this.configService.get<string>('nodeEnv', 'development'),
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
      services: {
        database: dbHealth,
        redis: redisHealth,
      },
    };
  }
}
