import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @Validate((value: string) => RegExp(/^[a-zA-Z0-9_-]+$/).test(value), {
    message:
      'username must be alphanumeric only with hyphen(-) and underscore(_)',
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'password must be at least 6 characters',
  })
  password: string;

  @IsString()
  @IsEnum(['admin', 'super-admin'], {
    message: 'role must be admin or super-admin',
  })
  @IsNotEmpty()
  role: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  is_active: boolean;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  last_name: string;
}
