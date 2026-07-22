import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'ID produk yang ingin dipesan (UUID v4)',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Jumlah kuantitas item yang dibeli (minimal 1)',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}