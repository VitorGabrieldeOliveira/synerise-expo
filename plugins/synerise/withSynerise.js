const { createRunOncePlugin, withPlugins } = require('@expo/config-plugins');

const { dependencies } = require('../../package.json');

const {
  withBuildScriptResolution,
  withAllProjectsResolution,
  withMavenPackage,
  withDefaultConfig,
  withPackagingOptions,
  withGradleDependency,
  withMainApplicationPackage,
} = require('./android');
const { withCocoaPodsDependency } = require('./ios');
const { PACKAGE_NAME } = require('./constants');

const withSynerise = (config) => {
  return withPlugins(config, [
    //Android
    withBuildScriptResolution,
    withAllProjectsResolution,
    withMavenPackage,
    withDefaultConfig,
    withPackagingOptions,
    withGradleDependency,
    withMainApplicationPackage,

    // iOS
    withCocoaPodsDependency,
  ]);
};

module.exports = createRunOncePlugin(withSynerise, PACKAGE_NAME, dependencies[PACKAGE_NAME]);
