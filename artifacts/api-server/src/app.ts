import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

// In production, serve the built React frontend from the api-server process.
// The Vite build outputs to artifacts/heave-games/dist/public.
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../heave-games/dist/public");
  app.use(express.static(frontendDist));
  // SPA fallback — let React Router handle all non-API routes
  // Express 5 + path-to-regexp v8 requires named wildcard syntax
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
