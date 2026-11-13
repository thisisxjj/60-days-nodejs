const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║         欢迎使用问候程序 👋          ║");
  console.log("╚══════════════════════════════════════╝");
  console.log();

  const name = await ask("请输入你的名字\n");
  const age = await ask("请输入你的年龄\n");
  const ageNum = parseInt(age, 10);

  if (!name) {
    console.log("❌ 名字不能为空！");
    rl.close();
    process.exit(1);
  }

  if (isNaN(ageNum) || ageNum < 0) {
    console.log("❌ 年龄不合法! ");
    rl.close();
    process.exit(1);
  }

  console.log();
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`👋 你好, ${name}!`);
  console.log(`🎂 你今年 ${ageNum} 岁了`);

  const birthYear = new Date().getFullYear() - ageNum;
  console.log(`📅 你大约出生于 ${birthYear} 年`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  rl.close();
}

main();
