import { defineConfig } from 'vite';
import nadi from '@nadi/vite-plugin';

export default defineConfig({
  plugins: [nadi()],
  server: {
    port: 3000,
    open: true,
  },
});
