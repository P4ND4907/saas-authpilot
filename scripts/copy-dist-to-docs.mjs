import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const docs = path.join(root, "docs");

if (!existsSync(dist)) {
  throw new Error("dist does not exist. Run npm run build first.");
}

rmSync(docs, { recursive: true, force: true });
mkdirSync(docs, { recursive: true });
cpSync(dist, docs, { recursive: true });

console.log("Copied dist to docs for GitHub Pages.");
