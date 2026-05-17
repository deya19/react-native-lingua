export const colors = {
  primary: {
    purple: "#6C4EF5",
    deepPurple: "#5B3BF6",
    blue: "#4D8BFF",
    green: "#21C16B",
  },
  semantic: {
    success: "#21C16B",
    warning: "#FFCC00",
    streak: "#FF8A00",
    error: "#FF4D4F",
    info: "#4D8BFF",
  },
  neutral: {
    textPrimary: "#0D132B",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    surface: "#F6F7FB",
    background: "#FFFFFF",
  },
} as const;

export const typography = {
  fontFamily: {
    regular: "Poppins-Regular",
    medium: "Poppins-Medium",
    semiBold: "Poppins-SemiBold",
    bold: "Poppins-Bold",
  },
  scale: {
    h1: {
      fontSize: 32,
      lineHeight: 1.2,
      fontFamily: "Poppins-Bold",
    },
    h2: {
      fontSize: 24,
      lineHeight: 1.3,
      fontFamily: "Poppins-SemiBold",
    },
    h3: {
      fontSize: 20,
      lineHeight: 1.3,
      fontFamily: "Poppins-SemiBold",
    },
    h4: {
      fontSize: 16,
      lineHeight: 1.4,
      fontFamily: "Poppins-Medium",
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 1.6,
      fontFamily: "Poppins-Regular",
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 1.6,
      fontFamily: "Poppins-Regular",
    },
    bodySmall: {
      fontSize: 13,
      lineHeight: 1.6,
      fontFamily: "Poppins-Regular",
    },
    caption: {
      fontSize: 11,
      lineHeight: 1.4,
      fontFamily: "Poppins-Regular",
    },
  },
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const spacing = {
  screenX: 24,
  card: 20,
  section: 32,
  touchTarget: 48,
} as const;

export const designTokens = {
  colors,
  typography,
  radii,
  spacing,
} as const;
