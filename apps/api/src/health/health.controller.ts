import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('System Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Comprehensive health check for API, Database, and Redis' })
  @ApiResponse({ status: 200, description: 'Health status payload' })
  async getHealth() {
    return this.healthService.getFullHealth();
  }

  @Get('live')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liveness probe (returns 200 if process is running)' })
  getLiveness() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe for traffic routing' })
  async getReadiness() {
    const health = await this.healthService.getFullHealth();
    return {
      ready: health.services.database.status === 'connected',
      details: health.services,
      timestamp: health.timestamp,
    };
  }
}
