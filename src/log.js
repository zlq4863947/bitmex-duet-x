"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_log_1 = require("electron-log");
var electron_1 = require("electron");
var fs = require("fs");
// 默认日志级别
electron_log_1.default.transports.console.level = electron_log_1.default.transports.file.level = 'info';
electron_log_1.default.transports.console.format = electron_log_1.default.transports.file.format = '[{h}:{i}:{s}:{ms}] - {text}';
electron_log_1.default.transports.file.maxSize = 1024 * 1024; // 文件大小 1m
electron_log_1.default.transports.file.appName = electron_1.app.getName();
// Write to this file, must be set before first logging
electron_log_1.default.transports.file.file = __dirname + '/log.txt';
// fs.createWriteStream options, must be set before first logging
// you can find more information at
// https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
electron_log_1.default.transports.file.streamConfig = { flags: 'w' };
// set existed file stream
electron_log_1.default.transports.file.stream = fs.createWriteStream('log.txt');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV === 'development') {
    // 开发日志级别
    electron_log_1.default.transports.console.level = electron_log_1.default.transports.file.level = 'debug';
    electron_log_1.default.transports.console.format = electron_log_1.default.transports.file.format = '[{level}] - [{h}:{i}:{s}:{ms}] - {text}';
}
exports.default = electron_log_1.default;
//# sourceMappingURL=log.js.map