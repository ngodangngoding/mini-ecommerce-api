import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';

@Controller('api/v1/categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    async getAllCategory() {
        return this.categoriesService.getAllCategory()
    }

    @Get(':id')
    async getCategory(@Param('id') id: string) {
        return this.categoriesService.getCategory(id)
    }

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.createCategory(createCategoryDto);
    }
}
