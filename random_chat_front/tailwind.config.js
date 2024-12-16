/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./Messenger/**/*.{js,ts,jsx,tsx,mdx}",
    "./Messenger/Profile/[id]/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html", // Adjusted glob pattern
    "./styles/**/*.{css,scss}", // Included CSS/SCSS files
    "./lib/**/*.{js,ts,jsx,tsx}", // Included lib folder for utilities
    "./hooks/**/*.{js,ts,jsx,tsx}", // Included hooks folder
    "./context/**/*.{js,ts,jsx,tsx}", // Included context API files
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // NextUI theme files
  ],
  theme: {
    extend: {}, // Extend with custom configurations if needed
  },
  darkMode: "class", // Enable dark mode with class strategy
  plugins: [nextui()], // Add NextUI plugin
};
