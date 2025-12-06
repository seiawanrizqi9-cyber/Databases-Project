import type { Book } from "../types/book.type";

export const books: Book[] = [
    {
    id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    description: "Kisah tentang perjuangan sepuluh anak Belitong",
    year: 2005,
    genre: "Novel",
    price: 85000,
    stock: 10
  },
  {
    id: 2,
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    description: "Roman sejarah pertama dari Tetralogi Buru",
    year: 1980,
    genre: "Historical Fiction",
    price: 95000,
    stock: 5
  },
  {
    id: 3,
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    description: "Filsafat Yunani-Romawi kuno untuk mental tangguh",
    year: 2018,
    genre: "Philosophy",
    price: 99000,
    stock: 15
  },
  {
    id: 4,
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Sebuah perpustakaan antara hidup dan mati",
    year: 2020,
    genre: "Fiction",
    price: 120000,
    stock: 8
  },
  {
    id: 5,
    title: "Atomic Habits",
    author: "James Clear",
    description: "Cara mudah membangun kebiasaan baik",
    year: 2018,
    genre: "Self-Help",
    price: 110000,
    stock: 20
  }
];