// Day 06 - 练习 1：事件驱动的并发任务调度器

import { EventEmitter } from "node:events";

class TaskScheduler extends EventEmitter {
  constructor(maxConcurrent = 3) {
    super();
    this.queue = [];
    this.running = 0;
    this.maxConcurrent = maxConcurrent;
    this.results = [];
    this.completed = 0;
  }

  addTask(fn, priority = 0) {
    this.queue.push({ fn, priority, index: this.results.length });
    this.results.push(undefined);
  }

  async run() {
    this.queue.sort((a, b) => b.priority - a.priority || a.index - b.index);
    this.emit("start", { total: this.queue.length });

    await new Promise((resolve) => {
      this._resolveRun = resolve;
      this._next();
    });

    this.emit("finish", { total: this.results.length, results: this.results });
    return this.results;
  }

  _next() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      this.running++;
      this.emit("taskStart", { index: task.index, running: this.running });
      this._runTask(task);
    }

    if (this.running === 0 && this.queue.length === 0) {
      this._resolveRun();
    }
  }

  async _runTask({ fn, index }) {
    try {
      const value = await fn();
      this.results[index] = { status: "fulfilled", value };
    } catch (reason) {
      this.results[index] = { status: "rejected", reason };
    } finally {
      this.running--;
      this.completed++;
      const percent = ((this.completed / this.results.length) * 100).toFixed(1);
      const result = this.results[index];

      if (result.status === "fulfilled") {
        this.emit("taskComplete", { index, percent, value: result.value });
      } else {
        this.emit("taskError", { index, percent, reason: result.reason });
      }

      this._next();
    }
  }
}

// ── 演示 ─────────────────────────────────────────────────────

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const scheduler = new TaskScheduler(3);

for (let i = 1; i <= 10; i++) {
  const durationMs = 200 + Math.random() * 3000;
  const priority = i <= 3 ? 10 : 0;

  scheduler.addTask(async () => {
    await delay(durationMs);
    if (i === 7) throw new Error(`任务 ${i} 模拟失败`);
    return `任务 ${i} 结果`;
  }, priority);
}

scheduler.on("start", ({ total }) =>
  console.log(`▶ 开始调度 ${total} 个任务（并发: 3）\n`),
);
scheduler.on("taskStart", ({ index, running }) => {
  console.log(`  🚀 任务 #${index + 1} 开始  当前运行: ${running}`);
});
scheduler.on("taskComplete", ({ index, percent }) => {
  console.log(`  ✅ 任务 #${index + 1} 完成  进度: ${percent}%`);
});
scheduler.on("taskError", ({ index, reason }) => {
  console.log(`  ❌ 任务 #${index + 1} 失败  ${reason.message}`);
});
scheduler.on("finish", ({ results }) => {
  const fulfilled = results.filter(
    (result) => result.status === "fulfilled",
  ).length;
  const rejected = results.filter(
    (result) => result.status === "rejected",
  ).length;
  console.log(`\n🎉 全部完成：成功 ${fulfilled}，失败 ${rejected}`);
});

await scheduler.run();
