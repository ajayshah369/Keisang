import {
  IsString,
  IsNotEmpty,
  Validate,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsEnum(['new', 'used', 'cpo'], {
    message: 'condition must be new, used or cpo',
  })
  @IsNotEmpty()
  condition: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  product_type: string;

  @IsString()
  @IsNotEmpty()
  custom_label: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  dealer: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  timestamp: string;

  @IsNumber()
  @IsNotEmpty()
  @Validate((val: string) => !isNaN(+val.split(' ')[0]))
  @Transform(({ value }) => {
    return +value.split(' ')[0];
  })
  price: number;
}
