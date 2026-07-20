import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import 'dotenv/config';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule],
})
export class AppModule { }
