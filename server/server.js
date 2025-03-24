import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connect } from 'mongoose';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 5000; // default port to listen
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);
app.use(cookieParser());

//API Endpoints
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/auth', authRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));
