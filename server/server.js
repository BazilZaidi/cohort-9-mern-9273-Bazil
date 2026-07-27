// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const pinoHttp = require('pino-http');

// const connectDB = require('./config/db');
// const logger = require('./utils/logger');
// const authRoutes = require('./routes/authRoutes');

// const app = express();

// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use(pinoHttp({ logger }));
// app.use('/api/auth', authRoutes);

// app.get('/api/health', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'Server is running' });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   logger.info(`Server started on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });
}

module.exports = app;