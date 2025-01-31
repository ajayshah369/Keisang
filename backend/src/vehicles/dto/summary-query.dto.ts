import { IsString, IsOptional, IsArray } from 'class-validator';

export class SummaryQueryDto {
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
