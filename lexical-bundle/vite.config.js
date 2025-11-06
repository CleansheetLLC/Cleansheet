import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'CleansheetLexical',
      fileName: 'cleansheet-lexical',
      formats: ['umd'],
    },
    rollupOptions: {
      output: {
        // Ensure all code is in a single file
        inlineDynamicImports: true,
      },
    },
    // Generate source maps for debugging
    sourcemap: false,
    // Output to parent shared directory
    outDir: '../shared',
    // Clear output dir to avoid conflicts
    emptyOutDir: false,
  },
});
