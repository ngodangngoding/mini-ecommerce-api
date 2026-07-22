import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule, AuthModule, OrdersModule],
})
export class AppModule { }
