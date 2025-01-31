import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAdminsQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!value || value === undefined || value === null) {
      return '';
    }
    return value;
  })
  text: string = '';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10) || 1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  limit: number = 10;
}
