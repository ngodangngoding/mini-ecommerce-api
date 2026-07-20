import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async getAllCategory() {
        return this.prisma.category.findMany()
    }

    async getCategory(id: string) {
        return this.prisma.category.findUnique({ where: { id: String(id) } })
    }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: createCategoryDto,
        });
    }
}
