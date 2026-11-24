import fs from "node:fs";
import { createInterface } from "node:readline/promises";

const rl = createInterface({
  input: fs.createReadStream("./large-file.log"),
  crlfDelay: Infinity,
});

// for await (const line of rl) {
// console.log(line);
// }

const rs = fs.createReadStream("./large-file.log", {
  highWaterMark: 100,
});
for await (const block of rs) {
  console.dir(block.toString());
  console.log(Buffer.isBuffer(block));
}

async function* generateNumbers(max) {
  for (let i = 0; i < max; i++) {
    await new Promise((r) => setTimeout(r, 100));
    yield i;
  }
}

for await (const num of generateNumbers(5)) {
  console.log(num);
}

const iterator = {
  current: 0,

  [Symbol.asyncIterator]() {
    return this;
  },

  async next() {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (this.current < 5) {
      return { value: this.current++, done: false };
    }
    return { value: undefined, done: true };
  },
};

for await (const num of iterator) {
  console.log(num);
}
