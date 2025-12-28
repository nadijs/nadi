import { defineConfig } from 'vite';
import nadi from '@nadi/vite-plugin';

export default defineConfig({
  plugins: [nadi()],
});
