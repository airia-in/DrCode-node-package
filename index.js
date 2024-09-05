const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

/**
 * Constructs a DSN (Data Source Name) from the provided configuration.
 * @param {Object} config - The configuration object for Sentry.
 * @returns {string} - The constructed DSN string.
 * @throws Will throw an error if any required configuration field is missing.
 */
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
  /**
   * Creates an instance of DrCode.
   * @param {Object} config - The configuration object for Sentry.
   * @param {boolean} [isServer=true] - Indicates if the environment is server-side.
   */
  constructor(config, isServer = true) {
    this.validateConfig(config);
    this.config = config;
    this.isServer = isServer;
    this.dsn = constructDSN(config);
  }

  /**
   * Validates the configuration object.
   * @param {Object} config - The configuration object for Sentry.
   * @throws Will throw an error if the configuration is invalid.
   */
  validateConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration: config must be an object");
    }

    const requiredFields = ["publicKey", "projectId"];
    for (const field of requiredFields) {
      if (!config[field]) {
        throw new Error(`Missing required configuration field: ${field}`);
      }
    }
  }

  /**
   * Initializes Sentry with the provided DSN and configuration.
   * If not in a server environment, initialization is skipped.
   */
  init() {
    if (this.isServer) {
      try {
        Sentry.init({
          dsn: this.dsn,
          integrations: [nodeProfilingIntegration()],
          tracesSampleRate: this.config.tracesSampleRate || 1.0,
          profilesSampleRate: this.config.profilesSampleRate || 1.0,
        });
      } catch (error) {
        throw new Error(`Failed to initialize Sentry: ${error.message}`);
      }
    } else {
      console.warn(
        "Sentry initialization skipped: Not running in server environment"
      );
    }
  }

  /**
   * Middleware for handling errors in Express applications.
   * @param {Error} err - The error object.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  static errorHandler(err, req, res, next) {
    Sentry.captureException(err);
    next(err);
  }

  /**
   * Captures a custom message with the specified severity level.
   * @param {string} message - The message to capture.
   * @param {string} [level=Sentry.Severity.Info] - The severity level of the message.
   */
  captureMessage(message, level = Sentry.Severity.Info) {
    Sentry.captureMessage(message, level);
  }

  /**
   * Captures an exception (error) and sends it to Sentry.
   * @param {Error} error - The error object to capture.
   */
  captureException(error) {
    Sentry.captureException(error);
  }
}

module.exports = DrCode;
