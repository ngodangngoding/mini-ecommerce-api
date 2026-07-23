# Mini E-Commerce API

RESTful API backend untuk aplikasi mini e-commerce yang dibangun menggunakan NestJS, PostgreSQL, dan Prisma ORM.

## Fitur Utama

- **Autentikasi & Otorisasi**: Login dan registrasi menggunakan JWT. Proteksi rute berbasis role (`ADMIN` dan `CUSTOMER`).
- **Kategori & Produk**: Manajemen katalog produk, filter kategori, pencarian kata kunci, dan paginasi.
- **Transaksi Pesanan (Orders)**: Checkout pesanan menggunakan Prisma Transaction untuk menjaga konsistensi stok produk secara atomic.
- **Dokumentasi API**: Swagger UI otomatis pada rute `/api/docs`.

## Tech Stack

- Node.js & TypeScript
- Framework: NestJS (v11)
- Database & ORM: PostgreSQL & Prisma ORM
- Autentikasi: Passport.js & JWT (`@nestjs/jwt`)
- Validasi: `class-validator` & `class-transformer`
- Dokumentasi: Swagger (`@nestjs/swagger`)

## Prasyarat

- Node.js (v18 ke atas)
- PostgreSQL
- npm atau yarn

## Cara Penggunaan

### 1. Clone & Install Dependensi

```bash
git clone <repository-url>
cd mini-ecommerce-api
npm install
```

### 2. Konfigurasi Environment (`.env`)

Buat file `.env` di direktori root project:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/mini_ecommerce_db?schema=public"
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="1d"
```

### 3. Migrasi Database

Jalankan perintah berikut untuk membuat tabel di PostgreSQL dan menggenerate Prisma Client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Menjalankan Server

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

- API Base URL: `http://localhost:3000/api/v1`
- Swagger Docs: `http://localhost:3000/api/docs`

## Skema Database

```mermaid
erDiagram
    USER ||--o{ ORDER : "places"
    CATEGORY ||--o{ PRODUCT : "contains"
    ORDER ||--|{ ORDER_ITEM : "includes"
    PRODUCT ||--o{ ORDER_ITEM : "in"

    USER {
        string id PK
        string name
        string email UK
        string password
        enum role
    }

    CATEGORY {
        string id PK
        string name UK
        string description
    }

    PRODUCT {
        string id PK
        string name
        string description
        decimal price
        int stock
        string categoryId FK
    }

    ORDER {
        string id PK
        string userId FK
        decimal totalPrice
        enum status
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        decimal price
    }
```

## Endpoint API

Base Prefix: `/api/v1`

### Auth (`/auth`)
- `POST /auth/register` - Registrasi akun baru (default role: `CUSTOMER`)
- `POST /auth/login` - Otentikasi user dan mendapatkan JWT token

### Categories (`/categories`)
- `GET /categories` - Mendapatkan daftar kategori (Public)
- `GET /categories/:id` - Mendapatkan detail kategori (Public)
- `POST /categories` - Menambah kategori baru (`ADMIN` only)

### Products (`/products`)
- `GET /products` - Mendapatkan katalog produk dengan query `page`, `limit`, `search`, `categoryId` (Public)
- `GET /products/:id` - Detail produk (Public)
- `GET /products/me` - Profil user terautentikasi (Auth)
- `POST /products` - Menambah produk baru (`ADMIN` only)

### Orders (`/orders`)
- `POST /orders` - Membuat pesanan / checkout (`CUSTOMER` only)
- `GET /orders/me` - Riwayat pesanan milik sendiri (`CUSTOMER` only)
- `GET /orders` - Daftar seluruh pesanan di sistem (`ADMIN` only)

## Testing

```bash
# Unit test
npm run test

# End-to-end test
npm run test:e2e

# Coverage report
npm run test:cov
```
