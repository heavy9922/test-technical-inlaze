import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  @ApiProperty()
  fullName?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  age?: number;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsOptional()
  @ApiProperty()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password?: string;
}
