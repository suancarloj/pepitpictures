const logRoot = 'logs/';
const path = require('path');

module.exports = [
  {
    name: 'server',
    script: 'server/bin/www.js',
    exec_mode: 'cluster',
    instances: 1,
    merge_logs: true,
    log_file: `logs/pm2-server.log`,
    error_file: `logs/pm2-server-err.log`,
    source_map_support: true,
  },
  {
    name: 'worker',
    script: 'worker/index.js',
    exec_mode: 'cluster',
    instances: 1,
    merge_logs: true,
    log_file: `logs/pm2-worker.log`,
    error_file: `logs/pm2-worker-err.log`,
    source_map_support: true,
  }
];
