## **📚 POSTMAN COLLECTION - PERPUSTAKAAN DIGITAL API**

### **1. REGISTER ADMIN**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json
X-API-Key: katasandi123

{
  "name": "AdminPerpustakaan",
  "email": "admin@library.com", 
  "password": "Admin1234#",
  "role": "ADMIN"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Register berhasil!",
  "data": {
    "id": 1,
    "email": "admin@library.com",
    "name": "AdminPerpustakaan",
    "role": "ADMIN",
    "memberId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### **2. LOGIN ADMIN**
```http
POST http://localhost:5000/api/auth/login  
Content-Type: application/json
X-API-Key: katasandi123

{
  "email": "admin@library.com",
  "password": "Admin1234#"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@library.com",
      "name": "AdminPerpustakaan",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### **3. TAMBAH AUTHOR (Admin Only)**
```http
POST http://localhost:5000/api/authors
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-API-Key: katasandi123

{
  "name": "J.K. Rowling",
  "bio": "Penulis seri Harry Potter",
  "nationality": "British"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Author berhasil ditambahkan",
  "data": {
    "id": "auth-001",
    "name": "J.K. Rowling",
    "bio": "Penulis seri Harry Potter",
    "nationality": "British",
    "createdAt": "2024-12-19T10:00:00.000Z"
  }
}
```

---

### **4. TAMBAH BUKU DENGAN COVER (Admin Only) - FORM DATA**
```http
POST http://localhost:5000/api/books
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-API-Key: katasandi123
```

**Body (form-data):**
```
title: Harry Potter and the Philosopher's Stone
authorId: auth-001
description: Buku pertama seri Harry Potter
year: 1997
genre: Fantasy
price: 125000
stock: 10
image: [file] harry_potter_cover.jpg
```

**Response Success:**
```json
{
  "success": true,
  "message": "Buku berhasil ditambahkan",
  "data": {
    "id": "book-001",
    "title": "Harry Potter and the Philosopher's Stone",
    "description": "Buku pertama seri Harry Potter",
    "year": 1997,
    "genre": "Fantasy",
    "price": 125000,
    "stock": 10,
    "image_url": "/books/book-1702987200000-123456789.jpg",
    "author": {
      "id": "auth-001",
      "name": "J.K. Rowling"
    },
    "createdAt": "2024-12-19T10:05:00.000Z"
  }
}
```

---

### **5. TAMBAH BUKU KEDUA (Admin Only)**
```http
POST http://localhost:5000/api/books
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-API-Key: katasandi123
```

**Body (form-data):**
```
title: The Lord of the Rings
authorId: [author id Tolkien]
description: Epic fantasy novel
year: 1954
genre: Fantasy
price: 150000
stock: 8
image: [file] lotr_cover.jpg
```

**Response Success:**
```json
{
  "success": true,
  "message": "Buku berhasil ditambahkan",
  "data": {
    "id": "book-002",
    "title": "The Lord of the Rings",
    "description": "Epic fantasy novel",
    "year": 1954,
    "genre": "Fantasy",
    "price": 150000,
    "stock": 8,
    "image_url": "/books/book-1702987300000-987654321.jpg",
    "author": {
      "id": "auth-002",
      "name": "J.R.R. Tolkien"
    },
    "createdAt": "2024-12-19T10:10:00.000Z"
  }
}
```

---

### **6. REGISTER MEMBER (User Biasa)**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json
X-API-Key: katasandi123

{
  "name": "Budi Santoso",
  "email": "budi@member.com",
  "password": "Member1234#",
  "role": "USER"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Register berhasil!",
  "data": {
    "id": 2,
    "email": "budi@member.com",
    "name": "Budi Santoso",
    "role": "USER",
    "memberId": "member-001"
  }
}
```

---

### **7. LOGIN MEMBER**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
X-API-Key: katasandi123

{
  "email": "budi@member.com",
  "password": "Member1234#"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "user": {
      "id": 2,
      "email": "budi@member.com",
      "name": "Budi Santoso",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### **8. TAMBAH PROFILE MEMBER DENGAN FOTO - FORM DATA**
```http
POST http://localhost:5000/api/profiles
Content-Type: multipart/form-data
Authorization: Bearer [token member]
X-API-Key: katasandi123
```

**Body (form-data):**
```
user_id: 2
name: Budi Santoso
gender: MALE
address: Jl. Merdeka No. 123, Jakarta
profile_picture: [file] budi_profile.jpg
```

**Response Success:**
```json
{
  "success": true,
  "message": "Profile berhasil dibuat",
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "gender": "MALE",
    "address": "Jl. Merdeka No. 123, Jakarta",
    "profile_picture_url": "/profiles/profile-1702987400000-456789123.jpg",
    "user": {
      "id": 2,
      "username": "Budi Santoso",
      "email": "budi@member.com",
      "role": "USER"
    },
    "createdAt": "2024-12-19T10:15:00.000Z"
  }
}
```

---

### **9. PINJAM BUKU (Member) - Multiple Books**
```http
POST http://localhost:5000/api/borrow
Content-Type: application/json
Authorization: Bearer [token member]
X-API-Key: katasandi123

{
  "items": [
    {
      "bookId": "book-001",
      "quantity": 1
    },
    {
      "bookId": "book-002", 
      "quantity": 1
    }
  ],
  "dueDate": "2024-12-26T23:59:59.000Z"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Peminjaman berhasil dibuat",
  "data": {
    "id": "borrow-001",
    "memberId": "member-001",
    "borrowDate": "2024-12-19T10:20:00.000Z",
    "dueDate": "2024-12-26T23:59:59.000Z",
    "status": "ACTIVE",
    "member": {
      "id": "member-001",
      "name": "Budi Santoso",
      "email": "budi@member.com"
    },
    "items": [
      {
        "id": "item-001",
        "bookId": "book-001",
        "quantity": 1,
        "book": {
          "id": "book-001",
          "title": "Harry Potter and the Philosopher's Stone",
          "image_url": "/books/book-1702987200000-123456789.jpg"
        }
      },
      {
        "id": "item-002",
        "bookId": "book-002",
        "quantity": 1,
        "book": {
          "id": "book-002",
          "title": "The Lord of the Rings",
          "image_url": "/books/book-1702987300000-987654321.jpg"
        }
      }
    ]
  }
}
```

---

### **10. LIHAT RIWAYAT PEMINJAMAN SENDIRI (Member)**
```http
GET http://localhost:5000/api/borrow/my
Authorization: Bearer [token member]
X-API-Key: katasandi123
```

**Response Success:**
```json
{
  "success": true,
  "message": "Riwayat peminjaman Anda berhasil diambil",
  "data": [
    {
      "id": "borrow-001",
      "borrowDate": "2024-12-19T10:20:00.000Z",
      "dueDate": "2024-12-26T23:59:59.000Z",
      "status": "ACTIVE",
      "items": [
        {
          "id": "item-001",
          "quantity": 1,
          "book": {
            "id": "book-001",
            "title": "Harry Potter and the Philosopher's Stone",
            "image_url": "/books/book-1702987200000-123456789.jpg"
          }
        },
        {
          "id": "item-002",
          "quantity": 1,
          "book": {
            "id": "book-002",
            "title": "The Lord of the Rings",
            "image_url": "/books/book-1702987300000-987654321.jpg"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### **11. KEMBALIKAN BUKU (Member/Admin)**
```http
POST http://localhost:5000/api/borrow/return
Content-Type: application/json
Authorization: Bearer [token member/admin]
X-API-Key: katasandi123

{
  "borrowRecordId": "borrow-001",
  "returnItems": [
    {
      "borrowItemId": "item-001",
      "quantity": 1
    },
    {
      "borrowItemId": "item-002",
      "quantity": 1
    }
  ]
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Buku berhasil dikembalikan",
  "data": {
    "id": "borrow-001",
    "memberId": "member-001",
    "borrowDate": "2024-12-19T10:20:00.000Z",
    "dueDate": "2024-12-26T23:59:59.000Z",
    "returnDate": "2024-12-19T11:00:00.000Z",
    "status": "RETURNED",
    "member": {
      "id": "member-001",
      "name": "Budi Santoso",
      "email": "budi@member.com"
    },
    "items": []
  }
}
```

---

### **12. CEK STOK BUKU SETELAH PENGEMBALIAN**
```http
GET http://localhost:5000/api/books/book-001
X-API-Key: katasandi123
```

**Response Success:**
```json
{
  "success": true,
  "message": "Buku berhasil diambil",
  "data": {
    "id": "book-001",
    "title": "Harry Potter and the Philosopher's Stone",
    "description": "Buku pertama seri Harry Potter",
    "year": 1997,
    "genre": "Fantasy",
    "price": 125000,
    "stock": 10, // Stok kembali normal
    "image_url": "/books/book-1702987200000-123456789.jpg",
    "author": {
      "id": "auth-001",
      "name": "J.K. Rowling"
    }
  }
}
```

**🎉 SELESAI!** Semua flow dari registrasi, login, tambah buku, pinjam buku, hingga pengembalian sudah tercover.