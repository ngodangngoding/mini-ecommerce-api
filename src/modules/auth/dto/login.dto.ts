import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Alamat email pengguna',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password akun (minimal 8 karakter)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}