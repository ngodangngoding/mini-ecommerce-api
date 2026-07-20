# Product Requirements Document (PRD): Mini E-Commerce API

## 1. Overview
Project ini adalah API backend untuk platform Mini E-Commerce. Fokus utama adalah mengimplementasikan arsitektur NestJS yang solid, keamanan yang baik, dan relasi database yang efisien.

## 2. Tech Stack
- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL + Prisma ORM (menggunakan UUID sebagai Primary Key). *TimescaleDB disiapkan untuk update metrik analitik di masa depan.*
- **Security:** PassportJS (JWT Authentication), Role-Based Access Control (RBAC), `@nestjs/throttler` (Rate Limiting), Snyk (Vulnerability Scanning).

## 3. Database Schema (Entitas Utama)
Kita menggunakan pendekatan Relasional (RDBMS) standar:
1. **User:** Menyimpan kredensial dan role (`ADMIN`, `CUSTOMER`).
2. **Category:** Kategori produk.
3. **Product:** Data produk (relasi *Many-to-One* ke Category).
4. **Order:** Transaksi pembelian oleh user.
5. **OrderItem:** Detail item dalam satu pesanan (relasi *Many-to-One* ke Order dan Product).

## 4. Role-Based Access Control (RBAC)
- **CUSTOMER:** Bisa mendaftar, login, melihat produk, dan membuat pesanan (`Order`).
- **ADMIN:** Memiliki akses penuh. Bisa CRUD Category dan Product, serta melihat semua Order dari semua user.

## 5. Core Features & Endpoints

### A. Authentication
- `POST /api/v1/auth/register` (Public) - Mendaftar akun baru (default role: CUSTOMER).
- `POST /api/v1/auth/login` (Public) - Menghasilkan JWT Token.

### B. Products & Categories
- `GET /api/v1/categories` (Public)
- `POST /api/v1/categories` (Admin Only)
- `GET /api/v1/products` (Public) - Mendukung pagination, pencarian, filter kategori.
- `GET /api/v1/products/:id` (Public)
- `POST /api/v1/products` (Admin Only)

### C. Orders
- `POST /api/v1/orders` (Customer) - Checkout keranjang (mengurangi stok `Product` menggunakan *Database Transaction*).
- `GET /api/v1/orders/me` (Customer) - Melihat riwayat pesanan sendiri.
- `GET /api/v1/orders` (Admin Only) - Melihat semua transaksi masuk.

## 6. Target Pembelajaran Implementasi di NestJS
- **Custom Decorator:** Membuat `@Roles('ADMIN')` dan `@CurrentUser()` untuk mempermudah pengambilan data user.
- **Guards:** Mengimplementasikan `JwtAuthGuard` dan `RolesGuard`.
- **Prisma Transactions:** Memastikan saat `Order` dibuat, stok `Product` berkurang secara atomik (jika salah satu gagal, semua di-rollback).
- **Global Exception Filter:** Menangkap error dari Prisma (seperti Foreign Key error atau Unique Constraint) dan merespon dengan HTTP Status yang sesuai.
