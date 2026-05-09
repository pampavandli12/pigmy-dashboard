import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',

    coverage: {
      provider: 'v8',

      reporter: ['text', 'json-summary', 'html', 'lcov'],

      reportsDirectory: './coverage',

      include: ['src/**/*.{ts,tsx}'],

      exclude: [
        'src/**/*.d.ts',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/types/**',
      ],

      thresholds: {
        statements: 80,
        functions: 75,
        lines: 80,
        branches: 60,
      },
    },
  },
});
