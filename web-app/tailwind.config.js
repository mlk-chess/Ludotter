/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "./public/**/*.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    ],
    plugins: [
        require("flowbite/plugin")
    ],
    theme: {
        colors: {
            'custom-light-orange': '#FDF2EC',
            'custom-highlight-orange': '#ffcd9f',
            'custom-orange': '#FD6727',
            'custom-hover-orange': '#FF8540',
            'custom-dark': '#222222',
            'custom-pastel-purple': '#e3b4fa',
            'custom-pastel-blue': '#b4dcfa',
        }
    },
}