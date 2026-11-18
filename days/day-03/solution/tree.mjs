import fs from "node:fs/promises";
import path from "node:path";

const IGNORE = new Set(["node_modules", ".git"]);

const args = process.argv.slice(2);
const targetDir = args.find((a) => !a.startsWith("--")) || ".";
const depthArg = args.find((a) => a.startsWith("--depth="));
const maxDepth = depthArg ? parseInt(depthArg.split("=")[1], 10) : Infinity;

console.log(targetDir);
console.log(path.resolve(targetDir));
console.log(path.basename(path.resolve(targetDir)));

let fileCount = 0;
let dirCount = 0;

async function printTree(dir, prefix = "", depth = 0) {
  if (depth > maxDepth) return;

  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    console.error(`无法读取目录: ${dir}`);
    return;
  }

  entries = entries.filter((e) => !IGNORE.has(e.name));
  entries.sort((a, b) => {
    if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  // console.log(entries);
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isLast = i === entries.length - 1;
    const connector = isLast ? "└──" : "├──";
    const childPrefix = prefix + (isLast ? "    " : "│   ");

    console.log("index:", i);
    console.log("lastIndex:", entries.length - 1);
    console.log("depth:", depth);
    console.log("childPrefix:", childPrefix);
    console.log(`${prefix}${connector}`);
    console.log(`${prefix}${connector} ${entry.name}`);
    if (entry.isDirectory()) {
      dirCount++;
      if (depth < maxDepth) {
        await printTree(path.join(dir, entry.name), childPrefix, depth + 1);
      }
    }
  }
}

printTree(targetDir);
