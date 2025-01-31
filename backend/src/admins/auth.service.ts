import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AdminJwtPayload } from '../admin-jwt/jwt-payload.interface';
import { AdminsService } from './admins.service';
import { AdminEntity } from './entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AdminEntity | null> {
    const admin = await this.adminsService.findByUsername(username, true);
    if (admin && (await bcrypt.compare(password, admin.password))) {
      admin.password = undefined;
      return admin;
    }
    return null;
  }

  async login(admin: AdminEntity) {
    const payload: AdminJwtPayload = { uuid: admin.uuid };
    return {
      access_token: this.jwtService.sign(payload),
      message: 'Login successful',
      data: admin,
    };
  }
}
