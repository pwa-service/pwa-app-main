const { join } = require('path');
module.exports = {
  PROTOS_DIR: join(__dirname, 'protos'),
  AUTH_PROTO: join(__dirname, 'protos', 'auth.proto'),
  EVENT_HANDLER_PROTO: join(__dirname, 'protos', 'event_handler.proto'),
};
