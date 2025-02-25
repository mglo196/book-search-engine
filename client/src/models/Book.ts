import { Schema, model, Document } from 'mongoose';

// Define the Book interface (type)
export interface IBook extends Document {
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

// Define and export the Book schema
export const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  authors: { type: [String], required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
});

// Create and export the Book model
export const Book = model<IBook>('Book', bookSchema);

// You can export the type for use in other files if needed
export type BookDocument = IBook;
