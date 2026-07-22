import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop Gaming ASUS ROG',
    description: 'Nama produk',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Laptop gaming spesifikasi tinggi dengan GPU RTX 4060',
    description: 'Deskripsi lengkap produk',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 15000000,
    description: 'Harga produk dalam IDR (minimal 0)',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 10,
    description: 'Jumlah stok barang yang tersedia (minimal 0)',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'ID kategori produk (UUID v4)',
  })
  @IsUUID()
  categoryId: string;
}