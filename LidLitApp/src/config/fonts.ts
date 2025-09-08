import { Platform } from 'react-native';

// Font configuration for LidLit App
export const FONTS = {
  ROCK_SALT: Platform.OS === 'ios' ? 'RockSalt-Regular' : 'RockSalt-Regular',
};

// Font loading configuration
export const loadFonts = async () => {
  // In Expo, fonts are automatically loaded from the app.json fonts array
  // This function can be used for additional font loading logic if needed
  return Promise.resolve();
};

export default FONTS;

