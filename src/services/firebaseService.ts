import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  addDoc,
  DocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
  Timestamp,
  writeBatch,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import {
  UserProfile,
  CleanTime,
  Reflection,
  Meeting,
  MeetingAttendance,
  MeetingSearchFilters,
  MeetingSearchResult,
  UserLocation,
  Mood,
  Goal,
  MeditationSession,
  MeditationStats,
  GratitudeEntry,
  SponsorshipRelationship,
  CommunityGroup,
  GroupMembership,
  GroupChallenge,
  ChallengeParticipation,
  UserStats,
  Message,
  Conversation,
  ConversationParticipant,
  MessageReaction,
} from '../types';

// Utility Functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateMeetingStreak(attendance: MeetingAttendance[]): number {
  if (attendance.length === 0) return 0;

  // Sort by date (most recent first)
  const sortedAttendance = attendance.sort((a, b) => {
    const dateA = a.attendanceDate instanceof Date ? a.attendanceDate : new Date((a.attendanceDate as Timestamp).seconds * 1000);
    const dateB = b.attendanceDate instanceof Date ? b.attendanceDate : new Date((b.attendanceDate as Timestamp).seconds * 1000);
    return dateB.getTime() - dateA.getTime();
  });

  // Get unique days
  const uniqueDays = new Set<string>();
  sortedAttendance.forEach(attendance => {
    const date = attendance.attendanceDate instanceof Date
      ? attendance.attendanceDate
      : new Date((attendance.attendanceDate as Timestamp).seconds * 1000);
    uniqueDays.add(date.toDateString());
  });

  const uniqueDaysArray = Array.from(uniqueDays).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const dayString of uniqueDaysArray) {
    const day = new Date(dayString);
    const daysDiff = Math.floor((currentDate.getTime() - day.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }

  return streak;
}

// User Profile Service
export const userService = {
  // Create or update user profile
  async createOrUpdateProfile(userData: Partial<UserProfile>): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  // Get user profile
  async getProfile(): Promise<UserProfile | null> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap: DocumentSnapshot = await getDoc(userRef);

    return userSnap.exists() ? (userSnap.data() as UserProfile) : null;
  },

  // Listen to profile changes
  onProfileChange(callback: (profile: UserProfile | null) => void): Unsubscribe {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const userRef = doc(db, 'users', auth.currentUser.uid);
    return onSnapshot(userRef, (doc: DocumentSnapshot) => {
      callback(doc.exists() ? (doc.data() as UserProfile) : null);
    });
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Clean Time Service
export const cleanTimeService = {
  // Set sobriety date
  async setSobrietyDate(date: Date): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      sobrietyDate: date,
      updatedAt: serverTimestamp(),
    });
  },

  // Get current clean time
  async getCleanTime(): Promise<CleanTime | null> {
    const profile = await userService.getProfile();
    if (!profile?.sobrietyDate) return null;

    const sobrietyDate = profile.sobrietyDate instanceof Date
      ? profile.sobrietyDate
      : new Date((profile.sobrietyDate as Timestamp).seconds * 1000);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - sobrietyDate.getTime());

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Daily Reflections Service
export const reflectionService = {
  // Add a daily reflection
  async addReflection(reflection: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const reflectionRef = collection(db, 'users', auth.currentUser.uid, 'reflections');
    await addDoc(reflectionRef, {
      text: reflection,
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  },

  // Get today's reflection
  async getTodaysReflection(): Promise<Reflection | null> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reflectionRef = collection(db, 'users', auth.currentUser.uid, 'reflections');
    const q = query(
      reflectionRef,
      where('date', '>=', today),
      orderBy('date', 'desc'),
      limit(1),
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as Reflection);
  },

  // Get all reflections
  async getAllReflections(): Promise<Reflection[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const reflectionRef = collection(db, 'users', auth.currentUser.uid, 'reflections');
    const q = query(reflectionRef, orderBy('date', 'desc'));

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reflection));
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Meeting Service (Global meetings collection)
export const meetingService = {
  // Search for meetings based on filters
  async searchMeetings(filters: MeetingSearchFilters): Promise<MeetingSearchResult[]> {
    const meetingRef = collection(db, 'meetings');
    let q = query(meetingRef, where('isActive', '==', true));

    // Add filters
    if (filters.type && filters.type.length > 0) {
      q = query(q, where('type', 'in', filters.type));
    }

    if (filters.format && filters.format.length > 0) {
      q = query(q, where('format', 'in', filters.format));
    }

    if (filters.dayOfWeek && filters.dayOfWeek.length > 0) {
      q = query(q, where('dayOfWeek', 'in', filters.dayOfWeek));
    }

    const querySnapshot: QuerySnapshot = await getDocs(q);
    let meetings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MeetingSearchResult));

    // Filter by location and calculate distance if location provided
    if (filters.location && filters.radius) {
      meetings = meetings.filter(meeting => {
        if (!meeting.location.latitude || !meeting.location.longitude) {
          return false;
        }
        const distance = calculateDistance(
          filters.location!.latitude,
          filters.location!.longitude,
          meeting.location.latitude,
          meeting.location.longitude
        );
        meeting.distance = distance;
        return distance <= filters.radius!;
      });

      // Sort by distance
      meetings.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Filter by time range
    if (filters.timeRange) {
      meetings = meetings.filter(meeting => {
        return meeting.time >= filters.timeRange!.start &&
               meeting.time <= filters.timeRange!.end;
      });
    }

    // Filter by search text
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      meetings = meetings.filter(meeting =>
        meeting.name.toLowerCase().includes(searchLower) ||
        meeting.description?.toLowerCase().includes(searchLower) ||
        meeting.location.name.toLowerCase().includes(searchLower) ||
        meeting.location.address.toLowerCase().includes(searchLower)
      );
    }

    return meetings;
  },

  // Get meeting by ID
  async getMeetingById(meetingId: string): Promise<Meeting | null> {
    const meetingRef = doc(db, 'meetings', meetingId);
    const meetingSnap: DocumentSnapshot = await getDoc(meetingRef);
    return meetingSnap.exists() ? (meetingSnap.data() as Meeting) : null;
  },

  // Get meetings happening today
  async getTodaysMeetings(userLocation?: UserLocation, radius?: number): Promise<MeetingSearchResult[]> {
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday

    const filters: MeetingSearchFilters = {
      dayOfWeek: [today],
      location: userLocation,
      radius: radius,
    };

    return this.searchMeetings(filters);
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Meeting Attendance Service
export const attendanceService = {
  // Log meeting attendance
  async logAttendance(attendanceData: Omit<MeetingAttendance, 'id' | 'userId' | 'attendanceDate' | 'createdAt'>): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const attendanceRef = collection(db, 'users', auth.currentUser.uid, 'attendance');
    await addDoc(attendanceRef, {
      ...attendanceData,
      attendanceDate: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  },

  // Quick log - just log that user attended a meeting today
  async quickLogAttendance(notes?: string): Promise<void> {
    await this.logAttendance({ notes });
  },

  // Get user's attendance history
  async getUserAttendance(startDate?: Date, endDate?: Date, limitCount = 50): Promise<MeetingAttendance[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const attendanceRef = collection(db, 'users', auth.currentUser.uid, 'attendance');
    let q = query(
      attendanceRef,
      orderBy('attendanceDate', 'desc'),
      limit(limitCount)
    );

    if (startDate) {
      q = query(q, where('attendanceDate', '>=', startDate));
    }

    if (endDate) {
      q = query(q, where('attendanceDate', '<=', endDate));
    }

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      userId: auth.currentUser!.uid, // Add userId back since it's not stored in the document
      ...doc.data()
    } as MeetingAttendance));
  },

    // Get attendance stats
  async getAttendanceStats(daysPeriod = 30): Promise<{
    totalMeetings: number;
    meetingsByType: Record<string, number>;
    averageRating: number;
    streakDays: number;
    daysWithMeetings: number;
  }> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (daysPeriod * 24 * 60 * 60 * 1000));

    const attendance = await this.getUserAttendance(startDate, endDate, 1000);

    const totalMeetings = attendance.length;

    // Count meetings by type
    const meetingsByType: Record<string, number> = {};
    attendance.forEach(a => {
      const type = a.meetingType || 'Unknown';
      meetingsByType[type] = (meetingsByType[type] || 0) + 1;
    });

    const ratingsSum = attendance.reduce((sum, a) => sum + (a.rating || 0), 0);
    const ratingsCount = attendance.filter(a => a.rating).length;
    const averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

    // Calculate streak (consecutive days with meetings)
    const streakDays = calculateMeetingStreak(attendance);

    // Count unique days with meetings
    const uniqueDays = new Set<string>();
    attendance.forEach(a => {
      const date = a.attendanceDate instanceof Date
        ? a.attendanceDate
        : new Date((a.attendanceDate as Timestamp).seconds * 1000);
      uniqueDays.add(date.toDateString());
    });
    const daysWithMeetings = uniqueDays.size;

    return {
      totalMeetings,
      meetingsByType,
      averageRating,
      streakDays,
      daysWithMeetings,
    };
  },

    // Get recent attendance for quick overview
  async getRecentAttendance(days = 7): Promise<MeetingAttendance[]> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

    return this.getUserAttendance(startDate, endDate, days * 2); // Allow for multiple meetings per day
  },

  // Check if user attended a meeting today
  async hasAttendedToday(): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysAttendance = await this.getUserAttendance(today, tomorrow, 1);
    return todaysAttendance.length > 0;
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Progress Tracking Service (Updated)
export const progressService = {
  // Log mood entry
  async logMood(moodData: Omit<Mood, 'id' | 'date' | 'createdAt'>): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const moodRef = collection(db, 'users', auth.currentUser.uid, 'moods');
    await addDoc(moodRef, {
      ...moodData,
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  },

  // Get mood entries
  async getMoods(limitCount = 30): Promise<Mood[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const moodRef = collection(db, 'users', auth.currentUser.uid, 'moods');
    const q = query(moodRef, orderBy('date', 'desc'), limit(limitCount));

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mood));
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Goals Service
export const goalsService = {
  // Create a goal
  async createGoal(goalData: Omit<Goal, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const goalRef = collection(db, 'users', auth.currentUser.uid, 'goals');
    await addDoc(goalRef, {
      ...goalData,
      status: 'active' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  // Update goal progress
  async updateGoal(goalId: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const goalRef = doc(db, 'users', auth.currentUser.uid, 'goals', goalId);
    await updateDoc(goalRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  // Get all goals
  async getGoals(): Promise<Goal[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const goalRef = collection(db, 'users', auth.currentUser.uid, 'goals');
    const q = query(goalRef, orderBy('createdAt', 'desc'));

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
  },

  // Delete goal
  async deleteGoal(goalId: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const goalRef = doc(db, 'users', auth.currentUser.uid, 'goals', goalId);
    await deleteDoc(goalRef);
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Meditation Service
export const meditationService = {
  // Log meditation session
  async logSession(sessionData: Omit<MeditationSession, 'id' | 'date' | 'createdAt'>): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const sessionRef = collection(db, 'users', auth.currentUser.uid, 'meditation');
    await addDoc(sessionRef, {
      ...sessionData,
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  },

  // Get meditation stats
  async getStats(): Promise<MeditationStats> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const sessionRef = collection(db, 'users', auth.currentUser.uid, 'meditation');
    const querySnapshot: QuerySnapshot = await getDocs(sessionRef);

    const sessions = querySnapshot.docs.map(doc => doc.data() as MeditationSession);
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);

    return { totalSessions, totalMinutes };
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Gratitude Service
export const gratitudeService = {
  // Add gratitude entry
  async addEntry(entries: string[]): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const gratitudeRef = collection(db, 'users', auth.currentUser.uid, 'gratitude');
    await addDoc(gratitudeRef, {
      entries,
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  },

  // Get recent gratitude entries
  async getEntries(limitCount = 30): Promise<GratitudeEntry[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const gratitudeRef = collection(db, 'users', auth.currentUser.uid, 'gratitude');
    const q = query(gratitudeRef, orderBy('date', 'desc'), limit(limitCount));

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GratitudeEntry));
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Sponsorship Service
export const sponsorshipService = {
  // Send sponsor request
  async sendSponsorRequest(sponsorId: string, notes?: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const relationshipRef = collection(db, 'sponsorships');
    await addDoc(relationshipRef, {
      sponsorId,
      sponseeId: auth.currentUser.uid,
      status: 'pending',
      startDate: serverTimestamp(),
      notes,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  // Respond to sponsor request
  async respondToSponsorRequest(relationshipId: string, accept: boolean): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const relationshipRef = doc(db, 'sponsorships', relationshipId);
    await updateDoc(relationshipRef, {
      status: accept ? 'active' : 'cancelled',
      updatedAt: serverTimestamp(),
    });
  },

  // Get current sponsor
  async getCurrentSponsor(): Promise<SponsorshipRelationship | null> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const relationshipRef = collection(db, 'sponsorships');
    const q = query(
      relationshipRef,
      where('sponseeId', '==', auth.currentUser.uid),
      where('status', '==', 'active'),
      limit(1)
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as SponsorshipRelationship);
  },

  // Get current sponsees
  async getCurrentSponsees(): Promise<SponsorshipRelationship[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const relationshipRef = collection(db, 'sponsorships');
    const q = query(
      relationshipRef,
      where('sponsorId', '==', auth.currentUser.uid),
      where('status', '==', 'active')
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SponsorshipRelationship));
  },

  // Get pending sponsor requests (for sponsors)
  async getPendingRequests(): Promise<SponsorshipRelationship[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const relationshipRef = collection(db, 'sponsorships');
    const q = query(
      relationshipRef,
      where('sponsorId', '==', auth.currentUser.uid),
      where('status', '==', 'pending')
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SponsorshipRelationship));
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Community Groups Service
export const communityService = {
  // Create a community group
  async createGroup(groupData: Omit<CommunityGroup, 'id' | 'adminIds' | 'memberCount' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const groupRef = collection(db, 'groups');
    const docRef = await addDoc(groupRef, {
      ...groupData,
      adminIds: [auth.currentUser.uid],
      memberCount: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Add creator as first member
    await this.joinGroup(docRef.id, 'admin');

    return docRef.id;
  },

  // Search for groups
  async searchGroups(filters: {
    type?: CommunityGroup['type'][];
    location?: string;
    privacy?: CommunityGroup['privacy'][];
    searchText?: string;
  }): Promise<CommunityGroup[]> {
    const groupRef = collection(db, 'groups');
    let q = query(groupRef, where('isActive', '==', true));

    if (filters.type && filters.type.length > 0) {
      q = query(q, where('type', 'in', filters.type));
    }

    if (filters.privacy && filters.privacy.length > 0) {
      q = query(q, where('privacy', 'in', filters.privacy));
    }

    const querySnapshot: QuerySnapshot = await getDocs(q);
    let groups = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CommunityGroup));

    // Filter by search text (client-side)
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      groups = groups.filter(group =>
        group.name.toLowerCase().includes(searchLower) ||
        group.description.toLowerCase().includes(searchLower)
      );
    }

    return groups;
  },

  // Join a group
  async joinGroup(groupId: string, role: GroupMembership['role'] = 'member'): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const membershipRef = collection(db, 'group_memberships');
    await addDoc(membershipRef, {
      groupId,
      userId: auth.currentUser.uid,
      role,
      status: 'active',
      joinedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    // Update group member count
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    if (groupSnap.exists()) {
      const currentCount = groupSnap.data().memberCount || 0;
      await updateDoc(groupRef, {
        memberCount: currentCount + 1,
        updatedAt: serverTimestamp(),
      });
    }
  },

  // Get user's groups
  async getUserGroups(): Promise<Array<GroupMembership & { group: CommunityGroup }>> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const membershipRef = collection(db, 'group_memberships');
    const q = query(
      membershipRef,
      where('userId', '==', auth.currentUser.uid),
      where('status', '==', 'active')
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);
    const memberships = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GroupMembership));

    // Fetch group details
    const groupPromises = memberships.map(async (membership) => {
      const groupRef = doc(db, 'groups', membership.groupId);
      const groupSnap = await getDoc(groupRef);
      return {
        ...membership,
        group: groupSnap.exists() ? (groupSnap.data() as CommunityGroup) : null,
      };
    });

    const results = await Promise.all(groupPromises);
    return results.filter(result => result.group !== null) as Array<GroupMembership & { group: CommunityGroup }>;
  },

  // Get group members
  async getGroupMembers(groupId: string): Promise<Array<GroupMembership & { user?: UserProfile }>> {
    const membershipRef = collection(db, 'group_memberships');
    const q = query(
      membershipRef,
      where('groupId', '==', groupId),
      where('status', '==', 'active')
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);
    const memberships = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GroupMembership));

    // Optionally fetch user profiles (with privacy considerations)
    const userPromises = memberships.map(async (membership) => {
      const userRef = doc(db, 'users', membership.userId);
      const userSnap = await getDoc(userRef);
      return {
        ...membership,
        user: userSnap.exists() ? (userSnap.data() as UserProfile) : undefined,
      };
    });

    return Promise.all(userPromises);
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';

// Group Challenges Service
export const challengeService = {
  // Create a group challenge
  async createChallenge(challengeData: Omit<GroupChallenge, 'id' | 'createdBy' | 'participants' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const challengeRef = collection(db, 'group_challenges');
    const docRef = await addDoc(challengeRef, {
      ...challengeData,
      createdBy: auth.currentUser.uid,
      participants: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  // Join a challenge
  async joinChallenge(challengeId: string, groupId: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const participationRef = collection(db, 'challenge_participations');
    await addDoc(participationRef, {
      challengeId,
      userId: auth.currentUser.uid,
      groupId,
      status: 'joined',
      progress: 0,
      joinedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    // Update challenge participant count
    const challengeRef = doc(db, 'group_challenges', challengeId);
    const challengeSnap = await getDoc(challengeRef);
    if (challengeSnap.exists()) {
      const currentCount = challengeSnap.data().participants || 0;
      await updateDoc(challengeRef, {
        participants: currentCount + 1,
        updatedAt: serverTimestamp(),
      });
    }
  },

  // Get group challenges
  async getGroupChallenges(groupId: string, status?: GroupChallenge['status']): Promise<GroupChallenge[]> {
    const challengeRef = collection(db, 'group_challenges');
    let q = query(challengeRef, where('groupId', '==', groupId));

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupChallenge));
  },

  // Get user's challenge participation
  async getUserChallenges(status?: ChallengeParticipation['status']): Promise<Array<ChallengeParticipation & { challenge?: GroupChallenge }>> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const participationRef = collection(db, 'challenge_participations');
    let q = query(participationRef, where('userId', '==', auth.currentUser.uid));

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const querySnapshot: QuerySnapshot = await getDocs(q);
    const participations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChallengeParticipation));

    // Fetch challenge details
    const challengePromises = participations.map(async (participation) => {
      const challengeRef = doc(db, 'group_challenges', participation.challengeId);
      const challengeSnap = await getDoc(challengeRef);
      return {
        ...participation,
        challenge: challengeSnap.exists() ? (challengeSnap.data() as GroupChallenge) : undefined,
      };
    });

    return Promise.all(challengePromises);
  },

  // Update challenge progress
  async updateProgress(challengeId: string, progress: number): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const participationRef = collection(db, 'challenge_participations');
    const q = query(
      participationRef,
      where('challengeId', '==', challengeId),
      where('userId', '==', auth.currentUser.uid),
      limit(1)
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const participationDoc = querySnapshot.docs[0];
      await updateDoc(participationDoc.ref, {
        progress,
        status: 'active',
      });
    }
  },

  // Calculate and update challenge progress automatically based on challenge type
  async updateChallengeProgressFromUserData(challengeId: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    // Get challenge details
    const challengeRef = doc(db, 'group_challenges', challengeId);
    const challengeSnap = await getDoc(challengeRef);

    if (!challengeSnap.exists()) return;

    const challenge = challengeSnap.data() as GroupChallenge;
    const startDate = challenge.startDate instanceof Date
      ? challenge.startDate
      : new Date((challenge.startDate as Timestamp).seconds * 1000);
    const endDate = challenge.endDate instanceof Date
      ? challenge.endDate
      : new Date((challenge.endDate as Timestamp).seconds * 1000);

    let progress = 0;

    // Calculate progress based on challenge type
    switch (challenge.type) {
      case 'meeting_attendance':
        const attendance = await attendanceService.getUserAttendance(startDate, endDate, 1000);
        progress = attendance.length;
        break;

      case 'clean_time':
        const cleanTime = await cleanTimeService.getCleanTime();
        progress = cleanTime ? cleanTime.days : 0;
        break;

      case 'meditation':
        // Get meditation sessions in date range
        const meditationRef = collection(db, 'users', auth.currentUser.uid, 'meditation');
        const meditationQuery = query(
          meditationRef,
          where('date', '>=', startDate),
          where('date', '<=', endDate)
        );
        const meditationSnap = await getDocs(meditationQuery);
        progress = meditationSnap.docs.reduce((total, doc) => {
          const session = doc.data() as MeditationSession;
          return total + (session.duration || 0);
        }, 0);
        break;

      case 'gratitude':
        // Get gratitude entries in date range
        const gratitudeRef = collection(db, 'users', auth.currentUser.uid, 'gratitude');
        const gratitudeQuery = query(
          gratitudeRef,
          where('date', '>=', startDate),
          where('date', '<=', endDate)
        );
        const gratitudeSnap = await getDocs(gratitudeQuery);
        progress = gratitudeSnap.size;
        break;
    }

    // Update the progress
    await this.updateProgress(challengeId, progress);
  },

  // Get challenge leaderboard
  async getChallengeLeaderboard(challengeId: string): Promise<Array<ChallengeParticipation & { user?: UserProfile }>> {
    const participationRef = collection(db, 'challenge_participations');
    const q = query(
      participationRef,
      where('challengeId', '==', challengeId),
      orderBy('progress', 'desc'),
      limit(50)
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);
    const participations = querySnapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      ...doc.data()
    } as ChallengeParticipation));

    // Fetch user profiles for display (respecting privacy settings)
    const userPromises = participations.map(async (participation) => {
      const userRef = doc(db, 'users', participation.userId);
      const userSnap = await getDoc(userRef);
      const user = userSnap.exists() ? (userSnap.data() as UserProfile) : undefined;

      // Respect privacy settings
      if (user && !user.privacy?.showInLeaderboards) {
        return {
          ...participation,
          user: { ...user, displayName: 'Anonymous User' },
        };
      }

      return {
        ...participation,
        user,
      };
    });

    return Promise.all(userPromises);
  },
};

// Export messaging service from separate file
export { messagingService } from './messagingService';
