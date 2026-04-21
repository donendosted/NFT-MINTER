// Mock Redis client - disabled for development
const mockRedis = {
  get: () => Promise.resolve(null),
  set: () => Promise.resolve('OK'),
  del: () => Promise.resolve(0),
  flushall: () => Promise.resolve('OK'),
  ping: () => Promise.resolve('PONG'),
  quit: () => Promise.resolve('OK'),
};

module.exports = mockRedis;
