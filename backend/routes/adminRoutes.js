import express from 'express';
import {
  adminLogin,
  getAdmin,
} from '../controller/adminController.js';
const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/get-admin', getAdmin);

export default adminRouter;