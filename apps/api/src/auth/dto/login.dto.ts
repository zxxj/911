import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'zhangxinxin_2000' })
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username!: string;

  @ApiProperty({
    example: 'a123456789',
    format: 'password',
    minLength: 10,
    maxLength: 128,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(128)
  password!: string;
}
