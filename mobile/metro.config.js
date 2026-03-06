const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable package exports resolution so Metro uses the react-native field
// instead of the browser/ESM build of Firebase (fixes "Component auth has not been registered yet")
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
