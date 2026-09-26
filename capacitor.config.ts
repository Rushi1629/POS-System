import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.secretcafe.pos',
  appName: 'The Secret Cafe',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  }
};

export default config;
