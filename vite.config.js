import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';

const root = process.cwd();
const htmlPages = [
  'index.html',
  'mobile.html',
  'feature.html',
  'download.html',
  'about.html',
  'contact.html',
  'guide.html',
  'plans.html',
];

const passthroughFiles = [
  'app.js',
  'landing.js',
  'mobile.js',
  'robot.glb',
];

function copyPassthroughFiles() {
  return {
    name: 'copy-passthrough-root-files',
    closeBundle() {
      mkdirSync(resolve(root, 'dist'), { recursive: true });
      for (const file of passthroughFiles) {
        const src = resolve(root, file);
        const dest = resolve(root, 'dist', file);
        if (existsSync(src)) copyFileSync(src, dest);
      }
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        htmlPages.map((page) => [page.replace('.html', ''), resolve(root, page)])
      ),
    },
  },
  plugins: [copyPassthroughFiles()],
});
