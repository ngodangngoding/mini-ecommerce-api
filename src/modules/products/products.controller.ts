import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('me')
  @ApiOperation({
    summary: 'Mendapatkan profil pengguna yang sedang terotentikasi',
    description: 'Mengembalikan data payload pengguna yang sedang login berdasarkan JWT Token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profil pengguna berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token JWT tidak valid atau tidak ada.',
  })
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Get()
  @ApiOperation({
    summary: 'Mendapatkan daftar produk dengan pagination, pencarian, dan filter (Public)',
    description: 'Mengambil katalog produk. Mendukung query parameter page, limit, search, dan categoryId.',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil daftar produk beserta informasi pagination.',
  })
  async getAllProduct(@Query() query: QueryProductDto) {
    return this.productsService.getAllProduct(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Melihat detail produk berdasarkan ID (Public)',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail produk berhasil ditemukan.',
  })
  @ApiResponse({
    status: 404,
    description: 'Produk tidak ditemukan.',
  })
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Membuat produk baru (Admin Only)',
    description: 'Hanya pengguna dengan role ADMIN yang dapat menambah produk baru ke dalam sistem.',
  })
  @ApiResponse({
    status: 201,
    description: 'Produk berhasil dibuat.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token JWT tidak valid atau tidak ada.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Membutuhkan akses role ADMIN.',
  })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }
}

