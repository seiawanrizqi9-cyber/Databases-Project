# 📚 **API Perpustakaan Digital dengan Prisma ORM & Magic Login**

Sebuah RESTful API lengkap untuk sistem manajemen perpustakaan digital dengan **Prisma ORM** untuk database operations dan **Magic Link Authentication** untuk login tanpa password.

## 🚀 **Instalasi & Setup**

### **Prasyarat**
- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm atau yarn
- Postman (untuk testing)

### **Langkah Instalasi Lengkap**

#### **1. Install Semua Package**
```bash
# 1. Clone repository
git clone <repository-url>
cd databases-project

# 2. Install dependencies utama
npm install express cors dotenv helmet morgan express-validator jsonwebtoken nodemailer bcryptjs crypto

# 3. Install Prisma dependencies
npm install @prisma/client @prisma/adapter-pg pg
npm install -D prisma @types/pg

# 4. Install TypeScript dev dependencies
npm install -D typescript tsx @types/node @types/express @types/cors @types/morgan @types/jsonwebtoken @types/nodemailer @types/bcryptjs @types/express-validator
```

#### **2. Setup Database & Environment**
```bash
# 1. Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi berikut:

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/library_db"

# Server Configuration
PORT=5000
HOST=http://localhost

# Authentication
JWT_SECRET=your_jwt_secret_rahasia_2025
```

#### **3. Initialize Prisma & Database**
```bash
# 1. Setup Prisma schema (file sudah ada di prisma/schema.prisma)
npx prisma generate

# 2. Jalankan migrasi pertama
npx prisma migrate dev --name init_library_schema

# 3. (Optional) Seed database dengan data awal
npx prisma db seed
```

#### **4. Verifikasi Instalasi**
```bash
# Cek versi
node --version
npm --version

# Build project
npm run build

# Jalankan development server
npm run dev
```

Server akan berjalan di: `http://localhost:5000`

## 🏗️ **Arsitektur Database**

### **Model & Relasi**
```mermaid
erDiagram
    Author ||--o{ Book : writes
    Author {
        uuid id PK
        string name
        string bio
        string nationality
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }
    
    Book {
        uuid id PK
        string title
        string description
        int year
        string genre
        float price
        int stock
        uuid authorId FK
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }
    
    Member ||--o{ Loan : borrows
    Member {
        uuid id PK
        string email UK
        string name
        string phone
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }
    
    Book ||--o{ Loan : "is borrowed in"
    Loan {
        uuid id PK
        uuid bookId FK
        uuid memberId FK
        timestamp loanDate
        timestamp dueDate
        timestamp returnDate
        enum status
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }
```

### **Relasi yang Diimplementasikan:**
1. **Author → Book** (One-to-Many)
2. **Member → Loan** (One-to-Many) 
3. **Book → Loan** (One-to-Many)

## 🔑 **Autentikasi**

### **API Key Authentication**
Semua endpoint memerlukan **API Key** di header:
```http
X-API-Key: katasandi123
```

### **JWT Token Authentication** (untuk user endpoints)
Setelah login via magic link, gunakan:
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📡 **API Endpoints Lengkap**

### **🏠 Home Endpoint**
```
GET /
Headers: X-API-Key: katasandi123
```
Menampilkan informasi server dan semua endpoint yang tersedia.

### **📚 Books Resource** (4 resource baru dengan Prisma)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/books` | Get all books + pagination | API Key |
| `GET` | `/api/books/:id` | Get book by UUID | API Key |
| `GET` | `/api/books/search` | Search books dengan filter | API Key |
| `POST` | `/api/books` | Create new book | API Key |
| `PUT` | `/api/books/:id` | Update book | API Key |
| `DELETE` | `/api/books/:id` | Soft delete book | API Key |

**Contoh Search:**
```http
GET /api/books/search?title=pelangi&genre=Novel&min_price=50000&max_price=100000&page=1&limit=10
```

**Contoh Create Book:**
```json
{
  "title": "Laskar Pelangi",
  "authorId": "uuid-author-disini",
  "description": "Kisah inspiratif anak Belitong",
  "year": 2005,
  "genre": "Novel",
  "price": 85000,
  "stock": 10
}
```

### **👤 Authors Resource** (Baru dengan Prisma)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/authors` | Get all authors | API Key |
| `GET` | `/api/authors/:id` | Get author by UUID | API Key |
| `GET` | `/api/authors/search` | Search authors | API Key |
| `POST` | `/api/authors` | Create new author | API Key |
| `PUT` | `/api/authors/:id` | Update author | API Key |
| `DELETE` | `/api/authors/:id` | Soft delete author | API Key |

