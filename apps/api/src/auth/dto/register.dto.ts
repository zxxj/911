import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'zhangxinxin_2000',
    minLength: 3,
    maxLength: 32,
  })
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(3, 32)
  @Matches(/^[a-z0-9_]+$/, { message: '用户名只能包含小写字母,数字和下划线!' })
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
