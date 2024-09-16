import { Request, Response, NextFunction } from "express";
interface DrCodeConfig {
    publicKey: string;
    projectId: number;
    tracesSampleRate?: number;
    profilesSampleRate?: number;
}
declare class DrCode {
    private config;
    private isServer;
    private dsn;
    constructor(config: DrCodeConfig, isServer?: boolean);
    private validateConfig;
    init(): void;
    static errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void;
    captureMessage(message: string, level?: "fatal" | "error" | "warning" | "log" | "info" | "debug"): void;
    captureException(error: Error): void;
}
export = DrCode;
