import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Melihat daftar seluruh kategori produk (Public)',
    description: 'Mengambil daftar semua kategori produk yang tersedia di sistem.',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil daftar kategori produk.',
  })
  async getAllCategory() {
    return this.categoriesService.getAllCategory();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Melihat detail kategori produk berdasarkan ID (Public)',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail kategori berhasil ditemukan.',
  })
  @ApiResponse({
    status: 404,
    description: 'Kategori produk tidak ditemukan.',
  })
  async getCategory(@Param('id') id: string) {
    return this.categoriesService.getCategory(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Membuat kategori produk baru (Admin Only)',
    description: 'Hanya pengguna dengan role ADMIN yang dapat membuat kategori produk baru.',
  })
  @ApiResponse({
    status: 201,
    description: 'Kategori produk berhasil dibuat.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token JWT tidak valid atau tidak ada.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Membutuhkan akses role ADMIN.',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }
}

