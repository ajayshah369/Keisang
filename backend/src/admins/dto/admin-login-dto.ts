import { IsString, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
