import 'dotenv/config';

export default {
  expo: {
    name: '12 Step Tracker',
    slug: 'twelve-step-tracker',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#f0f4f7',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.twelvesteptracker',
    },
    android: {
      package: 'com.yourcompany.twelvesteptracker',
    },
    web: {},
    extra: {
      // These will be available via Constants.expoConfig.extra
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
  },
};
