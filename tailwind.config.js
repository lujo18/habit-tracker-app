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
          red: {
            up: "#B84C2C",      // lighter, more yellow (orange-ish)
            DEFAULT: "#882C40",
            down: "#4C2C88"     // darker, more blue (purple-ish)
          },
          yellow: {
            up: "#FFF502",      // lighter, more yellow (lemon)
            DEFAULT: "#EFB002",
            down: "#B08202"     // darker, more blue (olive)
          },
          green: {
            up: "#BFE609",      // lighter, more yellow (lime)
            DEFAULT: "#39BF09",
            down: "#0989BF"     // darker, more blue (teal)
          },
          blue: {
            up: "#4CD4A6",      // lighter, more yellow (turquoise)
            DEFAULT: "#0A72D4",
            down: "#0A2CD4"     // darker, more blue (deeper blue)
          },
          purple: {
            up: "#E05AFF",      // lighter, more yellow (pinkish)
            DEFAULT: "#C412FF",
            down: "#124CFF"     // darker, more blue (indigo)
          }
        },
        
      },
      
    },
    fontFamily: {
      sans: ["GeneralSans-Medium", "sans-serif"],
      "generalsans-extrathin": ["GeneralSans-ExtraThin", "sans-serif"],
      "generalsans-extrathin-italic": ["GeneralSans-ExtraThinItalic", "sans-serif"],
      "generalsans-thin": ["GeneralSans-Thin", "sans-serif"],
      "generalsans-thin-italic": ["GeneralSans-ThinItalic", "sans-serif"],
      "generalsans-regular": ["GeneralSans-Regular", "sans-serif"],
      "generalsans-regular-italic": ["GeneralSans-Italic", "sans-serif"],
      "generalsans-medium": ["GeneralSans-Medium", "sans-serif"],
      "generalsans-medium-italic": ["GeneralSans-MediumItalic", "sans-serif"],
      "generalsans-semibold": ["GeneralSans-SemiBold", "sans-serif"],
      "generalsans-semibold-italic": ["GeneralSans-SemiBoldItalic", "sans-serif"],
      "generalsans-bold": ["GeneralSans-Bold", "sans-serif"],
      "generalsans-bold-italic": ["GeneralSans-BoldItalic", "sans-serif"],
      "lora-regular": ["Lora-Regular", "sans-serif"],
      "lora-regular-italic": ["Lora-Italic", "sans-serif"],
      "lora-medium": ["Lora-Medium", "sans-serif"],
      "lora-medium-italic": ["Lora-MediumItalic", "sans-serif"],
      "lora-semibold": ["Lora-SemiBold", "sans-serif"],
      "lora-semibold-italic": ["Lora-SemiBoldItalic", "sans-serif"],
      "lora-bold": ["Lora-Bold", "sans-serif"],
      "lora-bold-italic": ["Lora-BoldItalic", "sans-serif"],
      "source-extralight": ["SourceSans3-ExtraLight", "sans-serif"],
      "source-extralight-italic": ["SourceSans3-ExtraLightItalic", "sans-serif"],
      "source-light": ["SourceSans3-Light", "sans-serif"],
      "source-light-italic": ["SourceSans3-LightItalic", "sans-serif"],
      "source-regular": ["SourceSans3-Regular", "sans-serif"],
      "source-regular-italic": ["SourceSans3-Italic", "sans-serif"],
      "source-medium": ["SourceSans3-Medium", "sans-serif"],
      "source-medium-italic": ["SourceSans3-MediumItalic", "sans-serif"],
      "source-semibold": ["SourceSans3-SemiBold", "sans-serif"],
      "source-semibold-italic": ["SourceSans3-SemiBoldItalic", "sans-serif"],
      "source-bold": ["SourceSans3-Bold", "sans-serif"],
      "source-bold-italic": ["SourceSans3-BoldItalic", "sans-serif"],
      "source-extrabold": ["SourceSans3-ExtraBold", "sans-serif"],
      "source-extrabold-italic": ["SourceSans3-ExtraBoldItalic", "sans-serif"],
      "source-black": ["SourceSans3-Black", "sans-serif"],
      "source-black-italic": ["SourceSans3-BlackItalic", "sans-serif"]
    }
  },
  plugins: [],
}

