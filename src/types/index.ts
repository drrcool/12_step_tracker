// User types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface UserProfile {
  email: string;
  displayName: string;
  sobrietyDate?: Date | FirebaseTimestamp;
  avatar?: string; // URL to profile picture
  bio?: string;
  location?: UserLocation;
  privacy: {
    showCleanTime: boolean;
    showInLeaderboards: boolean;
    allowSponsorRequests: boolean;
    showToGroups: boolean;
  };
  preferences: {
    notificationSettings: {
      challengeReminders: boolean;
      sponsorMessages: boolean;
      groupUpdates: boolean;
    };
  };
  createdAt: Date | FirebaseTimestamp;
  updatedAt: Date | FirebaseTimestamp;
}

// Firebase Timestamp type
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Clean Time types
export interface CleanTime {
  days: number;
  hours: number;
  minutes: number;
}

// Reflection types
export interface Reflection {
  id?: string;
  text: string;
  date: Date | FirebaseTimestamp;
  createdAt: Date | FirebaseTimestamp;
}

// Meeting types
export interface Meeting {
  id?: string;
  name: string;
  description?: string;
  type: 'AA' | 'NA' | 'CA' | 'Al-Anon' | 'Other';
  format: 'In-Person' | 'Online' | 'Hybrid';
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
  time: string; // e.g., "19:00" for 7:00 PM
  duration: number; // in minutes
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  specialNotes?: string;
  isActive: boolean;
  createdAt: Date | FirebaseTimestamp;
  updatedAt: Date | FirebaseTimestamp;
}

// User meeting attendance
export interface MeetingAttendance {
  id?: string;
  userId: string;
  attendanceDate: Date | FirebaseTimestamp;
  meetingType?: 'AA' | 'NA' | 'CA' | 'Al-Anon' | 'Other';
  meetingFormat?: 'In-Person' | 'Online' | 'Hybrid';
  location?: string; // Optional free-text location (e.g., "Downtown Community Center")
  notes?: string;
  rating?: number; // 1-5 star rating of the meeting experience
  createdAt: Date | FirebaseTimestamp;
}

// Mood types
export interface Mood {
  id?: string;
  mood: number; // 1-10 scale
  notes?: string;
  date: Date | FirebaseTimestamp;
  createdAt: Date | FirebaseTimestamp;
}

// Goal types
export interface Goal {
  id?: string;
  title: string;
  description: string;
  targetDate?: Date | FirebaseTimestamp;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number; // 0-100 percentage
  createdAt: Date | FirebaseTimestamp;
  updatedAt: Date | FirebaseTimestamp;
}

// Meditation types
export interface MeditationSession {
  id?: string;
  duration: number; // in minutes
  type: string;
  notes?: string;
  date: Date | FirebaseTimestamp;
  createdAt: Date | FirebaseTimestamp;
}

export interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
}

// Gratitude types
export interface GratitudeEntry {
  id?: string;
  entries: string[];
  date: Date | FirebaseTimestamp;
  createdAt: Date | FirebaseTimestamp;
}

// Community and sponsorship types
export interface SponsorshipRelationship {
  id?: string;
  sponsorId: string;
  sponseeId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: Date | FirebaseTimestamp;
  endDate?: Date | FirebaseTimestamp;
  notes?: string;
  createdAt: Date | FirebaseTimestamp;
  updatedAt: Date | FirebaseTimestamp;
}

export interface CommunityGroup {
  id?: string;
  name: string;
  description: string;
  type: 'AA' | 'NA' | 'CA' | 'Al-Anon' | 'General' | 'Other';
  privacy: 'public' | 'private' | 'invite-only';
  location?: {
    city?: string;
    state?: string;
    region?: string;
  };
  adminIds: string[];
  memberCount: number;
  isActive: boolean;
  settings: {
    allowChallenges: boolean;
    allowLeaderboards: boolean;
    requireApproval: boolean;
  };
  createdAt: Date | FirebaseTimestamp;
  updatedAt: Date | FirebaseTimestamp;
}

export interface GroupMembership {
  id?: string;
  groupId: string;
  userId: string;
  role: 'member' | 'moderator' | 'admin';
  status: 'pending' | 'active' | 'suspended';
  joinedAt: Date | FirebaseTimestamp;
  permissions?: string[];
  createdAt: Date | FirebaseTimestamp;
}

