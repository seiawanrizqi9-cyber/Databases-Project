import { books } from "../models/book.model";
import type { Book } from "../types/book.type";

export const getAllBooks = () => {
  return { books: books, total: books.length };
};

export const getBookById = (id: string) => {
  const numId = parseInt(id);
  const book = books.find((book) => book.id === numId);

  if (!book) {
    throw new Error("Book not found");
  }

  return { book };
};

export const searchBooks = (
  title?: string,
  author?: string,
  genre?: string,
  min_price?: string,
  max_price?: string,
  min_year?: string,
  max_year?: string
): { books: Book[]; total: number; filters: Record<string, any> } => {
  let result = books;

  if (title) {
    result = result.filter((b) =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (author) {
    result = result.filter((b) =>
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  if (genre) {
    result = result.filter((b) =>
      b.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (min_price) {
    result = result.filter((b) => b.price >= Number(min_price));
  }

  if (max_price) {
    result = result.filter((b) => b.price <= Number(max_price));
  }

  if (min_year) {
    result = result.filter((b) => b.year >= Number(min_year));
  }

  if (max_year) {
    result = result.filter((b) => b.year <= Number(max_year));
  }

  return {
    books: result,
    total: result.length,
    filters: { title, author, genre, min_price, max_price, min_year, max_year },
  };
};

export const createBook = (
  title: string,
  author: string,
  description: string,
  year: number,
  genre: string,
  price: number,
  stock: number
) => {
  const newBook: Book = {
    id: books.length + 1,
    title,
    author,
    description,
    year,
    genre,
    price,
    stock,
  };

  books.push(newBook);
  return books;
};

export const updateBook = (id: string, data: any) => {
  const numId = parseInt(id);
  const index = books.findIndex((book) => book.id === numId);

  if (index === -1) {
    throw new Error("Book not found");
  }

  books[index] = { ...books[index], ...data };
  return books[index];
};

export const deleteBook = (id: string) => {
  const numId = parseInt(id);
  const index = books.findIndex((book) => book.id === numId);

  if (index === -1) {
    throw new Error("Book not found");
  }

  const deleted = books.splice(index, 1);

  return deleted;
};
