import express from 'express';
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/books.controller';

export const booksRouter = express.Router();

booksRouter.post( "/books", createBook );

booksRouter.get( "/books", getBooks );

booksRouter.get( "/books/:id", getBookById );

booksRouter.put( "/books/:id", updateBook );

booksRouter.delete( "/books/:id", deleteBook );