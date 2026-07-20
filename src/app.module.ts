import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule, AuthModule],
})
export class AppModule { }
