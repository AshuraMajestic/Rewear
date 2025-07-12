import express from 'express';
import {
  adminLogin,
  deleteItemAdmin,
  deleteUserById,
  getAdmin,
  getAllItemsAdmin,
  getAllUsers,
  getDashboardMetrics,
  verifyAdmin,
} from '../controller/adminController.js';
const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/get-admin', getAdmin);
adminRouter.get('/dashboard', verifyAdmin, getDashboardMetrics);
adminRouter.get("/users", getAllUsers);
adminRouter.delete("/users/:id", deleteUserById);
adminRouter.get('/items', getAllItemsAdmin);
adminRouter.delete('/items/:id', deleteItemAdmin);

export default adminRouter;