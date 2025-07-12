import express from 'express';
import { 
  createSwapRequest, 
  getReceivedSwapRequests, 
  getSentSwapRequests,
  acceptSwapRequest,
  declineSwapRequest
} from '../controller/swapController.js';
import authUser from '../middleware/authUser.js';

const swapRouter = express.Router();

swapRouter.use(authUser);

swapRouter.post('/create-request', createSwapRequest);

swapRouter.get('/received', getReceivedSwapRequests);

swapRouter.get('/sent', getSentSwapRequests);

swapRouter.put('/accept/:swapId', acceptSwapRequest);

swapRouter.put('/decline/:swapId', declineSwapRequest);

export default swapRouter;