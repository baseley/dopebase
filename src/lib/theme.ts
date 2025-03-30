// Comprehensive theme system for the entire admin dashboard
export const theme = {
  // Color system
  colors: {
    // Base colors
    background: "#ffffff",
    foreground: "#121212",

    // UI Elements
    surface: {
      primary: "#ffffff",
      secondary: "#f8f8f8",
      tertiary: "#f0f0f0",
    },

    // Text colors
    text: {
      primary: "#121212",
      secondary: "#505050",
      tertiary: "#707070",
      disabled: "#a0a0a0",
    },

    // Border colors
    border: {
      light: "#e0e0e0",
      medium: "#d0d0d0",
      focus: "#8a2be2",
    },

    // Accent colors - purple theme
    accent: {
      primary: "#8a2be2", // Vibrant purple
      secondary: "#9d4edd",
      tertiary: "#7209b7",
      hover: "#b14aed",
      muted: "rgba(138, 43, 226, 0.15)",
    },

    // States
    state: {
      hover: "#f5f5f5",
      active: "#eeeeee",
      selected: "rgba(138, 43, 226, 0.1)",
    },

    // Feedback
    feedback: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },

  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing system
  spacing: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
  },

  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },

  // Transitions
  transitions: {
    fast: "all 0.15s ease",
    normal: "all 0.25s ease",
    slow: "all 0.35s ease",
    expand: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Z-index
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: "auto",
  },

  // Component specific
  sidebar: {
    width: "280px", // Increased width for better readability
    collapsedWidth: "64px",
    menuItemPadding: "12px 16px", // Increased padding for better touch targets
    submenuPadding: "10px 16px 10px 46px", // Adjusted for better alignment
    iconGap: "16px", // Increased for better spacing
  },

  content: {
    padding: "24px",
    maxWidth: "1600px",
    cardPadding: "24px",
    headerHeight: "64px",
  },

  table: {
    headerBg: "#f8f8f8",
    rowBg: "#ffffff",
    rowHoverBg: "#f5f5f5",
    borderColor: "#e0e0e0",
    cellPadding: "12px 16px",
  },

  buttons: {
    primary: {
      bg: "#8a2be2",
      text: "#ffffff",
      hoverBg: "#9d4edd",
      activeBg: "#7209b7",
    },
    secondary: {
      bg: "#f0f0f0",
      text: "#121212",
      hoverBg: "#e0e0e0",
      activeBg: "#d0d0d0",
    },
    danger: {
      bg: "#ef4444",
      text: "#ffffff",
      hoverBg: "#dc2626",
      activeBg: "#b91c1c",
    },
  },

  // Form styles
  forms: {
    input: {
      height: "44px", // Increased height for better touch targets
      padding: "0 16px",
      fontSize: "0.875rem",
      borderRadius: "0.375rem",
      borderColor: "#e0e0e0",
      focusBorderColor: "#8a2be2",
      backgroundColor: "#f0f0f0",
      color: "#121212",
      placeholderColor: "#a0a0a0",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#121212",
      marginBottom: "0.5rem",
    },
    error: {
      color: "#ef4444",
      fontSize: "0.75rem",
      marginTop: "0.25rem",
    },
    card: {
      padding: "24px",
      borderRadius: "0.5rem",
      backgroundColor: "#ffffff",
      borderColor: "#e0e0e0",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
  },
}

