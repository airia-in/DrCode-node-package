"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
function constructDSN(config) {
    const requiredFields = ["publicKey", "projectId"];
    for (const field of requiredFields) {
        if (!config[field]) {
            throw new Error(`Missing required configuration field: ${field}`);
        }
    }
    return `https://${config.publicKey}@pulse.drcode.ai:443/${config.projectId}`;
}
class DrCode {
    constructor(config, isServer = true) {
        this.validateConfig(config);
        this.config = config;
        this.isServer = isServer;
        this.dsn = constructDSN(config);
    }
    validateConfig(config) {
        if (!config || typeof config !== "object") {
            throw new Error("Invalid configuration: config must be an object");
        }
        const requiredFields = [
            "publicKey",
            "projectId",
        ];
        for (const field of requiredFields) {
            if (!config[field]) {
                throw new Error(`Missing required configuration field: ${field}`);
            }
        }
    }
    init() {
        if (this.isServer) {
            try {
                Sentry.init({
                    dsn: this.dsn,
                    integrations: [(0, profiling_node_1.nodeProfilingIntegration)()],
                    tracesSampleRate: this.config.tracesSampleRate || 1.0,
                    profilesSampleRate: this.config.profilesSampleRate || 1.0,
                });
            }
            catch (error) {
                throw new Error(`Failed to initialize Sentry: ${error.message}`);
            }
        }
        else {
            console.warn("Sentry initialization skipped: Not running in server environment");
        }
    }
    static errorHandler(err, req, res, next) {
        Sentry.captureException(err);
        next(err);
    }
    captureMessage(message, level = "info") {
        Sentry.captureMessage(message, level);
    }
    captureException(error) {
        Sentry.captureException(error);
    }
}
module.exports = DrCode;
