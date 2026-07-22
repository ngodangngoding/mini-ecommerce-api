import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { CreateOrderDto } from './dto/create-orders.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('CUSTOMER')
  @ApiOperation({
    summary: 'Membuat pesanan baru / Checkout (Customer Only)',
    description:
      'Customer melakukan checkout pesanan. Stok produk akan dikurangi secara atomik menggunakan Prisma Transaction.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pesanan berhasil dibuat.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Payload tidak valid atau stok produk tidak mencukupi.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token JWT tidak valid atau tidak ada.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Membutuhkan role CUSTOMER.',
  })
  async createOrder(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(userId, dto);
  }

  @Get('me')
  @UseGuards(RolesGuard)
  @Roles('CUSTOMER')
  @ApiOperation({
    summary: 'Melihat riwayat pesanan milik sendiri (Customer Only)',
    description: 'Mengambil daftar seluruh pesanan yang pernah dibuat oleh user CUSTOMER yang sedang login.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar pesanan milik user berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token JWT tidak valid atau tidak ada.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Membutuhkan role CUSTOMER.',
  })
  async getMyOrders(@CurrentUser('id') userId: string) {
    return this.ordersService.findMyOrders(userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Melihat seluruh pesanan dari semua user (Admin Only)',
    description: 'Mengambil daftar transaksi/pesanan dari seluruh pengguna di sistem.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar seluruh pesanan berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token JWT tidak valid atau tidak ada.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Membutuhkan role ADMIN.',
  })
  async getAllOrders() {
    return this.ordersService.findAll();
  }
}

