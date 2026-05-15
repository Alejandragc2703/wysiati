/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                wysiati: {
                    bg: '#0b0e14',
                    card: '#161b22',
                    violet: '#8b5cf6',
                    cyan: '#06b6d4',
                }
            }
        },
    },
    plugins: [],
}