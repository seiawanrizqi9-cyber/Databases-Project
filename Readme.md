# **📚 API Perpustakaan Digital dengan Magic Login**

API untuk mengelola perpustakaan digital dengan sistem login tanpa password (magic link).

## **🚀 Instalasi**

### **Prasyarat**
- Node.js (v18 atau lebih baru)
- npm atau yarn
- Postman (untuk testing)

### **Langkah Instalasi**

### **1. Install Semua Package**

```bash
# 1. Inisialisasi project
npm init -y

# 2. Install dependencies utama
npm install express cors dotenv helmet morgan express-validator jsonwebtoken nodemailer bcryptjs crypto

# 3. Install dev dependencies untuk TypeScript
npm install -D typescript tsx @types/node @types/express @types/cors @types/morgan @types/jsonwebtoken @types/nodemailer @types/bcryptjs @types/express-validator
```

### **2. Verifikasi Instalasi**

```bash
# Cek versi
node --version
npm --version

# Cek dependencies terinstall
npm list --depth=0

# Build project
npm run build

# Jalankan server
npm run dev
```

Server akan berjalan di: `http://localhost:5000`

---

## **🔑 Autentikasi**

Semua endpoint memerlukan **API Key** di header:
```
X-API-Key: katasandi123
```

---

## **📖 Fitur Buku (Books API)**

### **1. Mendapatkan Semua Buku**
```
GET /api/books
Headers: X-API-Key: katasandi123
```

**Response Sukses:**
```json
{
  "success": true,
  "message": "Daftar buku berhasil diambil",
  "data": {
    "books": [...],
    "total": 5
  }
}
```

### **2. Mencari Buku**
```
GET /api/books/search?title=pelangi&genre=Novel&min_price=50000
Headers: X-API-Key: katasandi123
```

**Parameter pencarian:**
- `title` - Judul buku
- `author` - Penulis
- `genre` - Genre
- `min_price` - Harga minimum
- `max_price` - Harga maksimum
- `min_year` - Tahun terbit minimum
- `max_year` - Tahun terbit maksimum

### **3. Mendapatkan Buku Berdasarkan ID**
```
GET /api/books/1
Headers: X-API-Key: katasandi123
```

### **4. Menambahkan Buku Baru**
```
POST /api/books
Headers: 
  X-API-Key: katasandi123
  Content-Type: application/json
Body:
{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "description": "Petualangan penyihir muda",
  "year": 1997,
  "genre": "Fantasy",
  "price": 120000,
  "stock": 50
}
```

**Validasi:**
- `title` - wajib, min 2 karakter
- `author` - wajib
- `description` - wajib
- `year` - 1000-sekarang
- `genre` - wajib
- `price` - wajib, > 0
- `stock` - wajib, ≥ 0

### **5. Mengupdate Buku**
```
PUT /api/books/1
Headers: 
  X-API-Key: katasandi123
  Content-Type: application/json
Body:
{
  "price": 90000,
  "stock": 25
}
```

### **6. Menghapus Buku**
```
DELETE /api/books/1
Headers: X-API-Key: katasandi123
```

---

## **🔐 Fitur Magic Login**

### **1. Request Magic Link**
```
POST /api/auth/request
Headers: 
  X-API-Key: katasandi123
  Content-Type: application/json
Body:
{
  "email": "user@example.com",
  "name": "Nama User"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Magic link berhasil dibuat",
  "data": {
    "email": "user@example.com",
    "token": "a1b2c3d4e5...",
    "message": "Token tersedia di console untuk testing"
  }
}
```

**Cek terminal server untuk token!**

### **2. Verify Magic Token**
```
POST /api/auth/verify
Headers: 
  X-API-Key: katasandi123
  Content-Type: application/json
Body:
{
  "token": "TOKEN_DARI_CONSOLE"
}
```

**Response Sukses:**
```json
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIs...", // JWT Token
    "expiresIn": "7 hari"
  }
}
```

**Simpan JWT token untuk request berikutnya!**

### **3. Validate Session**
```
GET /api/auth/validate
Headers: 
  X-API-Key: katasandi123
  Authorization: Bearer JWT_TOKEN
```

