import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { QueryProductDto } from './dto/query-product.dto';

@Controller('api/v1/products')
export class ProductsController {

    constructor(private productsService: ProductsService) { }

    @Get()
    async getAllProduct(@Query() query: QueryProductDto) {
        return this.productsService.getAllProduct(query)
    }

    @Get(':id')
    async getProduct(@Param('id') id: string) {
        return this.productsService.getProduct(id)
    }

    @Post()
    async createProduct(@Body() dto: CreateProductDto) {
        return this.productsService.createProduct(dto)
    }

}
