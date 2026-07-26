import app from "./app";
import { logger } from "./lib/logger";
import { autoSeedEndpoints } from "./lib/auto-seed";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Populate categories + endpoint docs automatically on every boot.
  // Uses ON CONFLICT DO NOTHING so existing data is never overwritten.
  autoSeedEndpoints();
});
