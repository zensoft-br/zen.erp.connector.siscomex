import archiver from "archiver";
import * as esbuild from "esbuild";
import {
  cpSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  rmSync,
} from "fs";
import { dirname, join } from "path";

const CONFIG = {
  entry: "src/lambda.js",
  outDir: "dist",
  zipFile: "bundle.zip",
  target: "node24",
  platform: "node",
  // external: ["esbuild"],
  // nativePackages: [
  //   "esbuild",
  //   "@esbuild/linux-arm64",
  // ],
};

async function build() {
  console.time("Build time");

  // clean up previous build
  console.log("Cleaning up...");
  rmSync(CONFIG.outDir, { recursive: true, force: true });
  rmSync(CONFIG.zipFile, { force: true });

  // bundle with esbuild
  console.log("Bundling with esbuild...");
  await esbuild.build({
    entryPoints: [CONFIG.entry],
    outdir: CONFIG.outDir,
    bundle: true,
    platform: CONFIG.platform,
    target: CONFIG.target,
    format: "cjs",
    minify: true,
    external: CONFIG.external,
  });

  // copy public
  console.log("Copying public...");
  copyPublic();

  // copy native dependencies
  console.log("Copying native dependencies...");
  for (const pkg of CONFIG.nativePackages || []) {
    copyPackage(pkg);
  }

  // zip the result
  console.log("Zipping artifact...");
  await createZip(CONFIG.outDir, CONFIG.zipFile);

  console.log("Removing dist folder...");
  rmSync(CONFIG.outDir, { recursive: true, force: true });

  console.timeEnd("Build time");

  console.log(`Success! Artifact created at: ${CONFIG.zipFile}`);
}

function copyPublic() {
  const publicSrc = join("src", "public");
  if (existsSync(publicSrc)) {
    cpSync(publicSrc, join(CONFIG.outDir, "public"), { recursive: true });
  }
}

function copyPackage(packageName) {
  const src = join("node_modules", packageName);
  const dest = join(CONFIG.outDir, "node_modules", packageName);

  if (!existsSync(src)) {
    console.error(`Error: Package '${packageName}' not found in node_modules.`);
    console.error(`   Run: npm install ${packageName} --save-optional`);
    // process.exit(1);
    return;
  }

  // Ensure parent directory exists (e.g., node_modules/@esbuild)
  const destDir = dirname(dest);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  // 'dereference: true' follows symlinks (crucial for pnpm/yarn users deploying to Lambda)
  cpSync(src, dest, { recursive: true, dereference: true });
}

function createZip(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
