import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.post('/api/properties', async (req, res) => {
  // ... الكود الموجود لديك
});

app.get('/api/properties', async (req, res) => {
  // ... الكود الموجود لديك
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 