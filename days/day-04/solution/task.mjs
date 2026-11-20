import EventEmitter from "node:events";

class TaskRunner extends EventEmitter {
  constructor(tasks) {
    super();
    this.tasks = tasks;
    this.completed = 0;
  }

  async run() {
    this.emit("start", { total: this.tasks.length });

    for (const task of this.tasks) {
      try {
        this.emit("taskStart", { name: task.name });
        await task.execute();
        this.completed++;
        this.emit("taskComplete", {
          name: task.name,
          progress: this.completed / this.tasks.length,
        });
      } catch (error) {
        this.emit("taskError", { name: task.name, error });
      }
    }

    this.emit("finish", {
      total: this.tasks.length,
      completed: this.completed,
    });
  }
}

const runner = new TaskRunner([
  { name: "下载数据", execute: () => new Promise((r) => setTimeout(r, 1000)) },
  { name: "处理数据", execute: () => new Promise((r) => setTimeout(r, 500)) },
  { name: "保存结果", execute: () => new Promise((r) => setTimeout(r, 300)) },
]);

runner.on("start", ({ total }) => console.log(`开始执行 ${total} 个任务`));
runner.on("taskComplete", ({ name, progress }) => {
  console.log(`✅ ${name} - ${(progress * 100).toFixed(0)}%`);
});
runner.on("finish", ({ total, completed }) => {
  console.log(`🎉 完成 ${completed}/${total} 个任务`);
});

runner.run();