### **📖 Loans Resource** (Baru dengan Prisma + Transaction)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/loans` | Get all loans | API Key |
| `GET` | `/api/loans/:id` | Get loan by UUID | API Key |
| `GET` | `/api/loans/search` | Search loans | API Key |
| `POST` | `/api/loans` | Create new loan | API Key |
| `PUT` | `/api/loans/:id` | Update loan | API Key |
| `PATCH` | `/api/loans/:id/return` | Return book | API Key |
| `DELETE` | `/api/loans/:id` | Soft delete loan | API Key |

**Fitur Spesial Loans:**
- ✅ **Transaction**: Atomic operations
- ✅ **Stock Management**: Otomatis update stok
- ✅ **Due Date Validation**: Tidak boleh masa lalu

### **👥 Members Resource** (Baru dengan Prisma)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/members` | Get all members | API Key |
| `GET` | `/api/members/:id` | Get member by UUID | API Key |
| `GET` | `/api/members/search` | Search members | API Key |
| `POST` | `/api/members` | Create new member | API Key |
| `PUT` | `/api/members/:id` | Update member | API Key |
| `DELETE` | `/api/members/:id` | Soft delete member | API Key |

### **🔐 Magic Login System** (Dari versi sebelumnya)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/request` | Request magic link | API Key |
| `POST` | `/api/auth/verify` | Verify magic token | API Key |
| `GET` | `/api/auth/validate` | Validate JWT session | API Key + JWT |
| `GET` | `/api/auth/users` | Get all users (admin) | API Key + JWT |
| `GET` | `/api/auth/profile/:email` | Get user profile | API Key + JWT |
| `PUT` | `/api/auth/profile/:email` | Update user profile | API Key + JWT |
| `POST` | `/api/auth/logout` | Logout | API Key + JWT |

## 🧪 **Testing dengan Postman**

### **Import Collection:**
1. Buat collection baru "Library API v2"
2. Setup environment variables:
   ```json
   {
     "base_url": "http://localhost:5000",
     "api_key": "katasandi123",
     "jwt_token": ""
   }
   ```

### **Test Sequence yang Disarankan:**

#### **1. Test Database & Prisma Setup**
```http
GET {{base_url}}/
X-API-Key: {{api_key}}
```

#### **2. Test Book CRUD (dengan Prisma)**
1. Create author dulu (untuk dapat authorId)
2. Create book dengan authorId
3. Get all books dengan pagination
4. Search books dengan filter
5. Update book
6. Soft delete book

#### **3. Test Loan Transaction**
1. Create member
2. Create book
3. Create loan (akan otomatis kurangi stok)
4. Return loan (akan otomatis tambah stok)

#### **4. Test Magic Login Flow**
1. Request magic link
2. Check console server untuk token
3. Verify token untuk dapat JWT
4. Use JWT untuk protected endpoints

## 🔧 **Workflow Development**

### **Database Migrations dengan Prisma**
```bash
# 1. Edit schema.prisma
# 2. Generate Prisma Client
npx prisma generate

# 3. Create migration
npx prisma migrate dev --name add_new_feature

# 4. (Optional) Reset database
npx prisma migrate reset
```

### **NPM Scripts yang Tersedia**
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma generate && prisma migrate dev",
    "prisma:reset": "prisma migrate reset"
  }
}
```

## 🛡️ **Error Handling & Responses**

### **Format Response Standar**
```json
{
  "success": true|false,
  "message": "Deskripsi hasil",
  "data": {} | null,
  "errors": [] | null
}
```

### **Prisma Error Examples**
```json
{
  "success": false,
  "message": "Data sudah ada (Unique constraint violation)"
}

{
  "success": false,
  "message": "Foreign key constraint failed - Author tidak ditemukan"
}

