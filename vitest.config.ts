/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Runs tests through Astro's Vite config, so `astro:*` modules and env handling match the build.
export default getViteConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
