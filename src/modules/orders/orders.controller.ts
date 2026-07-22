import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-orders.dto';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {

    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('CUSTOMER')
    async createOrder(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
        return this.ordersService.create(
            userId,
            dto,
        );
    }

    @Get('me')
    @UseGuards(RolesGuard)
    @Roles('CUSTOMER')
    async getMyOrders(@CurrentUser('id') userId: string) {
        return this.ordersService.findMyOrders(userId);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async getAllOrders() {
        return this.ordersService.findAll();
    }

}
