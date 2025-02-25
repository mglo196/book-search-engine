import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface (type) for the Book
export interface IBook extends Document {
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

// Define the Mongoose schema
export const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  authors: { type: [String], required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
});

// Define BookDocument as a type that combines IBook and Mongoose's Document
export type BookDocument = IBook & Document; // Explicitly define the BookDocument type

// Create the Mongoose model
export const Book = mongoose.model<IBook>('Book', bookSchema);


