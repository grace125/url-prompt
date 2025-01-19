import { default as plugin } from "tailwindcss/plugin"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // colors: {
    //   'black': '#000000',
    //   'white': '#ffffff',
    //   'blue': '#1fb6ff',
    //   'pink': '#ff49db',
    //   'orange': '#ff7849',
    //   'green': '#13ce66',
    //   'gray-dark': '#273444',
    //   'gray': '#8492a6',
    //   'gray-light': '#d3dce6',
    // },
    extend: {
      
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
			addVariant("hocus", ["&:hover", "&:focus-visible"])
			addVariant("all-focus", "&:focus")
			addVariant("focus", "&:focus-visible")
			addVariant("active", "&:active")
			addVariant("disabled", "&[disabled]")
		}),
    plugin(({ matchVariant }) => matchVariant(">>", value => `&::part(${value})`)),
  ],
}

