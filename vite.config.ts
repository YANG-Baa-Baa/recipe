import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/recipe/",   // ← 如仓库名变了，这里一起改
  plugins: [react(), tsconfigPaths()]
});
