import { Schema, model, Document } from 'mongoose';
import { Book } from './Book';  // Import the Book model

// Define the User interface with Book reference type
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  books: typeof Book[];  // Reference the type of Book using 'typeof Book'
}

// User schema definition
const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]  // Reference to Book model
});

// Create and export the User model
export const User = model<IUser>('User', userSchema);
