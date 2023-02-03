import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'capitulo03',
  webDir: 'www',
  bundledWebRuntime: false,
  ios: {
    path: './platform/ios'
  },
  android: {
    path: './platform/android'
  }
};

export default config;
