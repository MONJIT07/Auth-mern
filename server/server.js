import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongoose.js';
import authRouter from './routes/authroutes.js';
import userRouter from './routes/UserRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(cookieParser());

// api endpoints
app.get('/', (req, res) => res.send('api is working fine'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Only listen when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server started on PORT :${port}`);
  });
}

export default app;