### **4. Get User Profile**
```
GET /api/auth/profile/user@example.com
Headers: 
  X-API-Key: katasandi123
  Authorization: Bearer JWT_TOKEN
```

### **5. Update User Profile**
```
PUT /api/auth/profile/user@example.com
Headers: 
  X-API-Key: katasandi123
  Authorization: Bearer JWT_TOKEN
  Content-Type: application/json
Body:
{
  "name": "Nama Baru"
}
```

### **6. Get All Users (Admin)**
```
GET /api/auth/users
Headers: 
  X-API-Key: katasandi123
  Authorization: Bearer JWT_TOKEN
```

### **7. Logout**
```
POST /api/auth/logout
Headers: 
  X-API-Key: katasandi123
  Authorization: Bearer JWT_TOKEN
```

---

## **🔄 Flow Login Lengkap**

1. **Request magic link** → Dapatkan token di console
2. **Verify token** → Dapatkan JWT token
3. **Gunakan JWT token** di header `Authorization: Bearer JWT_TOKEN`
4. **Token berlaku 7 hari**

---

## **📁 Struktur Project**

```
src/
├── types/           # TypeScript interfaces
├── controllers/     # Request handlers
├── middleware/      # Validasi & error handling
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions
├── models/          # Data models
├── app.ts          # Main Express app
└── index.ts        # Server entry point
```

---

## **🧪 Testing dengan Postman**

### **Import Collection:**
1. Buka Postman
2. Klik **Import**
3. Pilih file `Library-API.postman_collection.json`

### **Environment Variables:**
```json
{
  "base_url": "http://localhost:5000",
  "api_key": "katasandi123",
  "jwt_token": "isi_setelah_login"
}
```

### **Test Sequence:**
1. Test endpoint `/` untuk cek server
2. Test CRUD buku
3. Test magic login flow:
   - Request magic link
   - Verify token (ambil dari console)
   - Validate session
   - Get/update profile

---

## **🚨 Error Handling**

### **Format Error:**
```json
{
  "success": false,
  "message": "Pesan error",
  "errors": [
    {"field": "nama_field", "message": "Pesan validasi"}
  ]
}
```

### **Kode Status HTTP:**
- `200` - Sukses
- `201` - Created
- `400` - Bad Request (validasi gagal)
- `401` - Unauthorized (API key/token invalid)
- `404` - Not Found
- `500` - Internal Server Error

---

## **📝 Contoh Data Buku**

```json
{
  "id": 1,
  "title": "Laskar Pelangi",
  "author": "Andrea Hirata",
  "description": "Kisah tentang perjuangan sepuluh anak Belitong",
  "year": 2005,
  "genre": "Novel",
  "price": 85000,
  "stock": 10
}
```

---

## **⚡ Script NPM**

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",    // Development
    "start": "node dist/index.js",      // Production
    "build": "tsc",                     // Build TypeScript
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

---

## **🔧 Troubleshooting**

### **Server tidak bisa start:**
1. Cek port 5000 tidak digunakan: `netstat -ano | findstr :5000`
2. Cek file `.env` sudah dibuat
3. Cek dependencies terinstall: `npm install`

### **API Key error:**
- Pastikan header `X-API-Key: katasandi123`
- Case sensitive: `X-API-Key` bukan `x-api-key`

### **Token tidak valid:**
- Token magic link hanya berlaku 15 menit
- Token hanya bisa digunakan 1 kali
- Cek console server untuk token yang benar

### **JWT token error:**
- Token harus diawali `Bearer `
- Token expired setelah 7 hari

---

## **📞 Kontak & Dukungan**

Jika menemukan masalah:
1. Cek log error di console server
2. Verifikasi semua header dan body request
3. Pastikan mengikuti flow yang benar

---

## **🎯 Fitur yang Tersedia**

✅ **Manajemen Buku** - CRUD lengkap  
✅ **Pencarian Buku** - Filter multi-kriteria  
✅ **Magic Login** - Login tanpa password  
✅ **User Management** - Profile & admin features  
✅ **Validasi Input** - express-validator  
✅ **Error Handling** - Format respons konsisten  
✅ **API Key Protection** - Keamanan endpoint  
✅ **JWT Authentication** - Session management  

---

## **🎉 Selamat menggunakan API Perpustakaan Digital!**