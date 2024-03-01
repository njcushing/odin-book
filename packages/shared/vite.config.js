import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    plugins: [react()],
    root: resolve(__dirname, "./src"),
    resolve: {
        alias: [{ find: "@shared", replacement: resolve(__dirname, "./src") }],
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFilesAfterEnv: "./tests.config.js",
    },
});
