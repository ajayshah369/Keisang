import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  Get,
  Res,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminsService } from './admins.service';
import { AdminJwtAuthGuard } from '../admin-jwt/jwt-auth.guard';
import { AdminLoginDto } from './dto/admin-login-dto';
import { Response } from 'express';

@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminsService: AdminsService,
  ) {}

  @Post('login')
  async login(@Body() body: AdminLoginDto, @Res() res: Response) {
    const admin = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const data = await this.authService.login(admin);

    res.cookie('access_token', data.access_token, {
      httpOnly: true,
    });

    res.json(data);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async getAuth(@Request() req: any) {
    return {
      message: 'Auth success',
      data: req.user,
    };
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');

    res.json({
      message: 'Logout success',
    });
  }
}
