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
  type: string;
  location: string;
  notes?: string;
  date: Date | FirebaseTimestamp;
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
