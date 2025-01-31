import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, QueryTypes } from 'sequelize';

import { Vehicle } from './vehicles.models';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleMapper } from './vehicle.mapper';
import { VehicleEntity } from './entities/vehicle.entity';
import { GraphDataQueryDto } from './dto/graph-data-query.dto';
import { HistoryLogQueryDto } from './dto/history-log-query.dto';
import { SummaryQueryDto } from './dto/summary-query.dto';

type SummaryType = {
  condition: string;
  count: number;
  msrp: number;
  avg_msrp: number;
};
type GetSummaryReturnType = {
  recentTimestamp: string;
  summary: SummaryType[];
};

type GraphDataType = {
  date: string;
  value: number;
};
type GraphDataReturnType = {
  type: string;
  data: GraphDataType[];
};

type PaginationType = {
  limit: number;
  page: number;
  total: number;
};

type SortType = {
  field: string;
  sort: 'asc' | 'desc';
};

type HistoryLogType = {
  date: string;
  new_inventory: number | null;
  new_total_msrp: number | null;
  new_average_msrp: number | null;
  used_inventory: number | null;
  used_total_msrp: number | null;
  used_average_msrp: number | null;
  cpo_inventory: number | null;
  cpo_total_msrp: number | null;
  cpo_average_msrp: number | null;
  total: number;
};

type HistoryLogReturnType = {
  sort: SortType;
  pagination: PaginationType;
  data: HistoryLogType[];
};

@Injectable()
export class VehiclesAdminService {
  constructor(
    @InjectModel(Vehicle)
    private readonly vehicleModel: typeof Vehicle,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}

