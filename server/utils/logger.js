// const pino = require('pino');

// const logger = pino({
//   level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
//   transport: {
//     target: 'pino-pretty',
//     options: { colorize: true }
//   }
// });

// module.exports = logger;

const pino = require('pino');

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

module.exports = logger;