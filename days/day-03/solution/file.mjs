import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import { convertProcessSignalToExitCode } from "node:util";

const content = await fs.readFile("./config.json", "utf-8");
console.log("file content ==> ", content);
console.dir(JSON.parse(content));

// 读取二进制文件
const buffer = await fs.readFile(
  "../../../resources/images/official_qrcode.jpg",
);
console.log(buffer.length);
console.log(buffer.byteLength);

// 写入文件
// await fs.writeFile("./output.txt", "Hello world", "utf-8");

// 追加内容
// await fs.appendFile("./log.txt", `[${new Date().toISOString()}] 新日志\n`);

// 文件信息
const stats = await fs.stat("./file.mjs");
console.dir(stats);
console.log(stats.isFile());
console.log(stats.isDirectory());
console.log(stats.mtime);

// 文件删除
// await fs.rename("./old.txt", "./new.txt");
// await fs.unlink("./temp.txt");
// await fs.rm("./temp.txt", { force: true });

// 检查文件是否存在
if (existsSync("./config.json")) {
  console.log("配置文件存在");
}
