import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateOrderDto } from './dto/create-orders.dto';

@Injectable()
export class OrdersService {

    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: CreateOrderDto) {
        if (!userId) {
            throw new UnauthorizedException(
                'User ID tidak ditemukan pada token. Silakan login ulang (POST /api/v1/auth/login) untuk menggenerate token baru.',
            );
        }

        return this.prisma.$transaction(async (tx) => {
            let totalPrice = 0;

            // 1. Validasi stok & kumpulkan data tiap produk
            const enrichedItems = await Promise.all(
                dto.items.map(async (item) => {
                    const product = await tx.product.findUnique({
                        where: { id: item.productId },
                    });

                    if (!product) {
                        throw new NotFoundException(
                            `Produk dengan id "${item.productId}" tidak ditemukan.`,
                        );
                    }

                    if (product.stock < item.quantity) {
                        throw new BadRequestException(
                            `Stok produk "${product.name}" tidak mencukupi. Stok tersedia: ${product.stock}.`,
                        );
                    }

                    const subtotal = Number(product.price) * item.quantity;
                    totalPrice += subtotal;

                    return {
                        productId: item.productId,
                        quantity: item.quantity,
                        price: product.price,
                    };
                }),
            );

            const order = await tx.order.create({
                data: {
                    userId,
                    totalPrice,
                    items: {
                        create: enrichedItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: { id: true, name: true, price: true },
                            },
                        },
                    },
                },
            });

            await Promise.all(
                dto.items.map((item) =>
                    tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    }),
                ),
            );

            return order;
        });
    }

    async findMyOrders(userId: string) {
        if (!userId) {
            throw new UnauthorizedException(
                'User ID tidak ditemukan pada token. Silakan login ulang.',
            );
        }

        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, price: true },
                        },
                    },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, price: true },
                        },
                    },
                },
            },
        });
    }
}
