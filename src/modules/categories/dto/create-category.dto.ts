import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Elektronik',
    description: 'Nama kategori produk (minimal 3 karakter)',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;
}