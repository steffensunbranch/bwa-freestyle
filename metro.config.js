const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Apply NativeWind configuration (simplified like rnr-v2-simple)
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });