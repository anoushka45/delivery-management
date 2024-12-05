import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import partnersRoutes from './routes/partners';
import ordersRoutes from './routes/orders';
import assignmentsRoutes from './routes/assignments';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://delivery-management-psi.vercel.app/', // Replace with your Vercel frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Enable this if using cookies or sessions
}));
app.use(express.json());

// Routes
app.use('/api/partners', partnersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/assignments', assignmentsRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));