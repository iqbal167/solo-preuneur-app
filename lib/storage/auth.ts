import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const authStorage = {
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
  },
};
