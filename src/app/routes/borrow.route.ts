import express from 'express';
import { borrowABook } from '../controllers/borrow.controller';

export const borrowRouter = express.Router();

borrowRouter.post( "/", borrowABook);