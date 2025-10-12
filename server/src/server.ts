import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { initializeDatabase } from './database/sqlite.js';
import authRoutes from './routes/authRoutes.js';
import formRoutes from './routes/formRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// Initialize database
initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`=� Server running on port ${config.port}`);
  console.log(`=� Environment: ${config.nodeEnv}`);
  console.log(`= CORS enabled for: ${config.corsOrigin}`);
});
