import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const astroBin = path.join(root, "node_modules", "astro", "bin", "astro.mjs");

const build = spawn(process.execPath, [astroBin, "build"], {
  cwd: root,
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: "1",
  },
  stdio: "inherit",
});

build.on("exit", (code) => {
  process.exit(code ?? 1);
});

build.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
