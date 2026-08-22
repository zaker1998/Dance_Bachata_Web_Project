import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const here = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // The real `server-only` package throws unless it is resolved under the
      // "react-server" condition, which Vitest does not set. Stub it so server
      // modules can be imported directly in unit tests.
      "server-only": `${here}test/stubs/server-only.ts`,
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.{ts,tsx}"],
  },
});
