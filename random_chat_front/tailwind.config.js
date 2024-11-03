/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./Messenger/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.{html,js}", // Include public folder if using HTML files
    "./styles/**/*.{css,scss}", // Include styles if you're using CSS or SCSS files
    "./lib/**/*.{js,ts,jsx,tsx}", // Include lib folder if you have utility functions
    "./hooks/**/*.{js,ts,jsx,tsx}", // Include hooks if you have custom React hooks
    "./context/**/*.{js,ts,jsx,tsx}", // Include context if using React context API
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}" // NextUI theme
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
}
