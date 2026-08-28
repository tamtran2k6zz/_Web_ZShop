/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Override spacing globally to enforce DESIGN.md
    spacing: {
      0: '0px',
      1: '4px',
      2: '5px',
      3: '6px',
      4: '10px',
      5: '13px',
      6: '20px',
      7: '40px',
      // Thêm một số utility auto/full/screen để Tailwind hoạt động bình thường cho layout
      auto: 'auto',
      px: '1px',
      full: '100%',
      screen: '100vw',
      'screen-y': '100vh',
      8: '32px', // Adding standard scale fallback temporarily in case of UI breakage on other pages
      10: '40px', 
      12: '48px',
      16: '64px',
      32: '128px',
    },
    extend: {
      fontFamily: {
        primary: ['Arial', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        base: ['14px', '16.8px'],
        xs: '12px',
        sm: '13px',
        md: '14px',
        lg: '17px',
      },
      colors: {
        surface: {
          base: '#000000',
          muted: '#ffffff',
          raised: '#f5f5f5',
        },
        text: {
          secondary: '#0000ee',
          inverse: '#0284C7',
        },
        border: {
          strong: 'rgba(0, 0, 0, 0.87)',
        },
        brand: {
          50: '#f0f9ff',
          600: '#0284C7', // Keep a semantic mapping for primary brand just in case
          700: '#0369a1',
          800: '#075985',
        }
      },
      transitionDuration: {
        instant: '100ms',
        fast: '200ms',
      }
    },
  },
  plugins: [],
}

