import colors from './colors';
import typography from './typography';

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

// Border radius for soft, friendly edges
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadows for depth
export const shadows = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
};

// Complete theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,

  // Component-specific styles
  components: {
    card: {
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.md,
    },
    button: {
      primary: {
        backgroundColor: colors.primary[500],
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      },
      secondary: {
        backgroundColor: colors.secondary[500],
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      },
    },
    input: {
      backgroundColor: colors.background.secondary,
      borderColor: colors.neutral[300],
      borderWidth: 1,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
  },
};

export { colors, typography };
export default theme;