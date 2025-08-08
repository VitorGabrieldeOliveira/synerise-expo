const { createRunOncePlugin, withPlugins } = require("@expo/config-plugins");

const { dependencies } = require("../../package.json");

const {
  withGradleDependency,
  withPackagingOptions,
  withMavenPackage,
  withMainApplicationPackage,
} = require("./android");
const { withCocoaPodsDependency } = require("./ios");
const { PACKAGE_NAME } = require("./constants");

const withSynerise = (config) => {
  return withPlugins(config, [
    //Android
    withPackagingOptions,
    withGradleDependency,
    withMavenPackage,
    withMainApplicationPackage,

    // iOS
    withCocoaPodsDependency,
  ]);
};

module.exports = createRunOncePlugin(
  withSynerise,
  PACKAGE_NAME,
  dependencies[PACKAGE_NAME]
);
