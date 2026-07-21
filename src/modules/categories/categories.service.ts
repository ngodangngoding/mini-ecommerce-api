import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

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
