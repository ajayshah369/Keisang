// users/mappers/user.mapper.ts
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './admins.models';
import { AdminEntity } from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';

export class AdminMapper {
  static toEntity(adminDto: CreateAdminDto | UpdateAdminDto): AdminEntity {
    return {
      username: adminDto.username,
      role: adminDto.role,
      first_name: adminDto.first_name,
      last_name: adminDto.last_name,
      email: adminDto.email,
      password: adminDto.password,
      is_active: adminDto.is_active,
    };
  }

  static toModel(adminEntity: AdminEntity): Partial<Admin> {
    return {
      first_name: adminEntity.first_name,
      last_name: adminEntity.last_name,
      email: adminEntity.email,
      password: adminEntity.password,
      role: adminEntity.role,
      is_active: adminEntity.is_active,
      username: adminEntity.username,
    };
  }

  static modelToEntity(
    adminModel: Admin,
    withPassword: boolean = false,
  ): AdminEntity {
    return {
      uuid: adminModel.uuid,
      first_name: adminModel.first_name,
      last_name: adminModel.last_name,
      email: adminModel.email,
      role: adminModel.role,
      password: withPassword ? adminModel.password : undefined,
      is_active: adminModel.is_active,
      username: adminModel.username,
    };
  }
}
