const { withAppBuildGradle, withMainApplication, withProjectBuildGradle } = require('@expo/config-plugins');
const { addImports } = require('@expo/config-plugins/build/android/codeMod');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

const { dependencies } = require('../../../package.json');
const { PACKAGE_NAME } = require('../constants');

const withBuildScriptResolution = (config) => {
  return withProjectBuildGradle(config, (conf) => {
    let results;

    try {
      const newSrc = `  configurations.all {
    resolutionStrategy.dependencySubstitution {
      all { DependencySubstitution s ->
        if (s.requested instanceof ModuleComponentSelector) {
          def r = s.requested as ModuleComponentSelector
          if ((r.group == 'org.bouncycastle' && r.module == 'bcprov-jdk15to18') || (r.group == 'org.bouncycastle' && r.module == 'bcutil-jdk15to18')) {
            s.useTarget 'org.bouncycastle:bcutil-jdk18on:1.78.1'
          }
        }
      }
    }
  }`;

      results = mergeContents({
        tag: 'react-native-synerise-sdk:buildscript-resolution',
        src: conf.modResults.contents,
        newSrc,
        anchor: /buildscript/,
        offset: 1,
        comment: '  //',
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

const withAllProjectsResolution = (config) => {
  return withProjectBuildGradle(config, (conf) => {
    let results;

    try {
      const newSrc = `  configurations.all {
    resolutionStrategy.dependencySubstitution {
      all { DependencySubstitution s ->
        if (s.requested instanceof ModuleComponentSelector) {
          def r = s.requested as ModuleComponentSelector
          if ((r.group == 'org.bouncycastle' && r.module == 'bcprov-jdk15to18') || (r.group == 'org.bouncycastle' && r.module == 'bcutil-jdk15to18')) {
            s.useTarget 'org.bouncycastle:bcutil-jdk18on:1.78.1'
          }
        }
      }
    }
  }`;

      results = mergeContents({
        tag: 'react-native-synerise-sdk:allprojects-resolution',
        src: conf.modResults.contents,
        newSrc,
        anchor: /allprojects/,
        offset: 1,
        comment: '  //',
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

const withMavenPackage = (config) => {
  return withProjectBuildGradle(config, (conf) => {
    let results;

    try {
      results = mergeContents({
        tag: 'react-native-synerise-sdk:maven-package',
        src: conf.modResults.contents,
        newSrc: `    maven { url 'https://pkgs.dev.azure.com/Synerise/AndroidSDK/_packaging/prod/maven/v1' }`,
        anchor: /www.jitpack.io/,
        offset: 1,
        comment: '    //',
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

const withDefaultConfig = (config) => {
  return withAppBuildGradle(config, (conf) => {
    let results;

    try {
      results = mergeContents({
        tag: 'react-native-synerise-sdk:default-config',
        src: conf.modResults.contents,
        newSrc: '        multiDexEnabled true',
        anchor: /defaultConfig/,
        offset: 1,
        comment: '        //',
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
      const newSrc = `        exclude 'META-INF/versions/9/OSGI-INF/MANIFEST.MF'
        pickFirst 'com/synerise/sdk/react/BuildConfig.class'`;

      results = mergeContents({
        tag: 'react-native-synerise-sdk:packaging-options',
        src: conf.modResults.contents,
        newSrc,
        anchor: /packagingOptions/,
        offset: 1,
        comment: '        //',
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

    const dependencyVersion = dependencies[PACKAGE_NAME].replace('^', '');

    try {
      const newSrc = `    implementation 'com.synerise.sdk.react:react-native-synerise-sdk:${dependencyVersion}'
    implementation 'androidx.multidex:multidex:2.0.1'`;

      results = mergeContents({
        tag: 'react-native-synerise-sdk:gradle-dependency',
        src: conf.modResults.contents,
        newSrc,
        anchor: /com.facebook.react:react-android/,
        offset: 1,
        comment: '    //',
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
      const withImports = addImports(conf.modResults.contents, ['com.synerise.sdk.react.RNSyneriseSdkPackage'], false);

      results = mergeContents({
        tag: 'react-native-synerise-sdk',
        src: withImports,
        newSrc: '            packages.add(RNSyneriseSdkPackage())',
        anchor: /return packages/,
        offset: 0,
        comment: '            //',
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
  withBuildScriptResolution,
  withAllProjectsResolution,
  withMavenPackage,
  withDefaultConfig,
  withPackagingOptions,
  withGradleDependency,
  withMainApplicationPackage,
};
