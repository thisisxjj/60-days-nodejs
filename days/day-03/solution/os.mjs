import os from "node:os";

console.log(os.platform());
console.log(os.type());
console.log(os.release());
console.log(os.arch());
console.log(os.hostname());

console.log(os.homedir());
console.log(os.tmpdir());
console.log(os.userInfo());
console.log(os.userInfo().username);

console.log(os.totalmem() / 1024 / 1024 / 1024);
console.log(os.freemem() / 1024 / 1024 / 1024);

console.log(os.cpus());

console.log(os.networkInterfaces());
