/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'var(--font-arabic)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-arabic)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        // Hilyoon identity: midnight ink, electric aqua, crescent gold
        ink: {
          950: '#03060C',
          900: '#060B15',
          850: '#09101D',
          800: '#0D1626',
          700: '#152036',
          600: '#1F2D48',
          500: '#2C3D5E',
        },
        aqua: {
          200: '#A7F7EC',
          300: '#6EEEDD',
          400: '#2EE0C8',
          500: '#12C4AD',
          600: '#0A9E8C',
          700: '#087C6E',
        },
        // Logo red (#FF3130): Hilyoon's signature for labels, borders and lines
        ember: {
          200: '#FFC2C0',
          300: '#FF8E8B',
          400: '#FF5E5B',
          500: '#FF3130',
          600: '#E31F1E',
          700: '#B51518',
        },
        gold: {
          200: '#FDE6B3',
          300: '#FBD27E',
          400: '#F5B947',
          500: '#E39E22',
          600: '#B97A12',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'fadeInLeft': 'fadeInLeft 0.6s ease-out',
        'fadeInRight': 'fadeInRight 0.6s ease-out',
        'slideInUp': 'slideInUp 0.5s ease-out',
        'scaleIn': 'scaleIn 0.4s ease-out',
        'gradient': 'gradient 15s ease infinite',
        'marquee': 'marquee 40s linear infinite',
        'aurora': 'aurora 18s ease-in-out infinite alternate',
        'spin-slow': 'spin 14s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%': { transform: 'translate3d(-6%, -4%, 0) scale(1)' },
          '50%': { transform: 'translate3d(5%, 3%, 0) scale(1.12)' },
          '100%': { transform: 'translate3d(-3%, 6%, 0) scale(0.96)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInLeft: {
          from: {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        fadeInRight: {
          from: {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInUp: {
          from: {
            transform: 'translateY(100%)',
          },
          to: {
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
    },
  },
  plugins: [],
}
