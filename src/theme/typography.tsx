// Typography system for relaxed, readable text
export const typography = {
  // Font families
  fonts: {
    primary: 'System', // Will use system font for consistency
    secondary: 'System',
    mono: 'Courier New',
  },

  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  // Line heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },

  // Text styles for common use cases
  styles: {
    // Headers
    h1: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 1.25,
      letterSpacing: -0.025,
    },
    h2: {
      fontSize: 30,
      fontWeight: '600',
      lineHeight: 1.25,
      letterSpacing: -0.025,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.25,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 1.25,
    },
    h5: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 1.25,
    },
    h6: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.25,
    },

    // Body text
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
    },

    // Special text styles
    subtitle1: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.25,
    },
    overline: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 1.25,
      letterSpacing: 0.1,
      textTransform: 'uppercase',
    },

    // Button text
    button: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.25,
      letterSpacing: 0.025,
    },

    // Special recovery-themed text styles
    affirmation: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 1.625,
      letterSpacing: 0.025,
      fontStyle: 'italic',
    },
    counter: {
      fontSize: 48,
      fontWeight: '700',
      lineHeight: 1,
      letterSpacing: -0.025,
    },
    milestone: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.25,
      letterSpacing: 0.025,
    },
  },
};

export default typography;