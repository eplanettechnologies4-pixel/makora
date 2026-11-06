import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginDto } from './dto/login.dto';
import { comparePassword, hashToken } from '../../common/utils/crypto.util';
import { UserRoleType, User } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generates Access and Refresh Tokens
   */
  async generateTokens(user: { id: string; email: string; role: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessSecret = this.configService.get<string>(
      'jwt.accessSecret',
      'dev_jwt_access_secret_change_in_production_9f8e7d6c5b4a',
    );
    const accessExpiresIn = this.configService.get<string>(
      'jwt.accessExpiresIn',
      '15m',
    );

    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      'dev_jwt_refresh_secret_change_in_production_1a2b3c4d5e6f',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
      '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Sets secure HTTP-only cookies on the response
   */
  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = this.configService.get<string>('nodeEnv') === 'production';

    // 15 minutes for access token
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    // 7 days for refresh token
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  /**
   * Clears auth cookies
   */
  clearAuthCookies(res: Response) {
    const isProduction = this.configService.get<string>('nodeEnv') === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? 'strict' : 'lax') as 'strict' | 'lax',
      path: '/',
    };

    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
  }

  /**
   * Register a new Customer account
   */
  async registerCustomer(dto: RegisterCustomerDto) {
    if (!dto.agreeToTerms) {
      throw new BadRequestException('You must accept the terms and conditions to register');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('An account with this email address already exists');
    }

    // Role is strictly locked to CUSTOMER
    const newUser = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: UserRoleType.CUSTOMER,
    });

    const tokens = await this.generateTokens(newUser);
    const hashedRefresh = hashToken(tokens.refreshToken);
    await this.usersService.updateRefreshToken(newUser.id, hashedRefresh);

    const safeUser = await this.usersService.getUserWithBrand(newUser.id);

    return {
      user: safeUser,
      tokens,
    };
  }

  /**
   * Universal Login (Customer, Brand Owner, Admin)
   */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await comparePassword(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }

    const tokens = await this.generateTokens(user);
    const hashedRefresh = hashToken(tokens.refreshToken);

    await this.usersService.updateRefreshToken(user.id, hashedRefresh);
    await this.usersService.updateLastLogin(user.id);

    const safeUser = await this.usersService.getUserWithBrand(user.id);

    return {
      user: safeUser,
      tokens,
    };
  }

  /**
   * Refresh Token with rotation
   */
  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      'dev_jwt_refresh_secret_change_in_production_1a2b3c4d5e6f',
    );

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh session');
    }

    const hashedInput = hashToken(refreshToken);
    if (user.hashedRefreshToken !== hashedInput) {
      // Possible token reuse attempt: invalidate token immediately
      await this.usersService.updateRefreshToken(user.id, null);
      throw new UnauthorizedException('Revoked or invalidated refresh token');
    }

    // Rotate tokens
    const tokens = await this.generateTokens(user);
    const newHashedRefresh = hashToken(tokens.refreshToken);
    await this.usersService.updateRefreshToken(user.id, newHashedRefresh);

    const safeUser = await this.usersService.getUserWithBrand(user.id);

    return {
      user: safeUser,
      tokens,
    };
  }

  /**
   * Logout user by clearing stored refresh token
   */
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { success: true, message: 'Logged out successfully' };
  }
}
