/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        


        background: {
          DEFAULT: "#0A0E15",
          90: "#212631",
          80: "#373F4E",
          70: "#4E576A",
          60: "#667085"
        },
        
        foreground:{
          DEFAULT: "#2b3645",
          100: "#647288"
        },
        
        highlight: {
          DEFAULT: "#ffffff",
          90: "#F0F0F4",
          80: "#E0E4E8",
          70: "#D1D6E0",
          60: "#BFC6D4"
        },
        
        habitColors: {
          hRed: "#882C40",
          hPurple: "#C412FF",
          hGreen: "#39BF09",
          hYellow: "#EFB002",
          hBlue: "#0A72D4",
        }
        


      }
    },
  },
  plugins: [],
}

