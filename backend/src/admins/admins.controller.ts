import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminJwtAuthGuard } from '../admin-jwt/jwt-auth.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { GetAndUpdateAdminParamDto } from './dto/get-and-update-admin-param-dto';
import { GetAdminsQueryDto } from './dto/get-admins-query.dto';

@Controller('admin/admins')
@UseGuards(AdminJwtAuthGuard)
export class AdminController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  async createAdmin(@Body() body: CreateAdminDto) {
    const admin = await this.adminsService.create(body);

    return {
      message: 'Admin created successfully',
      data: admin,
    };
  }

  @Put(':uuid')
  async updateAdmin(
    @Param() param: GetAndUpdateAdminParamDto,
    @Body() body: UpdateAdminDto,
  ) {
    const admin = await this.adminsService.update(param.uuid, body);

    return {
      message: 'Admin updated successfully',
      data: admin,
    };
  }

  @Get()
  async getAdmins(@Query() query: GetAdminsQueryDto) {
    const admins = await this.adminsService.getAdmins(query);

    return {
      message: 'Admins fetched successfully',
      data: admins,
    };
  }

  @Get('/:uuid')
  async getAdmin(@Param() param: GetAndUpdateAdminParamDto) {
    const admin = await this.adminsService.getAdmin(param.uuid);

    return {
      message: 'Admin fetched successfully',
      data: admin,
    };
  }
}
