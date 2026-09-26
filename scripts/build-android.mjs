#!/usr/bin/env node
/**
 * Builds the Next.js export for a native (Android) release and syncs it into the
 * Capacitor Android project.
 *
 *   node scripts/build-android.mjs            static export + `cap sync android`
 *   node scripts/build-android.mjs --bundle   the above, then a signed release .aab
 *
 * Why not just `npm run build && npx cap sync android`? Two reasons:
 *
 *   1. CAPACITOR_BUILD=1 disables the next-pwa service worker (see next.config.ts).
 *      Inside the WebView that worker caches the app shell on https://localhost and
 *      can keep serving the previous build after an APK update.
 *
 *   2. next-pwa writes its worker into public/, and Next copies everything under
 *      public/ into the export. Those committed files would therefore end up inside
 *      the APK even with the plugin disabled, so they are removed from out/ here.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const exportDir = join(projectRoot, "out");
const androidDir = join(projectRoot, "android");

function run(command, args, extraEnv = {}) {
  console.log(`\n> ${command} ${args.join(" ")}\n`);
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

/** next-pwa output that must never be shipped inside the APK. */
function isServiceWorkerArtifact(fileName) {
  return fileName === "sw.js" || fileName.startsWith("workbox-");
}

function stripServiceWorkerArtifacts(directory) {
  if (!existsSync(directory)) {
    console.log(`No export found at ${directory}; nothing to strip.`);
    return;
  }
  const removed = readdirSync(directory).filter(isServiceWorkerArtifact);
  for (const fileName of removed) {
    rmSync(join(directory, fileName), { recursive: true, force: true });
  }
  console.log(
    removed.length > 0
      ? `Removed ${removed.length} service-worker file(s) from out/ so the APK registers none.`
      : "No service-worker files present in out/."
  );
}

// 1. Static export with the PWA worker disabled.
// `--webpack` matches the project's own build script: next-pwa contributes a webpack
// config and Next 16 defaults to Turbopack, which refuses to run alongside it.
run("npx", ["next", "build", "--webpack"], { CAPACITOR_BUILD: "1" });

// 2. Drop any worker that still made it into the export.
stripServiceWorkerArtifacts(exportDir);

// 3. Copy the export into the Android project.
run("npx", ["cap", "sync", "android"]);

// 4. Optionally produce the signed release bundle.
if (process.argv.includes("--bundle")) {
  const gradleWrapper = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
  if (!existsSync(join(androidDir, gradleWrapper))) {
    console.error(`\nGradle wrapper not found at android/${gradleWrapper}.`);
    process.exit(1);
  }
  run(join("android", gradleWrapper), ["-p", "android", "bundleRelease"]);
  console.log("\nSigned bundle: android/app/build/outputs/bundle/release/app-release.aab");
}
