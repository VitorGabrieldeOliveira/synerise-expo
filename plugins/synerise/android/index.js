const {
  withAppBuildGradle,
  withMainApplication,
  withProjectBuildGradle,
} = require("@expo/config-plugins");
const { addImports } = require("@expo/config-plugins/build/android/codeMod");
const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode");

const { dependencies } = require("../../../package.json");
const { PACKAGE_NAME } = require("../constants");

const withMavenPackage = (config) => {
  return withProjectBuildGradle(config, (conf) => {
    let results;

    try {
      results = mergeContents({
        tag: "react-native-synerise-sdk:maven-package",
        src: conf.modResults.contents,
        newSrc: `    maven { url 'https://pkgs.dev.azure.com/Synerise/AndroidSDK/_packaging/prod/maven/v1' }`,
        anchor: /www.jitpack.io/,
        offset: 1,
        comment: "    //",
      });
    } catch {
      throw new Error(
        "Cannot add react-native-synerise-sdk to the project's android/app/build.gradle because it's malformed."
      );
    }

    conf.modResults.contents = results.contents;

    return conf;
  });
};

const withPackagingOptions = (config) => {
  return withAppBuildGradle(config, (conf) => {
    let results;

    try {
      results = mergeContents({
        tag: "react-native-synerise-sdk:packaging-options",
        src: conf.modResults.contents,
        newSrc: `        exclude 'META-INF/versions/9/OSGI-INF/MANIFEST.MF'`,
        anchor: /packagingOptions/,
        offset: 1,
        comment: "        //",
      });
    } catch {
      throw new Error(
        "Cannot add react-native-synerise-sdk to the project's android/app/build.gradle because it's malformed."
      );
    }

    conf.modResults.contents = results.contents;

    return conf;
  });
};

const withGradleDependency = (config) => {
  return withAppBuildGradle(config, (conf) => {
    let results;

    const dependencyVersion = dependencies[PACKAGE_NAME].replace("^", "");

    try {
      results = mergeContents({
        tag: "react-native-synerise-sdk:gradle-dependency",
        src: conf.modResults.contents,
        newSrc: `    implementation 'com.synerise.sdk.react:react-native-synerise-sdk:${dependencyVersion}'`,
        anchor: /com.facebook.react:react-android/,
        offset: 1,
        comment: "    //",
      });
    } catch {
      throw new Error(
        "Cannot add react-native-synerise-sdk to the project's android/app/build.gradle because it's malformed."
      );
    }

    conf.modResults.contents = results.contents;

    return conf;
  });
};

const withMainApplicationPackage = (config) => {
  return withMainApplication(config, (conf) => {
    let results;

    try {
      const withImports = addImports(
        conf.modResults.contents,
        ["com.synerise.sdk.react.RNSyneriseSdkPackage"],
        false
      );

      results = mergeContents({
        tag: "react-native-synerise-sdk",
        src: withImports,
        newSrc: "            packages.add(RNSyneriseSdkPackage())",
        anchor: /return packages/,
        offset: 0,
        comment: "            //",
      });
    } catch {
      throw new Error(
        "Cannot add react-native-synerise-sdk to the project's MainApplication.kt because it's malformed."
      );
    }

    conf.modResults.contents = results.contents;

    return conf;
  });
};

module.exports = {
  withMavenPackage,
  withPackagingOptions,
  withGradleDependency,
  withMainApplicationPackage,
};
