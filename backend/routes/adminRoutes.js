import express from 'express';
import {
  adminLogin,
  getAdmin,
  getDashboardMetrics,
  verifyAdmin,
} from '../controller/adminController.js';
const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/get-admin', getAdmin);
adminRouter.get('/dashboard', verifyAdmin, getDashboardMetrics);

export default adminRouter;