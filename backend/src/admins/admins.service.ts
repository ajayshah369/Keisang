import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Admin } from './admins.models';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { AdminMapper } from './admin.mapper';
import { GetAdminsQueryDto } from './dto/get-admins-query.dto';

@Injectable()
export class AdminsService implements OnModuleInit {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
  ) {}

  async onModuleInit() {
    const superAdmin: CreateAdminDto = {
      username: 'super-admin',
      email: 'super-admin@example.com',
      password: 'password',
      role: 'super-admin',
      is_active: true,
      first_name: 'Super',
      last_name: 'Admin',
    };

    const existingAdmin = await this.adminModel.findOne({
      where: {
        username: superAdmin.username,
      },
    });

    if (!existingAdmin) {
      await this.create(superAdmin);
      Logger.verbose('Super admin created successfully with');
      Logger.verbose('Username: super-admin');
      Logger.verbose('Password: password');
    } else {
      Logger.verbose('Super admin already exists');
      Logger.verbose('Username: super-admin');
      Logger.verbose('Password: password');
    }
  }

  async create(createAdminDto: CreateAdminDto): Promise<AdminEntity> {
    const adminEntity = AdminMapper.toEntity(createAdminDto);
    const adminModel = await this.adminModel.create(
      AdminMapper.toModel(adminEntity),
    );
    return AdminMapper.modelToEntity(adminModel);
  }

  async findByEmail(
    email: string,
    withPassword: boolean = false,
  ): Promise<AdminEntity | null> {
    const admin = await this.adminModel.findOne({ where: { email } });
    return admin ? AdminMapper.modelToEntity(admin, withPassword) : null;
  }

  async findByUsername(
    username: string,
    withPassword: boolean = false,
  ): Promise<AdminEntity | null> {
    const admin = await this.adminModel.findOne({ where: { username } });
    return admin ? AdminMapper.modelToEntity(admin, withPassword) : null;
  }

  async findByUuid(uuid: string): Promise<AdminEntity | null> {
    const admin = await this.adminModel.findOne({ where: { uuid } });
    return admin ? AdminMapper.modelToEntity(admin) : null;
  }

  async update(
    uuid: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<AdminEntity> {
    const result = await this.adminModel.update(
      AdminMapper.toModel(updateAdminDto),
      { where: { uuid }, returning: true },
    );

    if (result[0] === 0) {
      return null;
    }

    const updatedAdmin = result[1][0];

    if (!updatedAdmin) {
      throw new Error('Admin not found');
    }
    return AdminMapper.modelToEntity(updatedAdmin);
  }

  async getAdmins(
    getAdminsQueryDto: GetAdminsQueryDto,
  ): Promise<AdminEntity[]> {
    const admins = await this.adminModel.findAll({
      limit: getAdminsQueryDto.limit,
      offset: (getAdminsQueryDto.page - 1) * getAdminsQueryDto.limit,
      where: {
        [Op.or]: [
          {
            first_name: {
              [Op.iLike]: `%${getAdminsQueryDto.text}%`,
            },
          },
          {
            last_name: {
              [Op.iLike]: `%${getAdminsQueryDto.text}%`,
            },
          },
          {
            username: {
              [Op.iLike]: `%${getAdminsQueryDto.text}%`,
            },
          },
        ],
      },
    });
    return admins.map((admin) => AdminMapper.modelToEntity(admin));
  }

  async getAdmin(uuid: string): Promise<AdminEntity> {
    const admin = await this.adminModel.findOne({
      where: {
        uuid,
      },
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    return AdminMapper.modelToEntity(admin);
  }
}
