import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrandApplicationsModule } from './modules/brand-applications/brand-applications.module';
import { BrandsModule } from './modules/brands/brands.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    HealthModule,
    AuditLogsModule,
    UsersModule,
    AuthModule,
    BrandApplicationsModule,
    BrandsModule,
    AdminModule,
  ],
})
export class AppModule {}

