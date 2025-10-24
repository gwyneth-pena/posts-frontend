// theme.ts
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        reddit: {
          50: { value: "#fff5f0" },
          100: { value: "#ffe0d6" },
          200: { value: "#ffc1b3" },
          300: { value: "#ff9e8f" },
          400: { value: "#ff7b6b" },
          500: { value: "#ff4500" },
          600: { value: "#e03f00" },
          700: { value: "#b23700" },
          800: { value: "#812800" },
          900: { value: "#4f1800" },
        },
        redditBlue: {
          50: { value: "#e6f0fb" },
          100: { value: "#c0daf7" },
          200: { value: "#95c3f2" },
          300: { value: "#66aef0" },
          400: { value: "#3b97ed" },
          500: { value: "#0079D3" }, 
          600: { value: "#0063aa" },
          700: { value: "#004d80" },
          800: { value: "#003556" },
          900: { value: "#001f30" },
        },
        redditGray: {
          50: { value: "#f6f7f8" },
          100: { value: "#e1e3e6" },
          200: { value: "#c6c9cc" },
          300: { value: "#a3a7ab" },
          400: { value: "#7d8287" },
          500: { value: "#54595f" },
          600: { value: "#3a3d42" },
          700: { value: "#242629" },
          800: { value: "#1a1b1d" },
          900: { value: "#0d0d0e" },
        },
      },
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
