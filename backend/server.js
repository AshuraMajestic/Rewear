import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/mongodb.js';

import adminRouter from './routes/adminRoutes.js';
import uploadRouter from './routes/uploadRoutes.js'; 
import userRouter from './routes/userRoutes.js'; 
import clothRouter from './routes/clothRoutes.js'; 

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// App Config
const app = express();
const PORT = process.env.PORT || 4000;
connectDB()

const allowedOrigins = process.env.APP_ORIGINS 
  ? process.env.APP_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000']; 
// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH','PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token','adminToken','X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  credentials: true, 
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)
app.use('/api/cloth',clothRouter)
app.use('/api/upload', uploadRouter)

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Basic API test route
app.get('/api', (req, res) => {
  res.send('Api Working');
});




// Server Start
app.listen(PORT, () => console.log(`✅ Server Started on Port ${PORT}`));