import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BrandApplicationsService } from './brand-applications.service';
import { CreateBrandApplicationDto } from './dto/create-brand-application.dto';
import { UpdateBrandApplicationDto } from './dto/update-brand-application.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Request } from 'express';

@ApiTags('Brand Applications')
@Controller('brand-applications')
export class BrandApplicationsController {
  constructor(private brandApplicationsService: BrandApplicationsService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new brand application (Step 1-5 onboarding wizard)' })
  @ApiResponse({ status: 201, description: 'Brand application submitted successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or missing required fields' })
  @ApiResponse({ status: 409, description: 'Duplicate application or brand slug exists' })
  async createApplication(
    @Body() dto: CreateBrandApplicationDto,
    @Req() req: Request,
  ) {
    // If request contains an active JWT user in context, use their ID
    const authenticatedUserId = (req as any).user?.id;
    return this.brandApplicationsService.createApplication(dto, authenticatedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user brand application and status' })
  @ApiResponse({ status: 200, description: 'Returns brand application details' })
  @ApiResponse({ status: 404, description: 'No application found' })
  async getOwnApplication(@CurrentUser('id') userId: string) {
    return this.brandApplicationsService.getOwnApplication(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update brand application when additional information is requested' })
  @ApiResponse({ status: 200, description: 'Application updated' })
  @ApiResponse({ status: 403, description: 'Cannot update application in current status' })
  async updateOwnApplication(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateBrandApplicationDto,
  ) {
    return this.brandApplicationsService.updateOwnApplication(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/submit')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Resubmit brand application after updating requested information' })
  @ApiResponse({ status: 200, description: 'Application resubmitted and status set to PENDING_APPROVAL' })
  async resubmitOwnApplication(@CurrentUser('id') userId: string) {
    return this.brandApplicationsService.resubmitOwnApplication(userId);
  }
}
