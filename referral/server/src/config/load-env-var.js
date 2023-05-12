var logger = require('./logger');

const requiredEnv = [];
const unsetEnv = requiredEnv.filter(
  (env) => !(typeof process.env[env] !== 'undefined')
);

if (unsetEnv.length > 0) {
  const errorString = `Required ENV variables are not set: [${unsetEnv.join(
    ', '
  )}]`;
  logger.info(errorString);
  process.exit(1);
}
logger.info(`ENV Variables are read and now initializing the db and app`);
