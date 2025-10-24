/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
	darkMode: ["class"],
	plugins: [require("@tailwindcss/typography")],
	theme: { extend: {} },
};
