interface DrCodeConfig {
  publicKey: string;
  projectId: string;
  tracesSampleRate?: number;
  profilesSampleRate?: number;
}

declare class DrCode {
  constructor(config: DrCodeConfig, isServer?: boolean);

  init(): void;

  static errorHandler(err: Error, req: any, res: any, next: any): void;

  captureMessage(message: string, level?: string): void;

  captureException(error: Error): void;
}

export = DrCode;
