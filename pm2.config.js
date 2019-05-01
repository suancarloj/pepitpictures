const path = require('path');

module.exports = [
  {
    name: 'picture-viewer',
    script: 'picture-viewer/src/server/server.js',
    instance_var: 'INSTANCE_ID',
    env: {
      PROCESS_NAME: 'picture-viewer',
      NODE_CONFIG_DIR: path.resolve(__dirname, 'picture-viewer/config'),
    },
    exec_mode: 'cluster',
    instances: 1,
    merge_logs: true,
    log_file: './logs/pm2-picture-viewer-service.log',
    error_file: './logs/pm2-picture-viewer-service-err.log',
    source_map_support: true,
  },
  {
    name: 'picture-uploader',
    script: 'picture-uploader/src/server/server.js',
    instance_var: 'INSTANCE_ID',
    env: {
      PROCESS_NAME: 'picture-uploader',
      NODE_CONFIG_DIR: path.resolve(__dirname, 'picture-uploader/config'),
    },
    exec_mode: 'cluster',
    instances: 1,
    merge_logs: true,
    log_file: './logs/pm2-picture-uploader-service.log',
    error_file: './logs/pm2-picture-uploader-service-err.log',
    source_map_support: true,
  },
  {
    name: 'server',
    script: 'server/bin/www.js',
    instance_var: 'INSTANCE_ID',
    env: {
      PROCESS_NAME: 'server',
      NODE_CONFIG_DIR: path.resolve(__dirname, 'server/config'),
      PORT: 9000,
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
    instance_var: 'INSTANCE_ID',
    env: {
      PROCESS_NAME: 'worker',
      NODE_CONFIG_DIR: path.resolve(__dirname, 'worker/config'),
    },
    exec_mode: 'cluster',
    instances: 1,
    merge_logs: true,
    log_file: './logs/pm2-worker-service.log',
    error_file: './logs/pm2-worker-service-err.log',
    source_map_support: true,
  },
]