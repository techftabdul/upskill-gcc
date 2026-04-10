import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './src/routes/ai.js';
import historyRoutes from './src/routes/history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
// Allow multiple local dev ports (Vite may pick 5173 or 5174+)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/ai', aiRoutes);
app.use('/api/history', historyRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'UpSkill backend is running 🚀' });
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});