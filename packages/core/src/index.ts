export type CoreLogger = {
  log: (message: string) => void;
};

export const mockCore = (logger: CoreLogger = console): void => {
  logger.log("mockCore called");
};
