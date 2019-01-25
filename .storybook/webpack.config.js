/**
 * Additional webpack config to resolve path-mappings of typescript.
 */

const path = require('path');

module.exports = (storybookBaseConfig) => {
  storybookBaseConfig.resolve = storybookBaseConfig.resolve || {};
  storybookBaseConfig.resolve.alias = storybookBaseConfig.resolve.alias || {};

  return storybookBaseConfig;
};
