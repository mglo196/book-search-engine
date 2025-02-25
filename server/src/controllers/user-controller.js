"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.deleteBook = exports.saveBook = exports.getSingleUser = exports.createUser = void 0;
const User_1 = require("../../models/User"); // Import User model
const Book_1 = require("../../models/Book"); // Import Book model
const bcryptjs_1 = __importDefault(require("bcryptjs")); // If you're using bcrypt for password hashing
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // For generating JWT tokens
// Route handler for creating a user
const createUser = async (req, res) => {
    try {
        const user = await User_1.User.create(req.body); // Example usage of User model
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
exports.createUser = createUser;
// Route handler for getting a single user
const getSingleUser = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user.id); // Example, assuming user is attached to req.user
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            res.json(user);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getSingleUser = getSingleUser;
// Route handler for saving a book (just an example)
const saveBook = async (req, res) => {
    try {
        const book = await Book_1.Book.create(req.body); // Example usage of Book model
        res.status(201).json(book);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save book' });
    }
};
exports.saveBook = saveBook;
// Route handler for deleting a book by ID
const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params; // Extract bookId from the route parameters
        const deletedBook = await Book_1.Book.findByIdAndDelete(bookId); // Delete the book using the ID
        if (!deletedBook) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json({ message: 'Book deleted successfully' }); // Return success message
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
};
exports.deleteBook = deleteBook;
// Route handler for logging in a user
const login = async (req, res) => {
    const { email, password } = req.body; // Get email and password from the request body
    try {
        const user = await User_1.User.findOne({ email }); // Find user by email
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Compare the hashed password with the stored one
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT token if credentials are valid
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, // Use your secret key from environment
        { expiresIn: '1h' } // Set expiration time
        );
        res.status(200).json({ token }); // Send the token in the response
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to login' });
    }
};
exports.login = login;
