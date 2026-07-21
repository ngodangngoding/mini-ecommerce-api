import { Body, Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { QueryProductDto } from './dto/query-product.dto';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/v1/products')
export class ProductsController {

    constructor(private productsService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@CurrentUser() user,) {
        return user;
    }

    @Get()
    async getAllProduct(@Query() query: QueryProductDto) {
        return this.productsService.getAllProduct(query)
    }

    @Get(':id')
    async getProduct(@Param('id') id: string) {
        return this.productsService.getProduct(id)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    async createProduct(@Body() dto: CreateProductDto) {
        return this.productsService.createProduct(dto)
    }

}
