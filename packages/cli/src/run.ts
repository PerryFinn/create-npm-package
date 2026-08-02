export type CLIWrite = (message: string) => void;

const HELP_TEXT = ["Usage: perryfinn [options]", "", "Options:", "  --help     Show help"].join("\n");

export const run = (args: string[], write: CLIWrite = console.log): number => {
  if (args.includes("--help")) {
    write(HELP_TEXT);
    return 0;
  }

  write("perryfinn cli ready");
  return 0;
};
