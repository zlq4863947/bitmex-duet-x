/**
 * Additional webpack config to resolve path-mappings of typescript.
 */

const path = require('path');

module.exports = (storybookBaseConfig, env, config) => {
  storybookBaseConfig.resolve = storybookBaseConfig.resolve || {};
  storybookBaseConfig.resolve.alias = storybookBaseConfig.resolve.alias || {};

  storybookBaseConfig.resolve.alias = {
    ...storybookBaseConfig.resolve.alias,
    'fs': path.resolve(__dirname, 'fsMock.js'),
    '@duet-robot': path.resolve( __dirname ,  '../src/lib')
  };

  storybookBaseConfig.externals = {
      'sql.js': "require('sql.js')",
      sqlite3: "require('sqlite3')",
      redis: "require('redis')",
      'react-native-sqlite-storage': "require('react-native-sqlite-storage')",
      'pg-query-stream': "require('pg-query-stream')",
      'pg-native': "require('pg-native')",
      pg: "require('pg')",
      oracledb: "require('oracledb')",
      mysql2: "require('mysql2')",
      mssql: "require('mssql')",
      mongodb: "require('mongodb')",
      ioredis: "require('ioredis')"
      // fs: 'require("fs")',
  };
/*
  storybookBaseConfig.module.rules.push(
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      loaders: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../")
    },
  );*/
  return storybookBaseConfig;
};
