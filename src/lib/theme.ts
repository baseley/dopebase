import type React from "react"

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

  // List view styles (new section)
  listView: {
    // Card styles
    card: {
      backgroundColor: "#f8f8f8",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      overflow: "hidden",
      border: "1px solid #e0e0e0",
      maxWidth: "1600px",
      margin: "0 auto",
    } as React.CSSProperties,

    cardHeader: {
      padding: "1.5rem",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    } as React.CSSProperties,

    cardBody: {
      padding: "1.5rem",
    } as React.CSSProperties,

    title: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#121212",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    } as React.CSSProperties,

    // Table styles
    table: {
      width: "100%",
      borderCollapse: "collapse",
      borderSpacing: 0,
    } as React.CSSProperties,

    tableHeader: {
      backgroundColor: "#f0f0f0",
      color: "#505050",
      fontSize: "0.875rem",
      fontWeight: 600,
      textAlign: "left",
      padding: "12px 16px",
      borderBottom: "1px solid #e0e0e0",
    } as React.CSSProperties,

    tableCell: {
      padding: "12px 16px",
      borderBottom: "1px solid #e0e0e0",
      color: "#121212",
      fontSize: "0.875rem",
    } as React.CSSProperties,

    // Search input
    searchContainer: {
      position: "relative",
      marginBottom: "1rem",
    } as React.CSSProperties,

    searchInput: {
      width: "100%",
      padding: "10px 16px",
      paddingRight: "40px",
      backgroundColor: "#f0f0f0",
      border: "1px solid #e0e0e0",
      borderRadius: "0.375rem",
      color: "#121212",
      fontSize: "0.875rem",
      outline: "none",
      transition: "all 0.25s ease",
    } as React.CSSProperties,

    searchIcon: {
      position: "absolute",
      right: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#505050",
    } as React.CSSProperties,

    // Pagination
    pagination: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: "1rem",
      gap: "0.5rem",
    } as React.CSSProperties,

    paginationButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      backgroundColor: "#f0f0f0",
      color: "#121212",
      borderRadius: "0.375rem",
      transition: "all 0.25s ease",
      cursor: "pointer",
      border: "none",
    } as React.CSSProperties,

    paginationText: {
      color: "#505050",
      fontSize: "0.875rem",
      margin: "0 0.5rem",
    } as React.CSSProperties,

    // Loading and empty states
    loadingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      padding: "1.5rem",
    } as React.CSSProperties,

    loadingSpinner: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      border: "2px solid #8a2be2",
      borderTopColor: "transparent",
      animation: "spin 1s linear infinite",
    } as React.CSSProperties,

    emptyContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.75rem",
      padding: "1.5rem",
    } as React.CSSProperties,

    emptyIconContainer: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "0.5rem",
    } as React.CSSProperties,

    emptyTitle: {
      fontSize: "1.125rem",
      fontWeight: 500,
    } as React.CSSProperties,

    emptyMessage: {
      color: "#505050",
      maxWidth: "400px",
      textAlign: "center",
    } as React.CSSProperties,

    // Action buttons
    actionButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 12px",
      borderRadius: "0.375rem",
      transition: "all 0.25s ease",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
      border: "none",
    } as React.CSSProperties,

    iconButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      borderRadius: "0.375rem",
      transition: "all 0.25s ease",
      marginRight: "0.5rem",
    } as React.CSSProperties,

    // Tabs
    tab: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 16px",
      borderRadius: "0.375rem",
      transition: "all 0.25s ease",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: 500,
      marginRight: "0.5rem",
    } as React.CSSProperties,

    // Cell styles
    idCell: {
      fontFamily: "monospace",
      fontSize: "0.75rem",
      color: "#505050",
    } as React.CSSProperties,

    nameCell: {
      fontWeight: 500,
    } as React.CSSProperties,

    descriptionCell: {
      maxWidth: "400px",
      fontSize: "0.875rem",
      color: "#505050",
    } as React.CSSProperties,

    versionCell: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "0.375rem",
      border: "1px solid #e0e0e0",
      fontSize: "0.75rem",
      fontFamily: "monospace",
    } as React.CSSProperties,

    // Status indicators
    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      fontWeight: 500,
    } as React.CSSProperties,

    // Icon styles
    iconStyle: {
      marginRight: "8px",
    } as React.CSSProperties,
  },
}

