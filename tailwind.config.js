/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
        'slideIn': 'slideIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-custom': 'bounce-custom 0.8s ease-in-out',
        'thinking': 'thinking 2.5s ease-in-out infinite',
        'reveal': 'reveal 1.5s ease-out',
        'weather': 'weather 2s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'raindrop': 'raindrop 1.5s linear infinite',
        'float-up': 'float-up 3s ease-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        'bounce-custom': {
          '0%, 100%': { 
            transform: 'translateY(0) scale(1)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': { 
            transform: 'translateY(-10%) scale(1.05)', 
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },
        'thinking': {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-5px) rotate(-3deg)' },
          '50%': { transform: 'translateX(0) rotate(0deg)' },
          '75%': { transform: 'translateX(5px) rotate(3deg)' },
          '100%': { transform: 'translateX(0) rotate(0deg)' },
        },
        'reveal': {
          '0%': { transform: 'scale(0.95) rotateY(-20deg)', opacity: '0.5' },
          '60%': { transform: 'scale(1.05) rotateY(10deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotateY(0)', opacity: '1' },
        },
        'weather': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-5px) scale(1.02)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        'wave': {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg) translateY(-5px)' },
          '50%': { transform: 'rotate(0deg) translateY(0)' },
          '75%': { transform: 'rotate(-5deg) translateY(-5px)' },
          '100%': { transform: 'rotate(0deg) translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '33%': { transform: 'translateY(-10px) translateX(5px)' },
          '66%': { transform: 'translateY(-5px) translateX(-5px)' },
        },
        'raindrop': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '100%': { transform: 'translateY(30px) scale(0.9)', opacity: '0' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-20px) scale(0.8)', opacity: '0' },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}