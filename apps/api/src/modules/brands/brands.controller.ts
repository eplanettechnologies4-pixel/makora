import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Brands')
@Controller('brands')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated brand owner active brand' })
  @ApiResponse({ status: 200, description: 'Brand details returned' })
  @ApiResponse({ status: 404, description: 'No brand found' })
  async getMyBrand(@CurrentUser('id') userId: string) {
    return this.brandsService.getMyBrand(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current authenticated brand profile' })
  @ApiResponse({ status: 200, description: 'Brand profile updated' })
  async updateMyBrand(
    @CurrentUser('id') userId: string,
    @Body() data: any,
  ) {
    return this.brandsService.updateBrandProfile(userId, data);
  }
}
