import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
console.log(filename);
console.log(dirname("/usr//aa"));
