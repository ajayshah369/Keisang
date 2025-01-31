import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { databaseProviders } from 'src/database/database.provider';
import { Vehicle } from './vehicles.models';
import { VehiclesAdminService } from './vehicles.admin.service';
import { VehiclesAdminController } from './vehicles.admin.controller';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  imports: [SequelizeModule.forFeature([Vehicle]), AdminsModule],
  providers: [...databaseProviders, VehiclesAdminService],
  controllers: [VehiclesAdminController],
})
export class VehiclesModule {}
