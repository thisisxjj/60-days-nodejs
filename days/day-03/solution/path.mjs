import path from "node:path";

const p = path.join("/users", "john", "docs", "file.txt");
console.log(p);

const p2 = path.resolve("src", "index.js");
console.log(p2);

const filePath = "/home/user/documents/report.pdf";
console.log("dirname ==>", path.dirname(filePath));
console.log("basename ==>", path.basename(filePath));
console.log("extname ==>", path.extname(filePath));
console.log(
  "basename without ext ==>",
  path.basename(filePath, path.extname(filePath)),
);

console.log("file parse object ==>", path.parse(filePath));

// 相对路径
console.log(
  "relative path ==> ",
  path.relative("/data/src", "/data/dist/assets/js/bundle.js"),
);

const normalizePath = path.normalize("/users///john/../jane/./docs");
console.log("normalize path ==>", normalizePath);
