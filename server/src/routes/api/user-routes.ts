import express from 'express';
const router = express.Router();
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,  // Import deleteBook
  login         // Import login
} from '../../controllers/user-controller.js';  // Make sure the path is correct

// import middleware
import { authenticateToken } from '../../services/auth';

// Define the routes
router.route('/').post(createUser).put(authenticateToken, saveBook);
router.route('/login').post(login);  // Route for login
router.route('/me').get(authenticateToken, getSingleUser);
router.route('/books/:bookId').delete(authenticateToken, deleteBook);  // Route for deleting a book

export default router;
