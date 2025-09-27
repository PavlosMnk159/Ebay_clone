import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  optimizeDeps: {
    exclude: ['@preflower/barcode-detector-polyfill'],
  },
  server: {
    host:true,
    port:443,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "certs/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/cert.pem")),
    }
  }

});
