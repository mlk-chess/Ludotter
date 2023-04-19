/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "./public/**/*.html",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [
        require("flowbite/plugin")
    ],
    theme: {
        colors: {
            'custom-light-orange': '#FDF2EC',
            'custom-orange': '#FD6727',
            'custom-hover-orange': '#FF8540',
        }
    },
}