// Helper function to create CSS variables from theme
export const createCssVariables = () => {
  const cssVars: Record<string, string> = {
    "--font-family": theme.typography.fontFamily,

    // Colors
    "--color-background": theme.colors.background,
    "--color-foreground": theme.colors.foreground,

    // Surface colors
    "--color-surface-primary": theme.colors.surface.primary,
    "--color-surface-secondary": theme.colors.surface.secondary,
    "--color-surface-tertiary": theme.colors.surface.tertiary,

    // Text colors
    "--color-text-primary": theme.colors.text.primary,
    "--color-text-secondary": theme.colors.text.secondary,
    "--color-text-tertiary": theme.colors.text.tertiary,
    "--color-text-disabled": theme.colors.text.disabled,

    // Border colors
    "--color-border-light": theme.colors.border.light,
    "--color-border-medium": theme.colors.border.medium,
    "--color-border-focus": theme.colors.border.focus,

    // Accent colors
    "--color-accent-primary": theme.colors.accent.primary,
    "--color-accent-secondary": theme.colors.accent.secondary,
    "--color-accent-tertiary": theme.colors.accent.tertiary,
    "--color-accent-hover": theme.colors.accent.hover,
    "--color-accent-muted": theme.colors.accent.muted,

    // State colors
    "--color-state-hover": theme.colors.state.hover,
    "--color-state-active": theme.colors.state.active,
    "--color-state-selected": theme.colors.state.selected,

    // Feedback colors
    "--color-feedback-success": theme.colors.feedback.success,
    "--color-feedback-warning": theme.colors.feedback.warning,
    "--color-feedback-error": theme.colors.feedback.error,
    "--color-feedback-info": theme.colors.feedback.info,

    // Typography
    "--font-size-xs": theme.typography.fontSizes.xs,
    "--font-size-sm": theme.typography.fontSizes.sm,
    "--font-size-md": theme.typography.fontSizes.md,
    "--font-size-lg": theme.typography.fontSizes.lg,
    "--font-size-xl": theme.typography.fontSizes.xl,
    "--font-size-2xl": theme.typography.fontSizes["2xl"],
    "--font-size-3xl": theme.typography.fontSizes["3xl"],

    "--font-weight-normal": theme.typography.fontWeights.normal.toString(),
    "--font-weight-medium": theme.typography.fontWeights.medium.toString(),
    "--font-weight-semibold": theme.typography.fontWeights.semibold.toString(),
    "--font-weight-bold": theme.typography.fontWeights.bold.toString(),

    "--line-height-tight": theme.typography.lineHeights.tight.toString(),
    "--line-height-normal": theme.typography.lineHeights.normal.toString(),
    "--line-height-relaxed": theme.typography.lineHeights.relaxed.toString(),

    // Spacing
    "--spacing-0": theme.spacing[0],
    "--spacing-1": theme.spacing[1],
    "--spacing-2": theme.spacing[2],
    "--spacing-3": theme.spacing[3],
    "--spacing-4": theme.spacing[4],
    "--spacing-5": theme.spacing[5],
    "--spacing-6": theme.spacing[6],
    "--spacing-8": theme.spacing[8],
    "--spacing-10": theme.spacing[10],
    "--spacing-12": theme.spacing[12],
    "--spacing-16": theme.spacing[16],
    "--spacing-20": theme.spacing[20],
    "--spacing-24": theme.spacing[24],

    // Border radius
    "--radius-none": theme.borderRadius.none,
    "--radius-sm": theme.borderRadius.sm,
    "--radius-md": theme.borderRadius.md,
    "--radius-lg": theme.borderRadius.lg,
    "--radius-xl": theme.borderRadius.xl,
    "--radius-2xl": theme.borderRadius["2xl"],
    "--radius-full": theme.borderRadius.full,

    // Shadows
    "--shadow-sm": theme.shadows.sm,
    "--shadow-md": theme.shadows.md,
    "--shadow-lg": theme.shadows.lg,
    "--shadow-xl": theme.shadows.xl,
    "--shadow-inner": theme.shadows.inner,

    // Transitions
    "--transition-fast": theme.transitions.fast,
    "--transition-normal": theme.transitions.normal,
    "--transition-slow": theme.transitions.slow,
    "--transition-expand": theme.transitions.expand,

    // Z-index
    "--z-0": theme.zIndex[0].toString(),
    "--z-10": theme.zIndex[10].toString(),
    "--z-20": theme.zIndex[20].toString(),
    "--z-30": theme.zIndex[30].toString(),
    "--z-40": theme.zIndex[40].toString(),
    "--z-50": theme.zIndex[50].toString(),
    "--z-auto": theme.zIndex.auto.toString(),

    // Component specific
    "--sidebar-width": theme.sidebar.width,
    "--sidebar-collapsed-width": theme.sidebar.collapsedWidth,
    "--sidebar-menu-item-padding": theme.sidebar.menuItemPadding,
    "--sidebar-submenu-padding": theme.sidebar.submenuPadding,
    "--sidebar-icon-gap": theme.sidebar.iconGap,

    "--content-padding": theme.content.padding,
    "--content-max-width": theme.content.maxWidth,
    "--content-card-padding": theme.content.cardPadding,
    "--content-header-height": theme.content.headerHeight,

    // Form styles
    "--form-input-height": theme.forms.input.height,
    "--form-input-padding": theme.forms.input.padding,
    "--form-input-font-size": theme.forms.input.fontSize,
    "--form-input-border-radius": theme.forms.input.borderRadius,
    "--form-input-border-color": theme.forms.input.borderColor,
    "--form-input-focus-border-color": theme.forms.input.focusBorderColor,
    "--form-input-background-color": theme.forms.input.backgroundColor,
    "--form-input-color": theme.forms.input.color,
    "--form-input-placeholder-color": theme.forms.input.placeholderColor,

    "--form-label-font-size": theme.forms.label.fontSize,
    "--form-label-font-weight": theme.forms.label.fontWeight.toString(),
    "--form-label-color": theme.forms.label.color,
    "--form-label-margin-bottom": theme.forms.label.marginBottom,

    "--form-error-color": theme.forms.error.color,
    "--form-error-font-size": theme.forms.error.fontSize,
    "--form-error-margin-top": theme.forms.error.marginTop,

    "--form-card-padding": theme.forms.card.padding,
    "--form-card-border-radius": theme.forms.card.borderRadius,
    "--form-card-background-color": theme.forms.card.backgroundColor,
    "--form-card-border-color": theme.forms.card.borderColor,
    "--form-card-shadow": theme.forms.card.shadow,
  }

  return cssVars
}

