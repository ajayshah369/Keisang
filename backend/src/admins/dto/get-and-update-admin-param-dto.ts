import { IsString, IsNotEmpty } from 'class-validator';

export class GetAndUpdateAdminParamDto {
  @IsString()
  @IsNotEmpty()
  uuid: string;
}
