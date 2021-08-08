import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const envs = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    resolve: {
      alias: {
        '@/': path.join(__dirname, 'src/'),
      },
      //alias: [
      //  {
      //    find: '@/',
      //    replacement: path.join(__dirname, 'src/'),
      //  },
      //]
    },
    plugins: [
      vue()
    ],
    server: {
      cors: true
    }
  })
}
