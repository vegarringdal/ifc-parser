const colors = require('tailwindcss/colors')

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'light-blue': colors.lightBlue,
        cyan: colors.cyan,
      },
    },
  },
  purge: {
    enabled: false,
    content: ["./src/**/*.ts"],
  },
};
