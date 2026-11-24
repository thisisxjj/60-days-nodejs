/**
 * 并发限制器
 * @param {number} limit 最大并发数
 * @param {Array} items 要处理的数据
 * @param {Function} fn 异步处理函数
 */
async function asyncPool(limit, items, fn) {
  const results = [];
  const executing = new Set();
  for (const [index, item] of items.entries()) {
    const promise = fn(item, index)
      .then((result) => {
        return result;
      })
      .finally(() => {
        executing.delete(promise);
      });

    results.push(promise);
    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

const urls = Array.from(
  { length: 20 },
  (_, i) => `https://jsonplaceholder.typicode.com/posts/${i + 1}`,
);

let active = 0;
let maxActive = 0;

const results = await asyncPool(3, urls, async (url) => {
  active++;
  maxActive = Math.max(maxActive, active);
  console.log("开始", url, "当前并发数", active);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`请求失败：${response.status} ${url}`);
    }
    return await response.json();
  } finally {
    active--;
    console.log("结束", url, "当前并发数", active);
  }
});

console.log("观测到的最大并发数：", maxActive);
console.log(results);
