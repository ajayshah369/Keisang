import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as csv from 'csv-parser';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { AdminJwtAuthGuard } from '../admin-jwt/jwt-auth.guard';
import { VehiclesAdminService } from './vehicles.admin.service';
import { Readable } from 'stream';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { GraphDataQueryDto } from './dto/graph-data-query.dto';
import { HistoryLogQueryDto } from './dto/history-log-query.dto';
import { SummaryQueryDto } from './dto/summary-query.dto';

@Controller('admin/vehicles')
@UseGuards(AdminJwtAuthGuard)
export class VehiclesAdminController {
  constructor(private readonly vehiclesAdminService: VehiclesAdminService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv') {
          return cb(
            new BadRequestException('Only CSV files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required!');
    }

    const results: Record<string, string>[] = [];
    const stream = Readable.from(file.buffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) =>
          results.push({
            ...data,
            custom_label: data.custom_label ?? data.custom_label_0,
          }),
        )
        .on('end', resolve)
        .on('error', reject);
    });

    const newData: CreateVehicleDto[] = [];
    // Validate the CSV data using DTO
    for (let i = 0; i < results.length; i++) {
      const dto = plainToClass(CreateVehicleDto, results[i]);
      const errors = await validate(dto);
      if (errors.length > 0) {
        console.log(errors);
        throw new BadRequestException('Invalid CSV data at line ' + (i + 1));
      }
      newData.push(dto);
    }

    await this.vehiclesAdminService.createVehicleInBulk(newData);

    return { message: 'File uploaded successfully' };
  }

  @Get('dealers')
  async getAllDealers() {
    const data = await this.vehiclesAdminService.getAllDealers();

    return {
      data,
    };
  }

  @Get('brands')
  async getAllBrands() {
    const data = await this.vehiclesAdminService.getAllBrands();

    return {
      data,
    };
  }

  @Get('summary')
  async getSummary(@Query() query: SummaryQueryDto) {
    const data = await this.vehiclesAdminService.getSummary(query);

    return {
      data,
    };
  }

  @Get('inventory-graph-data')
  async getInventoryGraphData(@Query() query: GraphDataQueryDto) {
    const data = await this.vehiclesAdminService.getInventoryGraphData(query);

    return data;
  }

  @Get('average-msrp-graph-data')
  async getAverageMsrpGraphData(@Query() query: GraphDataQueryDto) {
    const data = await this.vehiclesAdminService.getAverageMsrpGraphData(query);

    return data;
  }

  @Get('history-log')
  async getHistoryLog(@Query() query: HistoryLogQueryDto) {
    const data = await this.vehiclesAdminService.getHistoryLog(query);

    return data;
  }
}