  async createVehicleInBulk(
    data: CreateVehicleDto[],
  ): Promise<VehicleEntity[]> {
    const body = data
      .map((item) => VehicleMapper.toEntity(item))
      .map((item) => VehicleMapper.toModel(item));

    const transaction = await this.sequelize.transaction();

    let vehicles: Vehicle[];
    try {
      vehicles = await this.vehicleModel.bulkCreate(body, {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return vehicles.map((item) => VehicleMapper.modelToEntity(item));
  }

  async getAllDealers(): Promise<string[]> {
    const dealers = await this.vehicleModel.findAll({
      attributes: ['dealer'],
      group: ['dealer'],
    });

    return dealers.map((item) => item.dealer);
  }

  async getAllBrands(): Promise<string[]> {
    const brands = await this.vehicleModel.findAll({
      attributes: ['brand'],
      group: ['brand'],
    });

    return brands.map((item) => item.brand);
  }

  createWhereClause(
    queryDto: GraphDataQueryDto | SummaryQueryDto | HistoryLogQueryDto,
  ): string {
    let whereClause = '';

    if (queryDto.dealer) {
      whereClause += `vehicles.dealer ILIKE '${queryDto.dealer}'`;
    }

    if ('condition' in queryDto && queryDto.condition) {
      if (whereClause) {
        whereClause += ' AND ';
      }

      whereClause += `vehicles.condition = '${queryDto.condition}'`;
    }

    if (queryDto.brands) {
      if (whereClause) {
        whereClause += ' AND ';
      }

      whereClause += `vehicles.brand IN (:brands)`;
    }

    if (queryDto.durations && queryDto.durations.length > 0) {
      if (whereClause) {
        whereClause += ' AND ';
      }

      whereClause += '( ';

      for (let i = 0; i < queryDto.durations.length; i++) {
        if (i !== 0) {
          whereClause += ' OR ';
        }
        switch (queryDto.durations[i]) {
          case 'last_month':
            whereClause += `(vehicles."timestamp" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
              AND vehicles."timestamp" < DATE_TRUNC('month', CURRENT_DATE))`;
            break;
          case 'this_month':
            whereClause += `(vehicles."timestamp" >= DATE_TRUNC('month', CURRENT_DATE)
              AND vehicles."timestamp" < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month'))`;
            break;
          case 'last_3_months':
            whereClause += `(vehicles."timestamp" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')
              AND vehicles."timestamp" < DATE_TRUNC('month', CURRENT_DATE))`;
            break;
          case 'last_6_months':
            whereClause += `(vehicles."timestamp" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
              AND vehicles."timestamp" < DATE_TRUNC('month', CURRENT_DATE))`;
            break;
          case 'this_year':
            whereClause += `(vehicles."timestamp" >= DATE_TRUNC('year', CURRENT_DATE)
              AND vehicles."timestamp" < DATE_TRUNC('year', CURRENT_DATE + INTERVAL '1 year'))`;
            break;
          case 'last_year':
            whereClause += `(vehicles."timestamp" >= DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 year')
              AND vehicles."timestamp" < DATE_TRUNC('year', CURRENT_DATE))`;
            break;
          default:
            break;
        }
      }

      whereClause += ' )';
    }

    return whereClause;
  }

  async getSummary(queryDto: SummaryQueryDto): Promise<GetSummaryReturnType> {
    const whereClause = this.createWhereClause(queryDto);

    const getRecentTimestampQuery = `
      SELECT
        TO_CHAR(vehicles."timestamp", 'MM/DD/YY') as "timestamp"
      FROM
        vehicles
      ${whereClause ? `WHERE ${whereClause}` : ''}
      ORDER BY
        vehicles."timestamp" DESC
      LIMIT
        1;
    `;

    const getSummaryQuery = `
      SELECT
        condition,
        COUNT(*) AS COUNT,
        SUM(vehicles.price) AS msrp,
        ROUND(AVG(vehicles.price)) avg_msrp
      FROM
        vehicles
      ${whereClause ? `WHERE ${whereClause}` : ''}
      GROUP BY
        condition
      ORDER BY
        COUNT DESC;
    `;

    const recentTimestamp = (
      await this.sequelize.query<{ timestamp: string }>(
        getRecentTimestampQuery,
        {
          replacements: {
            brands: queryDto.brands,
          },
          type: QueryTypes.SELECT,
        },
      )
    )[0]?.timestamp;

    const summary = await this.sequelize.query<SummaryType>(getSummaryQuery, {
      replacements: {
        brands: queryDto.brands,
      },
      type: QueryTypes.SELECT,
    });

    return {
      recentTimestamp,
      summary,
    };
  }

  async getInventoryGraphData(
    queryDto: GraphDataQueryDto,
  ): Promise<GraphDataReturnType> {
    const whereClause = this.createWhereClause(queryDto);

    const query = `
      SELECT
        TO_CHAR(vehicles."timestamp", 'MM/DD/YY') AS date,
        COUNT(*) AS "value"
      FROM
        vehicles
      ${whereClause ? `WHERE ${whereClause}` : ''}
      GROUP BY
        TO_CHAR(vehicles."timestamp", 'MM/DD/YY')
      ORDER BY
	      TO_CHAR(vehicles."timestamp", 'MM/DD/YY') ASC;
    `;

    const data = await this.sequelize.query<GraphDataType>(query, {
      replacements: {
        brands: queryDto.brands,
      },
      type: QueryTypes.SELECT,
    });

    return { type: queryDto.condition, data };
  }

  async getAverageMsrpGraphData(
    queryDto: GraphDataQueryDto,
  ): Promise<GraphDataReturnType> {
    const whereClause = this.createWhereClause(queryDto);

    const query = `
      SELECT
        TO_CHAR(vehicles."timestamp", 'MM/DD/YY') AS date,
        ROUND(AVG(vehicles.price)) AS "value"
      FROM
        vehicles
      ${whereClause ? `WHERE ${whereClause}` : ''}
      GROUP BY
        TO_CHAR(vehicles."timestamp", 'MM/DD/YY')
      ORDER BY
	      TO_CHAR(vehicles."timestamp", 'MM/DD/YY') ASC;
    `;

    const data = await this.sequelize.query<GraphDataType>(query, {
      replacements: {
        brands: queryDto.brands,
      },
      type: QueryTypes.SELECT,
    });

    return { type: queryDto.condition, data };
  }

  async getHistoryLog(
    queryDto: HistoryLogQueryDto,
  ): Promise<HistoryLogReturnType> {
    const whereClause = this.createWhereClause(queryDto);

    const query = `
      SELECT
        TO_CHAR(vehicles."timestamp", 'MM/DD/YY') AS date,
        COUNT(*) FILTER (WHERE vehicles."condition" = 'new') AS new_inventory,
        SUM(vehicles.price) FILTER (WHERE vehicles."condition" = 'new') AS new_total_msrp,
        ROUND(AVG(vehicles.price) FILTER (WHERE vehicles."condition" = 'new')) AS new_average_msrp,
        
        COUNT(*) FILTER (WHERE vehicles."condition" = 'used') AS used_inventory,
        SUM(vehicles.price) FILTER (WHERE vehicles."condition" = 'used') AS used_total_msrp,
        ROUND(AVG(vehicles.price) FILTER (WHERE vehicles."condition" = 'used')) AS used_average_msrp,
      
        COUNT(*) FILTER (WHERE vehicles."condition" = 'cpo') AS cpo_inventory,
        SUM(vehicles.price) FILTER (WHERE vehicles."condition" = 'cpo') AS cpo_total_msrp,
        ROUND(AVG(vehicles.price) FILTER (WHERE vehicles."condition" = 'cpo')) AS cpo_average_msrp,

        COUNT(*) OVER() AS total
      FROM
          vehicles
      ${whereClause ? `WHERE ${whereClause}` : ''}
      GROUP BY
          TO_CHAR(vehicles."timestamp", 'MM/DD/YY')
      ORDER BY
          "${queryDto.field}" ${queryDto.sort}
      LIMIT ${queryDto.limit} OFFSET ${queryDto.limit * queryDto.page}
      ;
    `;

    const data = await this.sequelize.query<HistoryLogType>(query, {
      replacements: {
        brands: queryDto.brands,
      },
      type: QueryTypes.SELECT,
    });

    return {
      sort: {
        field: queryDto.field,
        sort: queryDto.sort as 'asc' | 'desc',
      },
      pagination: {
        limit: queryDto.limit,
        page: queryDto.page,
        total: data.length > 0 ? +data[0].total : 0,
      },
      data,
    };
  }
}
