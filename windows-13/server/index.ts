import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { Pool } from "pg"; // ← Postgres import

const app = express();
const httpServer = createServer(app);

// Maak een Postgres pool aan
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// --- Middleware ---
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// --- Logging middleware ---
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// --- Guest login route ---
app.post('/api/guest-login', async (req, res) => {
  try {
    const guestId = `guest_${Date.now()}`;
    const guestPin = Math.floor(1000 + Math.random() * 9000).toString();

    await pool.query(
      'INSERT INTO users (username, pin) VALUES ($1, $2)',
      [guestId, guestPin]
    );

    res.json({
      success: true,
      username: guestId,
      pin: guestPin,
      isGuest: true
    });
  } catch (err) {
    console.error("Guest login error:", err);
    res.status(500).json({ success: false, message: "Could not create guest" });
  }
});

// --- Andere routes ---
(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Vite alleen in development
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
