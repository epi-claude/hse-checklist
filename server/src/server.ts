import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { initializeDatabase } from './database/sqlite';
import authRoutes from './routes/authRoutes';
import formRoutes from './routes/formRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
// In production, allow same-origin requests (frontend and API on same domain)
// In development, allow localhost:5173 and local network IPs
const corsOptions = config.nodeEnv === 'production'
  ? {
      origin: true, // Allow all origins in production since same domain
      credentials: true,
      exposedHeaders: ['Content-Disposition']
    }
  : {
      origin: ['http://localhost:5173', /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/],
      credentials: true,
      exposedHeaders: ['Content-Disposition']
    };

app.use(cors(corsOptions));
app.use(express.json());

// Initialize database
initializeDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (config.nodeEnv === 'production') {
  // Path to client build folder
  const clientBuildPath = path.join(__dirname, '../../client/dist');

  // Serve static files
  app.use(express.static(clientBuildPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handler (must be last)
app.use(errorHandler);

// Start server - listen on all network interfaces
app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`CORS enabled for: ${config.corsOrigin}`);
  if (config.nodeEnv === 'development') {
    console.log(`Access locally at: http://localhost:${config.port}`);
    console.log(`Access on network at: http://<your-ip>:${config.port}`);
  }
});
