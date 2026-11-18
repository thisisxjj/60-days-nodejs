import fs from "node:fs/promises";
import path from "node:path";

// await fs.mkdir("./dist");
// await fs.mkdir("./dist/assets/images", { recursive: true });

const files = await fs.readdir("./src");
console.log(files);

const entries = await fs.readdir("./src", { withFileTypes: true });
for (const entry of entries) {
  const type = entry.isDirectory() ? "📁" : "📄";
  console.log(`${type} ${entry.name}`);
}

// 删除目录
// await fs.rm("./dist", { recursive: true, force: true });
// await fs.copyFile("./config.json", "./src/config.json");
// await fs.copyFile("./src/config.json", "./dist/config.json");

// 监控文件变化
// const watcher = fs.watch("./src", { recursive: true });
// for await (const event of watcher) {
// console.log(`${event.eventType}: ${event.filename}`);
// }
const allFiles = await fs.readdir("./src", { recursive: true });
console.log(allFiles);

async function walkDir(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    results.push(fullPath);
    if (entry.isDirectory()) {
      const subFiles = await walkDir(fullPath);
      results.push(...subFiles);
    }
  }
  return results;
}

const all2Files = await walkDir("./src");
all2Files.forEach((f) => console.log(f));
