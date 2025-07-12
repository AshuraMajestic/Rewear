import express from 'express';
import {
  adminLogin,
  deleteAdminSwapRequest,
  deleteItemAdmin,
  deleteUserById,
  getAdmin,
  getAdminSwapRequests,
  getAllItemsAdmin,
  getAllUsers,
  getDashboardMetrics,
  verifyAdmin,
} from '../controller/adminController.js';
const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/get-admin', getAdmin);
adminRouter.get('/dashboard', verifyAdmin, getDashboardMetrics);
adminRouter.get("/users",verifyAdmin, getAllUsers);
adminRouter.delete("/users/:id",verifyAdmin, deleteUserById);
adminRouter.get('/items',verifyAdmin, getAllItemsAdmin);
adminRouter.delete('/items/:id',verifyAdmin, deleteItemAdmin);
adminRouter.get('/swap-requests',verifyAdmin, getAdminSwapRequests);
adminRouter.delete('/swap-requests/:id',verifyAdmin, deleteAdminSwapRequest);

export default adminRouter;