import { Request, Response } from 'express';
import User from '@models/User';  // Correct import for User model
import { RequestHandler } from 'express'; // Import the RequestHandler type
import { Book } from '@models/Book';  // Import Book model
import bcrypt from 'bcryptjs';  // If you're using bcrypt for password hashing
import jwt from 'jsonwebtoken';  // For generating JWT tokens

// Route handler for creating a user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);  // Example usage of User model
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Updated function with explicit return type as void
export const getSingleUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if req.user exists (authentication check)
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return; // Ensure we return after sending the response
    }

    // Fetch user by ID (using req.user._id which should be set by authentication middleware)
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return; // Return to avoid sending multiple responses
    }

    res.json(user);  // Return the response here
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Route handler for saving a book
export const saveBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.create(req.body);  // Example usage of Book model
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save book' });
  }
};

// Route handler for deleting a book by ID
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;  // Extract bookId from the route parameters
    const deletedBook = await Book.findByIdAndDelete(bookId);  // Delete the book using the ID

    if (!deletedBook) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.status(200).json({ message: 'Book deleted successfully' });  // Return success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};

// Route handler for logging in a user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;  // Get email and password from the request body

  try {
    const user = await User.findOne({ email });  // Find user by email

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Compare the hashed password with the stored one
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token if credentials are valid
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,  // Use your secret key from environment
      { expiresIn: '1h' }  // Set expiration time
    );

    res.status(200).json({ token });  // Send the token in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
  }
};
