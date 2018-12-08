import log from 'electron-log';
import { app } from 'electron';
import * as fs from 'fs';

// 默认日志级别
log.transports.console.level = log.transports.file.level = 'info';
log.transports.console.format = log.transports.file.format = '[{h}:{i}:{s}:{ms}] - {text}';
log.transports.file.maxSize = 1024 * 1024; // 文件大小 1m
log.transports.file.appName = app.getName();

// Write to this file, must be set before first logging
log.transports.file.file = __dirname + '/log.txt';

// fs.createWriteStream options, must be set before first logging
// you can find more information at
// https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
log.transports.file.streamConfig = { flags: 'w' };

// set existed file stream
log.transports.file.stream = fs.createWriteStream('log.txt');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV === 'development') {
  // 开发日志级别
  log.transports.console.level = log.transports.file.level = 'debug';
  log.transports.console.format = log.transports.file.format = '[{level}] - [{h}:{i}:{s}:{ms}] - {text}';
}

export default log;