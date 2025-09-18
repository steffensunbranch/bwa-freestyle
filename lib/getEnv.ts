// lib/getEnv.ts
import { Platform } from "react-native";

/**
 * Helper to get a required env variable with runtime validation.
 * Throws an error if missing.
 */
export function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[env] Missing environment variable: ${key}`);
  }
  return value;
}

/**
 * Helper to get an optional env variable.
 * Returns undefined if missing.
 */
export function getOptionalEnvVar(key: string): string | undefined {
  return process.env[key];
}

/**
 * Helper to get a required, platform-specific env variable.
 */
export function getPlatformEnvVar(iosVar: string, androidVar: string): string {
  const value = Platform.select({
    ios: process.env[iosVar],
    android: process.env[androidVar],
  });
  if (!value) {
    throw new Error(`[env] Missing platform-specific environment variable: ${Platform.OS === 'ios' ? iosVar : androidVar}`);
  }
  return value;
}