// Helper function to apply theme styles to an element
export const applyThemeStyles = (element: HTMLElement) => {
  const cssVars = createCssVariables()
  Object.entries(cssVars).forEach(([key, value]) => {
    element.style.setProperty(key, value)
  })
}

// Custom styled components using the theme
export const styledComponents = {
  // Form elements
  formCard: {
    backgroundColor: theme.forms.card.backgroundColor,
    borderRadius: theme.forms.card.borderRadius,
    boxShadow: theme.forms.card.shadow,
    border: `1px solid ${theme.forms.card.borderColor}`,
    padding: theme.forms.card.padding,
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  } as React.CSSProperties,

  formHeader: {
    borderBottom: `1px solid ${theme.colors.border.light}`,
    padding: `0 0 ${theme.spacing[4]} 0`,
    marginBottom: theme.spacing[6],
  } as React.CSSProperties,

  formTitle: {
    fontSize: theme.typography.fontSizes["2xl"],
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing[2],
  } as React.CSSProperties,

  formContent: {
    padding: `${theme.spacing[4]} 0`,
  } as React.CSSProperties,

  formGroup: {
    marginBottom: theme.spacing[6],
  } as React.CSSProperties,

  formLabel: {
    fontSize: theme.forms.label.fontSize,
    fontWeight: theme.forms.label.fontWeight,
    color: theme.forms.label.color,
    marginBottom: theme.forms.label.marginBottom,
    display: "block",
  } as React.CSSProperties,

  formInput: {
    height: theme.forms.input.height,
    padding: theme.forms.input.padding,
    fontSize: theme.forms.input.fontSize,
    borderRadius: theme.forms.input.borderRadius,
    border: `1px solid ${theme.forms.input.borderColor}`,
    backgroundColor: theme.forms.input.backgroundColor,
    color: theme.forms.input.color,
    width: "100%",
    transition: theme.transitions.normal,
    outline: "none",
    "&:focus": {
      borderColor: theme.forms.input.focusBorderColor,
      boxShadow: `0 0 0 2px ${theme.colors.accent.muted}`,
    },
    "&::placeholder": {
      color: theme.forms.input.placeholderColor,
    },
  } as React.CSSProperties,

  formTextarea: {
    padding: theme.forms.input.padding,
    fontSize: theme.forms.input.fontSize,
    borderRadius: theme.forms.input.borderRadius,
    border: `1px solid ${theme.forms.input.borderColor}`,
    backgroundColor: theme.forms.input.backgroundColor,
    color: theme.forms.input.color,
    width: "100%",
    minHeight: "120px",
    transition: theme.transitions.normal,
    outline: "none",
    resize: "vertical",
    "&:focus": {
      borderColor: theme.forms.input.focusBorderColor,
      boxShadow: `0 0 0 2px ${theme.colors.accent.muted}`,
    },
    "&::placeholder": {
      color: theme.forms.input.placeholderColor,
    },
  } as React.CSSProperties,

  formError: {
    color: theme.forms.error.color,
    fontSize: theme.forms.error.fontSize,
    marginTop: theme.forms.error.marginTop,
  } as React.CSSProperties,

  // Buttons
  primaryButton: {
    backgroundColor: theme.buttons.primary.bg,
    color: theme.buttons.primary.text,
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    borderRadius: theme.borderRadius.md,
    border: "none",
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    cursor: "pointer",
    transition: theme.transitions.normal,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[2],
    "&:hover": {
      backgroundColor: theme.buttons.primary.hoverBg,
    },
    "&:active": {
      backgroundColor: theme.buttons.primary.activeBg,
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  } as React.CSSProperties,

  secondaryButton: {
    backgroundColor: theme.buttons.secondary.bg,
    color: theme.buttons.secondary.text,
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    borderRadius: theme.borderRadius.md,
    border: "none",
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    cursor: "pointer",
    transition: theme.transitions.normal,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[2],
    "&:hover": {
      backgroundColor: theme.buttons.secondary.hoverBg,
    },
    "&:active": {
      backgroundColor: theme.buttons.secondary.activeBg,
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  } as React.CSSProperties,

  dangerButton: {
    backgroundColor: theme.buttons.danger.bg,
    color: theme.buttons.danger.text,
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    borderRadius: theme.borderRadius.md,
    border: "none",
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    cursor: "pointer",
    transition: theme.transitions.normal,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[2],
    "&:hover": {
      backgroundColor: theme.buttons.danger.hoverBg,
    },
    "&:active": {
      backgroundColor: theme.buttons.danger.activeBg,
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  } as React.CSSProperties,

  // Image upload
  imageUploadContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing[3],
  } as React.CSSProperties,

  imagePreview: {
    width: "160px",
    height: "160px",
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.light}`,
    overflow: "hidden",
    position: "relative",
    backgroundColor: theme.colors.surface.tertiary,
  } as React.CSSProperties,

  imagePreviewEmpty: {
    width: "160px",
    height: "160px",
    borderRadius: theme.borderRadius.md,
    border: `1px dashed ${theme.colors.border.medium}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface.tertiary,
  } as React.CSSProperties,

  imagePreviewOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: theme.transitions.normal,
    "&:hover": {
      opacity: 1,
    },
  } as React.CSSProperties,

  uploadButton: {
    position: "relative",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing[2],
    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
    backgroundColor: theme.colors.surface.secondary,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    cursor: "pointer",
    transition: theme.transitions.normal,
    "&:hover": {
      backgroundColor: theme.colors.state.hover,
    },
  } as React.CSSProperties,

  uploadInput: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
  } as React.CSSProperties,

  // Loading state
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[4],
    padding: theme.spacing[8],
    minHeight: "400px",
  } as React.CSSProperties,

  spinner: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: `3px solid ${theme.colors.accent.muted}`,
    borderTopColor: theme.colors.accent.primary,
    animation: "spin 1s linear infinite",
  } as React.CSSProperties,

  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.sm,
  } as React.CSSProperties,
}

export default theme
