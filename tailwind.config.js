/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Patrick Hand', 'sans-serif'],
                hand: ['Patrick Hand', 'cursive'],
                sketch: ['Architects Daughter', 'cursive'],
            },
            colors: {
                paper: '#F9F9F9',
                ink: '#111111',
                highlighter: '#FCD34D',
            },
        },
    },
    plugins: [],
}
