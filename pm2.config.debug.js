const path = require('path');

module.exports = [
  {
    name: 'server',
    script: 'server/bin/www.js',
    env: {
      PROCESS_NAME: 'server',
      NODE_CONFIG_DIR: path.resolve(__dirname, 'server/config'),
      PORT: 2222,
      DEBUG: '*'
    },
    exec_mode: 'cluster',
    instances: 1,
    merge_logs: true,
    log_file: './logs/pm2-server-service.log',
    error_file: './logs/pm2-server-service-err.log',
    source_map_support: true,
  },
  {
    name: 'worker',
    script: 'worker/index.js',
    env: {
      PROCESS_NAME: 'worker',
      NODE_CONFIG_DIR: path.resolve(__dirname, 'worker/config'),
      DEBUG: '*'
    },
    exec_mode: 'cluster',
    instances: 1,
    merge_logs: true,
    log_file: './logs/pm2-worker-service.log',
    error_file: './logs/pm2-worker-service-err.log',
    source_map_support: true,
  },
]