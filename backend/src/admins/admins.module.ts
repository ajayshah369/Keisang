import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Admin } from './admins.models';
import { AdminsService } from './admins.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminController } from './admins.controller';

@Module({
  imports: [SequelizeModule.forFeature([Admin])],
  providers: [AdminsService, AuthService],
  controllers: [AuthController, AdminController],
  exports: [AdminsService],
})
export class AdminsModule {}
