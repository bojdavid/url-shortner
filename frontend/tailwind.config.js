/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Snip Design System — Stitch Tokens
        surface: '#0b1326',
        'surface-dim': '#0b1326',
        'surface-bright': '#31394d',
        'surface-container-lowest': '#060e20',
        'surface-container-low': '#131b2e',
        'surface-container': '#171f33',
        'surface-container-high': '#222a3d',
        'surface-container-highest': '#2d3449',
        'surface-variant': '#2d3449',
        'on-surface': '#dae2fd',
        'on-surface-variant': '#c7c4d7',
        'inverse-surface': '#dae2fd',
        'inverse-on-surface': '#283044',
        outline: '#908fa0',
        'outline-variant': '#464554',
        'surface-tint': '#c0c1ff',
        primary: '#c0c1ff',
        'on-primary': '#1000a9',
        'primary-container': '#8083ff',
        'on-primary-container': '#0d0096',
        'inverse-primary': '#494bd6',
        'primary-fixed': '#e1e0ff',
        'primary-fixed-dim': '#c0c1ff',
        'on-primary-fixed': '#07006c',
        'on-primary-fixed-variant': '#2f2ebe',
        secondary: '#b7c8e1',
        'on-secondary': '#213145',
        'secondary-container': '#3a4a5f',
        'on-secondary-container': '#a9bad3',
        'secondary-fixed': '#d3e4fe',
        'secondary-fixed-dim': '#b7c8e1',
        'on-secondary-fixed': '#0b1c30',
        'on-secondary-fixed-variant': '#38485d',
        tertiary: '#4edea3',
        'on-tertiary': '#003824',
        'tertiary-container': '#00885d',
        'on-tertiary-container': '#000703',
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
        background: '#0b1326',
        'on-background': '#dae2fd',
        // Action (indigo) — used for interactive buttons
        indigo: {
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'headline-lg': ['clamp(28px,4vw,32px)', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-md': ['clamp(18px,2.5vw,20px)', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-base': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-sm': ['13px', { lineHeight: '18px', letterSpacing: '0.01em', fontWeight: '500' }],
      },
      borderRadius: {
        DEFAULT: '0.5rem', // 8px — buttons / inputs
        sm: '0.375rem',   // 6px — tags
        md: '0.75rem',    // 12px — cards
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        'stack-sm': '0.5rem',
        'stack-md': '1rem',
        'stack-lg': '2rem',
        gutter: '1.5rem',
        'margin-mobile': '1rem',
        'container-max': '1280px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
        'drawer': '-10px 0 30px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        'skeleton-loading': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        skeleton: 'skeleton-loading 1.5s infinite',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1)',
        'fade-in': 'fade-in 0.2s ease',
        'toast-in': 'toast-in 0.25s ease',
      },
    },
  },
  plugins: [],
};
