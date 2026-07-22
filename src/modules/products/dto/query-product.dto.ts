import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class QueryProductDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Halaman data yang ingin diambil (minimal 1)',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Jumlah item per halaman (minimal 1)',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'Laptop',
    description: 'Kata kunci pencarian untuk nama atau deskripsi produk',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Filter produk berdasarkan ID kategori (UUID v4)',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}