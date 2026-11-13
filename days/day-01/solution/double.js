const number = process.argv.slice(2);

const num = Number(number);
if (isNaN(num)) {
  process.exit(1);
}

console.log(number * 2);
