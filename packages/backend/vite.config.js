import { defineConfig } from "vite";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    root: resolve(__dirname, "./src"),
    resolve: {
        alias: [
            { find: "@", replacement: resolve(__dirname, "./src") },
            { find: "@shared", replacement: resolve(__dirname, "../shared/src") },
        ],
    },
    test: {
        globals: true,
        coverage: {
            exclude: ["**/types.ts", "**/*.config.*/**", "**/index.ts"],
        },
    },
});
