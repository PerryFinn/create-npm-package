import { run } from "./run";

const code = run(process.argv.slice(2));
process.exitCode = code;
