/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          light: 'var(--color-text-light)',
        },
        purple: {
          DEFAULT: 'var(--color-purple)',
          dark: 'var(--color-purple-dark)',
          light: 'var(--color-purple-light)',
        },
        line: {
          DEFAULT: 'var(--color-line)',
          dark: 'var(--color-line-dark)',
        },
      },
      
      fontFamily: {
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
};