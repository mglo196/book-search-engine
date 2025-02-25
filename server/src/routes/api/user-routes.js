"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../../controllers/user-controller"); // Make sure the path is correct
// import middleware
const auth_1 = require("../../services/auth");
// Define the routes
router.route('/').post(user_controller_1.createUser).put(auth_1.authenticateToken, user_controller_1.saveBook);
router.route('/login').post(user_controller_1.login); // Route for login
router.route('/me').get(auth_1.authenticateToken, user_controller_1.getSingleUser);
router.route('/books/:bookId').delete(auth_1.authenticateToken, user_controller_1.deleteBook); // Route for deleting a book
exports.default = router;
