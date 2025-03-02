import express from 'express'
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { deleteUserById, editUserById } from '../controllers/admin.controllers.js';

const router = express.Router();

router.route("/editUser/:id").put(authenticateToken,adminMiddleware,editUserById);
router.route("/deleteUser/:id").delete(authenticateToken,adminMiddleware,deleteUserById);

export default router;