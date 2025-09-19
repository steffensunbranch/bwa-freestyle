import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import * as aesjs from 'aes-js';
import 'react-native-get-random-values';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import { Platform } from 'react-native';

// Cross-platform secure storage that works on both mobile and web
class CrossPlatformSecureStore {
  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    // Store encryption key securely based on platform
    if (Platform.OS === 'web') {
      // On web, use sessionStorage for temporary storage (cleared when tab closes)
      // This is more secure than localStorage for sensitive data
      sessionStorage.setItem(`secure_${key}`, aesjs.utils.hex.fromBytes(encryptionKey));
    } else {
      // On mobile, use Expo SecureStore
      await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));
    }

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async _decrypt(key: string, value: string) {
    let encryptionKeyHex: string | null = null;

    // Get encryption key based on platform
    if (Platform.OS === 'web') {
      encryptionKeyHex = sessionStorage.getItem(`secure_${key}`);
    } else {
      encryptionKeyHex = await SecureStore.getItemAsync(key);
    }

    if (!encryptionKeyHex) {
      return encryptionKeyHex;
    }

    const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1));
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string) {
    // Only access AsyncStorage in browser environment
    if (typeof window === 'undefined') {
      return null;
    }
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) { return encrypted; }

    return await this._decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    // Only access AsyncStorage in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    await AsyncStorage.removeItem(key);
    
    // Remove encryption key based on platform
    if (Platform.OS === 'web') {
      sessionStorage.removeItem(`secure_${key}`);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }

  async setItem(key: string, value: string) {
    // Only access AsyncStorage in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    const encrypted = await this._encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }
}

// Validate configuration
if (SUPABASE_URL === 'https://your-project.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key-here') {
  console.warn('[config] Using placeholder Supabase values. Please update lib/config.ts with your actual Supabase credentials.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: new CrossPlatformSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});