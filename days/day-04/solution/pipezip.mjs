import fs from "node:fs";
import { createGzip } from "node:zlib";

fs.createReadStream("./large-file1.log")
  .pipe(createGzip())
  .pipe(fs.createWriteStream("./large-file.log.gz"));
