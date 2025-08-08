const { withPodfile } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

const withCocoaPodsDependency = (config) => {
  return withPodfile(config, (conf) => {
    let results;

    try {
      results = mergeContents({
        tag: 'react-native-synerise-sdk',
        src: conf.modResults.contents,
        newSrc: "  pod 'react-native-synerise-sdk', :path => '../node_modules/react-native-synerise-sdk'",
        anchor: /use_native_modules/,
        offset: 0,
        comment: '  #',
      });
    } catch {
      throw new Error("Cannot add react-native-synerise-sdk to the project's ios/Podfile because it's malformed.");
    }

    conf.modResults.contents = results.contents;

    return conf;
  });
};

module.exports = { withCocoaPodsDependency };
