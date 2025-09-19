const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enhanced resolver configuration for better module resolution
const { resolver } = config;
config.resolver = {
  ...resolver,
  sourceExts: [...resolver.sourceExts, 'mjs', 'cjs'],
};

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });