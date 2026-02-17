import type { Config } from 'tailwindcss';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FAF9F6', // More of a paper/cream white
                secondary: '#FFFFFF',
                textPrimary: '#1A1A1A', // Deeper charcoal
                textSecondary: '#666666',
                accent: '#C7B6A7', // Muted earth tone
                border: '#E8E6E1',
            },
            fontFamily: {
                serif: ['"Cormorant Garamond"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            letterSpacing: {
                zen: '0.1em',
            },
        },
    },
    plugins: [],
} satisfies Config;
