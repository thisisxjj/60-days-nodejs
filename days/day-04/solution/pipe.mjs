import fs from "node:fs";

const readStream = fs.createReadStream("./large-file.log", {
  encoding: "utf-8",
  highWaterMark: 64 * 1024,
});

readStream.on("open", (fd) => {
  console.log("open", fd);
});

readStream.on("data", (chunk) => {
  console.log(`收到 ${chunk.length} 字节`);
});

readStream.on("end", () => {
  console.log("文件读取完成");
});

readStream.on("error", (err) => {
  console.log("读取错误:", err);
});

const writeStream = fs.createWriteStream("./output.log");

writeStream.write("第一行日志\n");
writeStream.write("第一行日志\n");
writeStream.end("最后一行日志\n");

writeStream.on("finish", () => {
  console.log("写入完成");
});
