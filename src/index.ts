import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { Request, Response, NextFunction } from "express";

interface DrCodeConfig {
  publicKey: string;
  projectId: number;
  tracesSampleRate?: number;
  profilesSampleRate?: number;
}

function constructDSN(config: DrCodeConfig): string {
  const requiredFields: Array<keyof DrCodeConfig> = ["publicKey", "projectId"];
  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required configuration field: ${field}`);
    }
  }
  return `https://${config.publicKey}@pulse.drcode.ai:443/${config.projectId}`;
}

class DrCode {
  private config: DrCodeConfig;
  private isServer: boolean;
  private dsn: string;

  constructor(config: DrCodeConfig, isServer: boolean = true) {
    this.validateConfig(config);
    this.config = config;
    this.isServer = isServer;
    this.dsn = constructDSN(config);
  }

  private validateConfig(config: DrCodeConfig): void {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration: config must be an object");
    }

    const requiredFields: Array<keyof DrCodeConfig> = [
      "publicKey",
      "projectId",
    ];
    for (const field of requiredFields) {
      if (!config[field]) {
        throw new Error(`Missing required configuration field: ${field}`);
      }
    }
  }

  init(): void {
    if (this.isServer) {
      try {
        Sentry.init({
          dsn: this.dsn,
          integrations: [nodeProfilingIntegration()],
          tracesSampleRate: this.config.tracesSampleRate || 1.0,
          profilesSampleRate: this.config.profilesSampleRate || 1.0,
        });
      } catch (error) {
        throw new Error(
          `Failed to initialize Sentry: ${(error as Error).message}`
        );
      }
    } else {
      console.warn(
        "Sentry initialization skipped: Not running in server environment"
      );
    }
  }

  static errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    Sentry.captureException(err);
    next(err);
  }

  captureMessage(
    message: string,
    level: "fatal" | "error" | "warning" | "log" | "info" | "debug" = "info"
  ): void {
    Sentry.captureMessage(message, level);
  }

  captureException(error: Error): void {
    Sentry.captureException(error);
  }
}

export = DrCode;