export interface GroupChallenge {
  id?: string;
  groupId: string;
  createdBy: string;
  title: string;
  description: string;
  type: 'meeting_attendance' | 'clean_time' | 'meditation' | 'gratitude' | 'custom';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startDate: Date | FirebaseTimestamp;
  endDate: Date | FirebaseTimestamp;
  goals: {
    target: number;
    unit: string; // 'meetings', 'days', 'minutes', 'entries'
  };
  participants: number;
  rewards?: string[];
  createdAt: Date | FirebaseTimestamp;
  updatedAt: Date | FirebaseTimestamp;
}

export interface ChallengeParticipation {
  id?: string;
  challengeId: string;
  userId: string;
  groupId: string;
  status: 'joined' | 'active' | 'completed' | 'dropped';
  progress: number;
  rank?: number;
  joinedAt: Date | FirebaseTimestamp;
  completedAt?: Date | FirebaseTimestamp;
  createdAt: Date | FirebaseTimestamp;
}

export interface UserStats {
  userId: string;
  groupId?: string; // If group-specific stats
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  stats: {
    meetingsAttended: number;
    cleanDays: number;
    meditationMinutes: number;
    gratitudeEntries: number;
    challengesCompleted: number;
    currentStreak: number;
    longestStreak: number;
  };
  lastCalculated: Date | FirebaseTimestamp;
}

// Messaging Types
export interface Message {
  id?: string;
  senderId: string;
  recipientId?: string; // For direct messages
  groupId?: string; // For group messages
  content: string;
  type: 'text' | 'image' | 'system';
  status: 'sent' | 'delivered' | 'read';
  replyToMessageId?: string; // For threaded replies
  isEdited?: boolean;
  editedAt?: Date | FirebaseTimestamp;
  createdAt: Date | FirebaseTimestamp;
  updatedAt: Date | FirebaseTimestamp;
}

export interface Conversation {
  id?: string;
  type: 'direct' | 'group' | 'sponsor';
  participantIds: string[];
  groupId?: string; // If this is a group conversation
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Date | FirebaseTimestamp;
    type: Message['type'];
  };
  lastActivity: Date | FirebaseTimestamp;
  isActive: boolean;
  metadata?: {
    title?: string; // Custom conversation title
    description?: string;
    isAnonymous?: boolean; // For anonymous support conversations
  };
  createdAt: Date | FirebaseTimestamp;
  updatedAt: Date | FirebaseTimestamp;
}

export interface ConversationParticipant {
  id?: string;
  conversationId: string;
  userId: string;
  role: 'participant' | 'moderator' | 'admin';
  joinedAt: Date | FirebaseTimestamp;
  lastReadAt?: Date | FirebaseTimestamp;
  notificationsEnabled: boolean;
  status: 'active' | 'muted' | 'blocked';
  permissions?: string[];
}

export interface MessageReaction {
  id?: string;
  messageId: string;
  userId: string;
  reaction: string; // emoji or reaction type
  createdAt: Date | FirebaseTimestamp;
}

// Location and search types
export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface MeetingSearchFilters {
  location?: UserLocation;
  radius?: number; // in miles
  type?: Meeting['type'][];
  format?: Meeting['format'][];
  dayOfWeek?: number[];
  timeRange?: {
    start: string; // e.g., "18:00"
    end: string;   // e.g., "20:00"
  };
  searchText?: string;
}

export interface MeetingSearchResult extends Meeting {
  distance?: number; // distance from user in miles
  nextMeetingDate?: Date;
}

// Theme types
export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  recovery: {
    serenity: string;
    gratitude: string;
    progress: string;
    meditation: string;
    community: string;
  };
  background: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
    inverse: string;
  };
  error?: string;
  success?: string;
  warning?: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
}

// Component prop types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

export interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  icon?: string;
  style?: any;
}

export interface CardProps {
  children: React.ReactNode;
  style?: any;
}

// Navigation types
export type RootTabParamList = {
  Home: undefined;
  Progress: undefined;
  Community: undefined;
  Sponsor: undefined;
  Principles: undefined;
  Literature: undefined;
};

// Auth context types
export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}
