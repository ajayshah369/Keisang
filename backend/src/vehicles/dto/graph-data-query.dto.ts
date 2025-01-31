import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';

export class GraphDataQueryDto {
  @IsString()
  @IsEnum(['new', 'used', 'cpo'], {
    message: 'condition must be new, used or cpo',
  })
  @IsNotEmpty()
  condition: string;

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
