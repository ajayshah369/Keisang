import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class HistoryLogQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10) || 0)
  page: number = 0;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  limit: number = 10;

  @IsOptional()
  @IsEnum([
    'date',
    'new_inventory',
    'new_total_msrp',
    'new_average_msrp',
    'used_inventory',
    'used_total_msrp',
    'used_average_msrp',
    'cpo_inventory',
    'cpo_total_msrp',
    'cpo_average_msrp',
  ])
  @IsString()
  field: string = 'date';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @IsString()
  sort: string = 'asc';

  @IsOptional()
  @IsString()
  dealer: string;

  @IsOptional()
  @IsArray()
  brands: string[];

  @IsOptional()
  @IsArray()
  durations: string[];
}