{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

## 📊 **Fitur Lengkap yang Diimplementasikan**

### **✅ Dari Tugas Sebelumnya (In-memory)**
- CRUD Books dengan array
- Magic Login System
- Input validation
- Error handling

### **✅ Ditambahkan untuk Prisma Migration**
- **4 Resource Baru**: Book, Author, Loan, Member
- **UUID Primary Keys**: Semua tabel
- **Soft Delete**: `deletedAt` field
- **Relasi 1:N**: 2 relasi solid
- **Transactions**: Untuk operasi kompleks
- **Advanced Search**: Multi-field filtering
- **Pagination**: Di semua GET endpoints

## 🎯 **Best Practices yang Diikuti**

1. **Database**: UUID, soft delete, proper indexing
2. **API Design**: RESTful, consistent responses, proper HTTP codes
3. **Security**: API keys, JWT, input validation
4. **Code Quality**: TypeScript, MVC pattern, separation of concerns
5. **Error Handling**: Centralized, Prisma error mapping

## 🚨 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. Database Connection Error**
```bash
# Cek PostgreSQL service
sudo service postgresql status

# Cek connection string di .env
DATABASE_URL="postgresql://USER:PASS@localhost:5432/DBNAME"
```

#### **2. Prisma Migration Error**
```bash
# Reset database
npx prisma migrate reset --force

# Generate ulang client
npx prisma generate

# Restart TypeScript server
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

#### **3. TypeScript Errors**
```json
// Pastikan di tsconfig.json
{
  "compilerOptions": {
    "exactOptionalPropertyTypes": false,
    "strict": true
  }
}
```

#### **4. API Key Rejected**
- Header harus: `X-API-Key` (case sensitive)
- Value harus: `katasandi123`

## 📝 **Contoh Data untuk Testing**

### **Create Author First:**
```json
POST /api/authors
{
  "name": "Andrea Hirata",
  "nationality": "Indonesia",
  "bio": "Penulis novel Laskar Pelangi"
}
```

### **Create Book:**
```json
POST /api/books
{
  "title": "Laskar Pelangi",
  "authorId": "uuid-dari-author",
  "description": "Kisah 10 anak Belitong",
  "year": 2005,
  "genre": "Novel",
  "price": 85000,
  "stock": 10
}
```

### **Create Loan:**
```json
POST /api/loans
{
  "bookId": "uuid-buku",
  "memberId": "uuid-member", 
  "dueDate": "2024-12-31"
}
```

## 📁 **Struktur Project Lengkap**

```
src/
├── prisma/
│   └── schema.prisma                    # SEMUA MODEL + RELASI
├── controllers/
│   ├── book.controller.ts              # Refactored ke Prisma
│   ├── author.controller.ts            # Baru
│   ├── loan.controller.ts              # Baru
│   ├── member.controller.ts            # Baru
│   └── magicLogin.controller.ts        # Dari sebelumnya
├── services/
│   ├── book.service.ts                 # Prisma operations
│   ├── author.service.ts               # Baru
│   ├── loan.service.ts                 # Baru + transactions
│   ├── member.service.ts               # Baru
│   └── mockMagicLogin.service.ts       # Dari sebelumnya
├── middleware/
│   ├── book.validation.ts              # Updated untuk Prisma
│   ├── author.validation.ts            # Baru
│   ├── loan.validation.ts              # Baru
│   ├── member.validation.ts            # Baru
│   ├── magic.validation.ts             # Dari sebelumnya
│   └── error.handler.ts                # Updated untuk Prisma errors
├── routes/
│   ├── book.route.ts                   # Updated
│   ├── author.route.ts                 # Baru
│   ├── loan.route.ts                   # Baru
│   ├── member.route.ts                 # Baru
│   └── magic.route.ts                  # Dari sebelumnya
├── utils/
│   ├── response.ts                     # Utility functions
│   └── validation.ts                   # Validation middleware
├── app.ts                              # Main Express app
└── index.ts                            # Server entry
```

## ✅ **Checklist Fitur**

- [✔️] **Prisma ORM Migration**: Semua operasi database dengan Prisma
- [✔️] **4 Resource Baru**: Book, Author, Loan, Member dengan CRUD lengkap
- [✔️] **UUID Primary Keys**: Semua model
- [✔️] **Soft Delete**: `deletedAt` di semua tabel
- [✔️] **Relasi 1:N**: Author→Book dan Member→Loan
- [✔️] **Transactions**: Untuk operasi loan yang kompleks
- [✔️] **Magic Login System**: Login tanpa password
- [✔️] **Input Validation**: express-validator untuk semua endpoints
- [✔️] **Error Handling**: Centralized + Prisma error mapping
- [✔️] **API Key Auth**: Protection untuk semua endpoints
- [✔️] **Pagination**: Di semua GET endpoints
- [✔️] **Search Endpoints**: `/resource/search` untuk semua resource

---

## 🎉 **Selamat Menggunakan API Perpustakaan Digital v2!**

**Status**: ✅ Production Ready dengan Prisma ORM  
**Version**: 2.0.0 (Prisma Migration)  
**Last Updated**: Desember 2024  

Untuk issues atau pertanyaan, pastikan:
1. Database PostgreSQL berjalan
2. Prisma migration sudah dijalankan
3. Environment variables sudah benar
4. API key di header sesuai

**Happy Coding!** 🚀