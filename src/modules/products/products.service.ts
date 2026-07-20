import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async createProduct(dto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,

                category: {
                    connect: {
                        id: dto.categoryId,
                    },
                },
            },

            include: {
                category: true
            }
        });
    }

    async getAllProduct(query: QueryProductDto) {
        const { page = 1, limit = 10, search, categoryId } = query;

        const where = {
            ...(search && {
                name: {
                    contains: search,
                    mode: 'insensitive' as const,
                },
            }),
            ...(categoryId && {
                categoryId,
            }),
        };

        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    category: true,
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getProduct(id: string) {
        return this.prisma.product.findUnique({ where: { id: String(id) } })
    }
}
