/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ADHD-Savvy Design System
        bg: '#0b0d11',
        panel: '#141820',
        surface: '#1a1f29',
        text: '#f2f4f7',
        muted: '#8b95a5',
        accent: '#eab308',
        accent2: '#22c55e',
        danger: '#f87171',
        info: '#60a5fa',
        border: '#262c36',
        // Semantic colors
        primary: {
          DEFAULT: '#eab308',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#1a1f29',
          foreground: '#f2f4f7',
        },
        destructive: {
          DEFAULT: '#f87171',
          foreground: '#000000',
        },
        success: {
          DEFAULT: '#22c55e',
          foreground: '#000000',
        },
        info: {
          DEFAULT: '#60a5fa',
          foreground: '#000000',
        },
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        lg: '16px',
        xl: '20px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      spacing: {
        gap: '16px',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        focus: '0 0 20px rgba(234,179,8,0.15)',
        card: '0 4px 24px rgba(0,0,0,0.3)',
        glow: '0 0 24px rgba(234,179,8,0.6)',
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.4s ease forwards',
        'pop-in': 'popIn 0.35s ease forwards',
        'pulse': 'pulse 2s infinite',
        'streak-glow': 'streakGlow 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'confetti-fall': 'confettiFall 3s ease-in forwards',
        'badge-pop': 'badgePop 0.3s ease forwards',
        'ripple': 'ripple 0.6s ease forwards',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(248,113,113,0.45)' },
          '70%': { opacity: '0.85', boxShadow: '0 0 0 14px rgba(248,113,113,0)' },
        },
        streakGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(234,179,8,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(234,179,8,0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        badgePop: {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        ripple: {
          '0%': { boxShadow: '0 0 0 0 rgba(234,179,8,0.4)' },
          '100%': { boxShadow: '0 0 0 20px rgba(234,179,8,0)' },
        },
      },
    },
  },
  plugins: [],
}