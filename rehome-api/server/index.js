import express from 'express';
import cors from 'cors';
import propertiesRouter from './routes/properties.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/properties', propertiesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 