import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      allowedHosts: ['url-shortner-web-app-colv.onrender.com'],
      port: Number(env.CLIENT_PORT),
    },
  };
});
