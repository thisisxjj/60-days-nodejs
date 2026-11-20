import { Transform } from "node:stream";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";

// 自定义转换流：将文本转为大写
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

// 自定义转换流：行号添加器
let lineNumber = 0;
const addLineNumbers = new Transform({
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split("\n");
    const numbered = lines
      .map((line) => (line ? `${++lineNumber}: ${line}` : ""))
      .join("\n");
    this.push(numbered);
    callback();
  },
});

// 组合使用
await pipeline(
  fs.createReadStream("../solutions/01-download-manager.js"),
  addLineNumbers,
  upperCase,
  fs.createWriteStream("./output.txt"),
);
