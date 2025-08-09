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

        // Global meetings collection - read-only for app users
    match /meetings/{meetingId} {
      allow read: if request.auth != null;
      // No write access from the app - meetings are managed externally
    }

    // Sponsorship relationships
    match /sponsorships/{relationshipId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == resource.data.sponsorId ||
         request.auth.uid == resource.data.sponseeId);
      allow create: if request.auth != null &&
        (request.auth.uid == request.resource.data.sponsorId ||
         request.auth.uid == request.resource.data.sponseeId);
    }

    // Community groups - public read, member write
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        request.auth.uid in resource.data.adminIds;
    }

    // Group memberships
    match /group_memberships/{membershipId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         isGroupAdmin(resource.data.groupId));
      allow write: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         isGroupAdmin(resource.data.groupId));
      allow create: if request.auth != null;
    }

    // Group challenges
    match /group_challenges/{challengeId} {
      allow read: if request.auth != null &&
        isGroupMember(resource.data.groupId);
      allow create: if request.auth != null &&
        isGroupMember(request.resource.data.groupId);
      allow update: if request.auth != null &&
        (request.auth.uid == resource.data.createdBy ||
         isGroupAdmin(resource.data.groupId));
    }

    // Challenge participations
    match /challenge_participations/{participationId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         isGroupMember(resource.data.groupId));
      allow write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }

    // Helper functions
    function isGroupMember(groupId) {
      return exists(/databases/$(database)/documents/group_memberships/$(request.auth.uid + '_' + groupId));
    }

    function isGroupAdmin(groupId) {
      return request.auth.uid in get(/databases/$(database)/documents/groups/$(groupId)).data.adminIds;
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
# Global Collections (Shared Data)
meetings/
  {meetingId}/
    - name: string
    - description: string
    - type: string ('AA', 'NA', 'CA', 'Al-Anon', 'Other')
    - format: string ('In-Person', 'Online', 'Hybrid')
    - dayOfWeek: number (0-6, Sunday=0)
    - time: string (e.g., "19:00")
    - duration: number (minutes)
    - location: object
      - name: string
      - address: string
      - city: string
      - state: string
      - zipCode: string
      - latitude: number (optional)
      - longitude: number (optional)
    - contactInfo: object (optional)
      - phone: string
      - email: string
      - website: string
    - specialNotes: string (optional)
    - isActive: boolean
    - createdAt: timestamp
    - updatedAt: timestamp



# User-Specific Collections
sponsorships/
  {relationshipId}/
    - sponsorId: string (reference to user)
    - sponseeId: string (reference to user)
    - status: string ('pending', 'active', 'completed', 'cancelled')
    - startDate: timestamp
    - endDate: timestamp (optional)
    - notes: string (optional)
    - createdAt: timestamp
    - updatedAt: timestamp

groups/
  {groupId}/
    - name: string
    - description: string
    - type: string ('AA', 'NA', 'CA', 'Al-Anon', 'General', 'Other')
    - privacy: string ('public', 'private', 'invite-only')
    - location: object (optional)
      - city: string
      - state: string
      - region: string
    - adminIds: array of strings
    - memberCount: number
    - isActive: boolean
    - settings: object
      - allowChallenges: boolean
      - allowLeaderboards: boolean
      - requireApproval: boolean
    - createdAt: timestamp
    - updatedAt: timestamp

group_memberships/
  {membershipId}/
    - groupId: string (reference to groups)
    - userId: string (reference to users)
    - role: string ('member', 'moderator', 'admin')
    - status: string ('pending', 'active', 'suspended')
    - joinedAt: timestamp
    - permissions: array of strings (optional)
    - createdAt: timestamp

group_challenges/
  {challengeId}/
    - groupId: string (reference to groups)
    - createdBy: string (reference to users)
    - title: string
    - description: string
    - type: string ('meeting_attendance', 'clean_time', 'meditation', 'gratitude', 'custom')
    - status: string ('upcoming', 'active', 'completed', 'cancelled')
    - startDate: timestamp
    - endDate: timestamp
    - goals: object
      - target: number
      - unit: string ('meetings', 'days', 'minutes', 'entries')
    - participants: number
    - rewards: array of strings (optional)
    - createdAt: timestamp
    - updatedAt: timestamp

challenge_participations/
  {participationId}/
    - challengeId: string (reference to group_challenges)
    - userId: string (reference to users)
    - groupId: string (reference to groups)
    - status: string ('joined', 'active', 'completed', 'dropped')
    - progress: number
    - rank: number (optional)
    - joinedAt: timestamp
    - completedAt: timestamp (optional)
    - createdAt: timestamp

# User-Specific Collections
users/
  {userId}/
    - email: string
    - displayName: string
    - sobrietyDate: timestamp
    - avatar: string (optional, URL to profile picture)
    - bio: string (optional)
    - location: object (optional, for meeting search)
      - latitude: number
      - longitude: number
      - city: string
      - state: string
      - zipCode: string
    - privacy: object
      - showCleanTime: boolean
      - showInLeaderboards: boolean
      - allowSponsorRequests: boolean
      - showToGroups: boolean
    - preferences: object
      - notificationSettings: object
        - challengeReminders: boolean
        - sponsorMessages: boolean
        - groupUpdates: boolean
    - createdAt: timestamp
    - updatedAt: timestamp

    reflections/
      {reflectionId}/
        - text: string
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

    attendance/
      {attendanceId}/
        - attendanceDate: timestamp
        - meetingType: string (optional: 'AA', 'NA', 'CA', 'Al-Anon', 'Other')
        - meetingFormat: string (optional: 'In-Person', 'Online', 'Hybrid')
        - location: string (optional free-text location)
        - notes: string (optional)
        - rating: number (1-5, optional, rating of the meeting experience)
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

### Meeting Search & Discovery
- `meetingService.searchMeetings(filters)` - Search meetings by location, type, time, etc.
- `meetingService.getMeetingById(meetingId)` - Get specific meeting details
- `meetingService.getTodaysMeetings(userLocation?, radius?)` - Find meetings happening today

### Meeting Attendance
- `attendanceService.logAttendance(attendanceData)` - Log detailed meeting attendance
- `attendanceService.quickLogAttendance(notes?)` - Quick log "I attended a meeting"
- `attendanceService.getUserAttendance(startDate?, endDate?, limit?)` - Get user's attendance history
- `attendanceService.getAttendanceStats(daysPeriod?)` - Get comprehensive attendance statistics
- `attendanceService.getRecentAttendance(days?)` - Get recent attendance for quick overview
- `attendanceService.hasAttendedToday()` - Check if user attended a meeting today

### Progress Tracking
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

### Sponsorship Management
- `sponsorshipService.sendSponsorRequest(sponsorId, notes?)` - Request someone as sponsor
- `sponsorshipService.respondToSponsorRequest(relationshipId, accept)` - Accept/decline sponsor request
- `sponsorshipService.getCurrentSponsor()` - Get current sponsor relationship
- `sponsorshipService.getCurrentSponsees()` - Get list of current sponsees
- `sponsorshipService.getPendingRequests()` - Get pending sponsor requests

### Community Groups
- `communityService.createGroup(groupData)` - Create a new community group
- `communityService.searchGroups(filters)` - Search for groups by type, location, etc.
- `communityService.joinGroup(groupId, role?)` - Join a community group
- `communityService.getUserGroups()` - Get user's group memberships
- `communityService.getGroupMembers(groupId)` - Get members of a specific group

### Group Challenges & Leaderboards
- `challengeService.createChallenge(challengeData)` - Create a group challenge
- `challengeService.joinChallenge(challengeId, groupId)` - Join a group challenge
- `challengeService.getGroupChallenges(groupId, status?)` - Get challenges for a group
- `challengeService.getUserChallenges(status?)` - Get user's challenge participations
- `challengeService.updateProgress(challengeId, progress)` - Update challenge progress manually
- `challengeService.updateChallengeProgressFromUserData(challengeId)` - Auto-calculate progress from user data
- `challengeService.getChallengeLeaderboard(challengeId)` - Get leaderboard for a challenge

## Example Usage

### Searching for Meetings

```javascript
import { meetingService } from '../services/firebaseService';

// Search for AA meetings within 10 miles of user location
const searchFilters = {
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
  },
  radius: 10,
  type: ['AA'],
  format: ['In-Person', 'Hybrid'],
  dayOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
  timeRange: {
    start: '18:00',
    end: '20:00',
  },
};

const meetings = await meetingService.searchMeetings(searchFilters);
```

### Logging Meeting Attendance

```javascript
import { attendanceService } from '../services/firebaseService';

// Quick log - just log that user attended a meeting
await attendanceService.quickLogAttendance('Great meeting today!');

// Detailed log with more information
await attendanceService.logAttendance({
  meetingType: 'AA',
  meetingFormat: 'In-Person',
  location: 'Community Center Downtown',
  notes: 'Great discussion about step 4',
  rating: 5,
});

// Check if user already attended today
const attendedToday = await attendanceService.hasAttendedToday();
if (!attendedToday) {
  // Show reminder or quick log option
}

// Get attendance stats for the last 30 days
const stats = await attendanceService.getAttendanceStats(30);
console.log(`Attended ${stats.totalMeetings} meetings`);
console.log(`Meeting types: ${JSON.stringify(stats.meetingsByType)}`);
console.log(`${stats.streakDays} day streak`);
console.log(`Attended meetings on ${stats.daysWithMeetings} different days`);
```

### Finding Today's Meetings

```javascript
import { meetingService } from '../services/firebaseService';

// Get meetings happening today near user's location
const userLocation = {
  latitude: 40.7128,
  longitude: -74.0060,
};

const todaysMeetings = await meetingService.getTodaysMeetings(userLocation, 15);

// Get recent attendance history
const recentAttendance = await attendanceService.getRecentAttendance(7); // Last 7 days

recentAttendance.forEach(attendance => {
  const type = attendance.meetingType || 'Meeting';
  const location = attendance.location || 'Unknown location';
  console.log(`${type} at ${location} - ${attendance.rating ? attendance.rating + ' stars' : 'No rating'}`);
});
```

### Meeting Data Management

**Note**: The app only reads meeting data - it doesn't create or modify meetings. Meeting data should be populated through:

- **Admin tools** (separate admin interface)
- **Data imports** from existing meeting directories
- **API integrations** with meeting finder services
- **Manual database entry** for initial setup

This ensures meeting data integrity and allows for centralized management across multiple applications.

### Community and Sponsorship Examples

```javascript
import { sponsorshipService, communityService, challengeService } from '../services/firebaseService';

// Sponsorship workflow
// 1. Send sponsor request
await sponsorshipService.sendSponsorRequest('sponsor-user-id', 'Hi, I would like you to be my sponsor');

// 2. Sponsor responds to request
const pendingRequests = await sponsorshipService.getPendingRequests();
await sponsorshipService.respondToSponsorRequest(pendingRequests[0].id, true); // Accept

// 3. Check current relationships
const mySponsees = await sponsorshipService.getCurrentSponsees();
const mySponsor = await sponsorshipService.getCurrentSponsor();

// Community groups
// 1. Search for groups
const localGroups = await communityService.searchGroups({
  type: ['AA', 'NA'],
  privacy: ['public', 'invite-only'],
  searchText: 'downtown',
});

// 2. Join a group
await communityService.joinGroup('group-id-123');

// 3. Get my groups
const myGroups = await communityService.getUserGroups();

// Group challenges and leaderboards
// 1. Create a challenge (group admin/moderator)
const challengeId = await challengeService.createChallenge({
  groupId: 'group-id-123',
  title: '30 Meetings in 30 Days',
  description: 'Attend 30 meetings in 30 days for better recovery',
  type: 'meeting_attendance',
  status: 'upcoming',
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  goals: {
    target: 30,
    unit: 'meetings',
  },
});

// 2. Join the challenge
await challengeService.joinChallenge(challengeId, 'group-id-123');

// 3. Update progress automatically from user data
await challengeService.updateChallengeProgressFromUserData(challengeId);
// Or update manually
await challengeService.updateProgress(challengeId, 15); // 15 meetings attended

// 4. Check leaderboard
const leaderboard = await challengeService.getChallengeLeaderboard(challengeId);
leaderboard.forEach((participant, index) => {
  console.log(`${index + 1}. ${participant.user?.displayName}: ${participant.progress} meetings`);
});

// 5. Get my current challenges
const myChallenges = await challengeService.getUserChallenges('active');
```

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
