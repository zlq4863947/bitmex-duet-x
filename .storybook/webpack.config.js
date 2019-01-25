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
    '@duet-core': path.resolve( __dirname ,  '../src/app/@core'),
    '@duet-robot': path.resolve( __dirname ,  '../src/lib')
  };
  console.log(storybookBaseConfig)

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
  storybookBaseConfig.resolve.modules = [
    ...(storybookBaseConfig.resolve.modules || []),
    path.resolve(__dirname, "../app/javascript/src"),
  ];*/

/*  
  storybookBaseConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [{
      loader: require.resolve('fs')
    }]
  });
  console.log(storybookBaseConfig)
  storybookBaseConfig.resolve.extensions.push('.ts', '.tsx');*/
  return storybookBaseConfig;
};
