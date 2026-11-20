import EventEmitter from "node:events";
import { run } from "node:test";
import { convertProcessSignalToExitCode } from "node:util";

class DownloadManager extends EventEmitter {
  constructor(maxConcurrent = 3) {
    super();
    this.queue = [];
    this.running = 0;
    this.maxConcurrent = maxConcurrent;
  }

  download(path) {
    this.queue.push(path);
    this._next();
  }

  _next() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const file = this.queue.shift();
      this.running++;
      this._simulate(file);
    }
  }

  async _simulate(file) {
    const totalSize = Math.floor(Math.random() * 4 * 1024 * 1024) + 1024 * 1024;
    const chunkSize = Math.floor(totalSize / 20);
    let downloaded = 0;
    try {
      while (downloaded < totalSize) {
        await new Promise((r) => setTimeout(r, 100 + Math.random() * 150));

        // if (Math.random() < 0.05) {
        // throw new Error("网络连接超时");
        // }

        downloaded = Math.min(downloaded + chunkSize, totalSize);
        const percent = ((downloaded / totalSize) * 100).toFixed(1);
        this.emit("process", {
          file,
          percent: parseFloat(percent),
          downloaded,
          totalSize,
        });
      }
      this.emit("complete", { file, size: totalSize });
    } catch (error) {
      this.emit("error", { file, error });
    } finally {
      this.running--;
      this._next();
    }
  }
}

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function renderBar(percent, width = 100) {
  const filled = Math.round((percent / 100) * width);
  return "[" + "█".repeat(filled) + "░".repeat(width - filled) + "]";
}

const manager = new DownloadManager();
const progress = {};

manager.on("process", ({ file, percent }) => {
  progress[file] = percent;
  process.stdout.write(
    `\r ${file.padEnd(12)} ${renderBar(percent)} ${percent.toFixed(1)}%    `,
  );
});

manager.on("complete", ({ file, size }) => {
  console.log(`\n✅ ${file} 下载完成 - ${formatBytes(size)}`);
});

manager.on("error", ({ file, error }) => {
  console.log(`\n❌ ${file} 下载失败 - ${error.message}`);
});

const files = ["file1.zip", "file2.zip", "file3.zip", "file4.zip", "file5.zip"];

console.log(`开始下载 ${files.length} 个文件（最大并发: 3）\n`);
for (const f of files) {
  manager.download(f);
}
