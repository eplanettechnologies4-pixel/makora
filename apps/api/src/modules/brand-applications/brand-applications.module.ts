import { Module } from '@nestjs/common';
import { BrandApplicationsService } from './brand-applications.service';
import { BrandApplicationsController } from './brand-applications.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [BrandApplicationsController],
  providers: [BrandApplicationsService],
  exports: [BrandApplicationsService],
})
export class BrandApplicationsModule {}
