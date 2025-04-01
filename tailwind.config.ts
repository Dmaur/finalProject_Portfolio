import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        changa: ['Changa', 'sans-serif'], // Light to bold
        orbitron: ['Orbitron', 'sans-serif'], // Regular to heavy
        poppins: ['Poppins', 'sans-serif'], // Regular, italic, light to black
         

      },
      
      colors: {
        drab: {
          DEFAULT: '#343c1c',
          100: '#0a0c06',
          200: '#14180b',
          300: '#1f2311',
          400: '#292f16',
          500: '#343c1c',
          600: '#657537',
          700: '#97ae52',
          800: '#bac98c',
          900: '#dce4c5',
        },
        brown_sugar: {
          DEFAULT: '#a1674a',
          100: '#20150f',
          200: '#40291e',
          300: '#603e2c',
          400: '#81523b',
          500: '#a1674a',
          600: '#ba8368',
          700: '#cba28e',
          800: '#dcc1b4',
          900: '#eee0d9',
        },
        ash_gray: {
          DEFAULT: '#b3bfb8',
          100: '#222925',
          200: '#445149',
          300: '#667a6e',
          400: '#8b9e93',
          500: '#b3bfb8',
          600: '#c3cdc7',
          700: '#d2d9d5',
          800: '#e1e6e3',
          900: '#f0f2f1',
        },
        space_cadet: {
          DEFAULT: '#392f5a',
          100: '#0b0a12',
          200: '#171324',
          300: '#221d36',
          400: '#2e2648',
          500: '#392f5a',
          600: '#59498b',
          700: '#7d6db2',
          800: '#a89dcc',
          900: '#d4cee5',
        },
        glaucous: {
          DEFAULT: '#577399',
          100: '#11171e',
          200: '#232e3d',
          300: '#34455b',
          400: '#465c7a',
          500: '#577399',
          600: '#768eb0',
          700: '#98aac4',
          800: '#bac7d8',
          900: '#dde3eb',
        },
      },
    },
  },
  plugins: [],
};
export default config;
