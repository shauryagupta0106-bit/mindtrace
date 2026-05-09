import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"] || "3001";
let port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  console.warn(`Invalid PORT value: "${rawPort}", using default 3001`);
  port = 3001;
}

// Safe server startup with error handling
app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    console.error(`❌ Failed to start server on port ${port}:`, err);
    // Don't exit immediately, try to recover
    setTimeout(() => {
      console.log('🔄 Retrying server startup...');
      app.listen(port, (retryErr) => {
        if (retryErr) {
          console.error('❌ Server startup failed permanently:', retryErr);
          process.exit(1);
        } else {
          logger.info({ port }, "Server listening after retry");
        }
      });
    }, 2000);
    return;
  }

  logger.info({ port }, "Server listening");
  console.log(`✅ API Server started successfully on port ${port}`);
});
