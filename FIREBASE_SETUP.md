# Firebase Setup Guide for 12 Step Tracker

This guide will walk you through setting up Firebase for your 12-step tracker app.

## Prerequisites

Before you begin, make sure you have:
- A Google account
- Node.js installed
- The app dependencies installed (`npm install` has been run)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "12-step-tracker")
4. Choose whether to enable Google Analytics (optional but recommended)
5. Click "Create project"

## Step 2: Set up Firebase Authentication

1. In your Firebase project console, navigate to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Set up Cloud Firestore Database

1. In your Firebase project console, navigate to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll configure security rules later)
4. Select a location for your database (choose the one closest to your users)
5. Click "Done"

## Step 4: Get Your Firebase Configuration

1. In your Firebase project console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Web" (</>) to add a web app
5. Enter an app nickname (e.g., "12-step-tracker-web")
6. Click "Register app"
7. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 5: Configure Your App Securely

**🔒 IMPORTANT**: Never put API keys directly in your code! We'll use environment variables for security.

1. **Create your environment file**:
   ```bash
   cp env.example .env
   ```

2. **Edit the `.env` file** with your actual Firebase configuration values from Step 4:
   ```bash
   # Open .env file and replace with your actual values
   FIREBASE_API_KEY=your-actual-api-key
   FIREBASE_AUTH_DOMAIN=your-actual-project-id.firebaseapp.com
   FIREBASE_PROJECT_ID=your-actual-project-id
   FIREBASE_STORAGE_BUCKET=your-actual-project-id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
   FIREBASE_APP_ID=your-actual-app-id
   ```

3. **Verify the `.env` file is in your `.gitignore`** (it should already be there)

The app will automatically load these environment variables and use them securely. Your Firebase keys will never be committed to version control!

## Step 6: Set up Firestore Security Rules

1. Go back to "Firestore Database" in your Firebase console
2. Click on the "Rules" tab
3. Replace the default rules with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Allow access to user's subcollections
      match /{collection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

4. Click "Publish"

## Step 7: Test Your Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. The app should now show the authentication screen
3. Try creating a new account with an email and password
4. After successful registration, you should be taken to the main app

## Data Structure

Your Firebase Firestore will be organized like this:

```
users/
  {userId}/
    - email: string
    - displayName: string
    - sobrietyDate: timestamp
    - createdAt: timestamp
    - updatedAt: timestamp

    reflections/
      {reflectionId}/
        - text: string
        - date: timestamp
        - createdAt: timestamp

    meetings/
      {meetingId}/
        - type: string
        - location: string
        - notes: string
        - date: timestamp
        - createdAt: timestamp

    moods/
      {moodId}/
        - mood: number (1-10)
        - notes: string
        - date: timestamp
        - createdAt: timestamp

    goals/
      {goalId}/
        - title: string
        - description: string
        - targetDate: timestamp
        - status: string
        - progress: number
        - createdAt: timestamp
        - updatedAt: timestamp

    meditation/
      {sessionId}/
        - duration: number (minutes)
        - type: string
        - notes: string
        - date: timestamp
        - createdAt: timestamp

    gratitude/
      {entryId}/
        - entries: array of strings
        - date: timestamp
        - createdAt: timestamp
```

## Available Services

The app includes several service functions to interact with Firebase:

### Authentication (via AuthContext)
- `signUp(email, password, displayName)`
- `signIn(email, password)`
- `logout()`
- `resetPassword(email)`
- `updateUserProfile(profileData)`

### User Profile
- `userService.createOrUpdateProfile(userData)`
- `userService.getProfile()`
- `userService.onProfileChange(callback)`

### Clean Time Tracking
- `cleanTimeService.setSobrietyDate(date)`
- `cleanTimeService.getCleanTime()`

### Daily Reflections
- `reflectionService.addReflection(reflection)`
- `reflectionService.getTodaysReflection()`
- `reflectionService.getAllReflections()`

### Progress Tracking
- `progressService.logMeeting(meetingData)`
- `progressService.getMeetings(startDate, endDate)`
- `progressService.logMood(moodData)`
- `progressService.getMoods(limit)`

### Goals Management
- `goalsService.createGoal(goalData)`
- `goalsService.updateGoal(goalId, updates)`
- `goalsService.getGoals()`
- `goalsService.deleteGoal(goalId)`

### Meditation Tracking
- `meditationService.logSession(sessionData)`
- `meditationService.getStats()`

### Gratitude Journal
- `gratitudeService.addEntry(entries)`
- `gratitudeService.getEntries(limit)`

## Next Steps

1. **Update your screens** to use the Firebase services instead of mock data
2. **Test all functionality** with real data
3. **Add offline support** using React Native AsyncStorage for caching
4. **Implement push notifications** for daily reminders
5. **Add data export/import** functionality
6. **Set up Firebase Hosting** for web deployment

## Troubleshooting

### Common Issues:

1. **"No Firebase App '[DEFAULT]' has been created"**
   - Make sure you've updated the Firebase configuration in `src/config/firebase.js`

2. **Authentication errors**
   - Check that Email/Password authentication is enabled in Firebase Console
   - Verify your Firebase configuration is correct

3. **Firestore permission errors**
   - Make sure you've updated the security rules as shown in Step 6
   - Ensure the user is authenticated before making database calls

4. **Build errors on iOS/Android**
   - For iOS: Make sure you have the GoogleService-Info.plist file (for native builds)
   - For Android: Make sure you have the google-services.json file (for native builds)
   - Since we're using Firebase Web SDK with Expo, these files aren't needed for Expo development

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase Docs](https://rnfirebase.io/)
- [Expo Firebase Integration](https://docs.expo.dev/guides/using-firebase/)

## Security Best Practices

1. ✅ **Environment Variables**: Your Firebase configuration is now safely stored in `.env` files
2. ✅ **Git Security**: The `.env` file is automatically ignored by Git
3. **Regularly review your Firestore security rules**
4. **Enable App Check** for additional security (advanced)
5. **Monitor Firebase usage** in the console to detect unusual activity
6. **Team Setup**: When working with a team, share Firebase config securely (not through Git)

### 🚨 What NOT to do:
- ❌ Don't put API keys directly in code files
- ❌ Don't commit `.env` files to Git
- ❌ Don't share API keys in chat/email
- ❌ Don't use production keys for development

### ✅ What TO do:
- ✅ Use environment variables (already set up!)
- ✅ Use different Firebase projects for dev/staging/production
- ✅ Regularly rotate API keys if compromised
- ✅ Share config through secure channels only

Your Firebase setup is now complete! The app will automatically handle user authentication and data persistence.
