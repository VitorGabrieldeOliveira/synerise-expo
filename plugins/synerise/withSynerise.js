const { createRunOncePlugin, withPlugins } = require("@expo/config-plugins");

const { dependencies } = require("../../package.json");

const {
  withMavenPackage,
  withPackagingOptions,
  withGradleDependency,
  withMainApplicationPackage,
} = require("./android");
const { withCocoaPodsDependency } = require("./ios");
const { PACKAGE_NAME } = require("./constants");

const withSynerise = (config) => {
  return withPlugins(config, [
    //Android
    withMavenPackage,
    withPackagingOptions,
    withGradleDependency,
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
