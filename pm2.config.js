const logRoot = 'logs/';
const path = require('path');

module.exports = [
  {
    name: 'server',
    script: 'server/bin/www.js',
    exec_mode: 'cluster',
    instances: 1,
    merge_logs: true,
    log_file: `logs/pm2-app-api.log`,
    error_file: `logs/pm2-app-api-err.log`,
    source_map_support: true,
  }
];
