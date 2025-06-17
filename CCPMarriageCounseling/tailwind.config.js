/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
content: [
    "./App.{js,jsx,ts,tsx}",
    "@/src/screens/**/*.{js,jsx,ts,tsx}",
    "@/src/components/**/*.{js,jsx,ts,tsx}",
    "@/src/navigation/**/*.{js,jsx,ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
 theme: {
     extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#1A1A1A",
        primary: {
          DEFAULT: "#E83E8C",
          light: "#F06EA9",
          dark: "#C22A73",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#6C757D",
          light: "#ADB5BD",
          dark: "#495057",
          foreground: "#FFFFFF",
        },
        border: "#E9ECEF",
        input: "#F8F9FA",
        success: "#28A745",
        info: "#17A2B8",
        warning: "#FFC107",
        danger: "#DC3545",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
    },
  },
  plugins: [],
}