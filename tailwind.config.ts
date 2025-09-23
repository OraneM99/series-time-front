import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        text: "rgb(238, 238, 238)",
        button: "rgb(0, 173, 181)",
        background: "rgb(57, 62, 70)",
        container: {
          DEFAULT: "rgb(34, 40, 49)",   // bg-container
          80: "rgb(34 40 49 / 0.8)"     // bg-container-80
        }
      },
    },
  },
  plugins: [],
}

export default config
