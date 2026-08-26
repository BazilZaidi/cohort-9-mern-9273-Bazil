require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
app.disable('x-powered-by');

connectDB();

// app.use(cors());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));
// app.use(express.json());
app.use(express.json({ limit: '2mb' }));
app.use(pinoHttp({ logger }));

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });
}

module.exports = app;