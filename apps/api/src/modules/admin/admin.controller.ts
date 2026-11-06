import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ApplicationFilterDto } from './dto/application-filter.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleType } from '@prisma/client';

@ApiTags('Admin / Brand Applications')
@Controller('admin/brand-applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleType.ADMIN, UserRoleType.SUPER_ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'List brand applications with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of applications' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires Admin or SuperAdmin role' })
  async listApplications(@Query() filter: ApplicationFilterDto) {
    return this.adminService.listApplications(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application details by ID' })
  @ApiResponse({ status: 200, description: 'Application details with masked banking and audit history' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async getApplicationById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getApplicationById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update brand application status (Approve, Reject, Request Info)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid transition or missing required reason' })
  async updateApplicationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') adminUserId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.adminService.updateApplicationStatus(id, adminUserId, dto);
  }
}
