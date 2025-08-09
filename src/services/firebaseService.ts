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
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import {
  UserProfile,
  CleanTime,
  Reflection,
  Meeting,
  Mood,
  Goal,
  MeditationSession,
  MeditationStats,
  GratitudeEntry,
} from '../types';

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

// Progress Tracking Service
export const progressService = {
  // Log meeting attendance
  async logMeeting(meetingData: Omit<Meeting, 'id' | 'date' | 'createdAt'>): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const meetingRef = collection(db, 'users', auth.currentUser.uid, 'meetings');
    await addDoc(meetingRef, {
      ...meetingData,
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  },

  // Get meetings for date range
  async getMeetings(startDate: Date, endDate: Date): Promise<Meeting[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const meetingRef = collection(db, 'users', auth.currentUser.uid, 'meetings');
    const q = query(
      meetingRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc'),
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meeting));
  },

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
