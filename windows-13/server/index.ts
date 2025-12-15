import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { Pool } from "pg"; // ← Postgres import

const app = express();
const httpServer = createServer(app);

// Postgres pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware voor JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// --- Guest login route ---
app.post('/api/guest-login', async (req, res) => {
  try {
    // Unieke guest ID
    const guestId = `guest_${Date.now()}`;
    const guestPin = Math.floor(1000 + Math.random() * 9000).toString();

    // Opslaan in DB
    await pool.query(
      'INSERT INTO users (username, pin, isGuest, isOwner) VALUES ($1, $2, true, false)',
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

// --- Auth check middleware ---
app.use(async (req: Request & { user?: any }, res, next) => {
  // Simpele voorbeeld: in productie gebruik je sessions of JWT
  const username = req.headers['x-username'] as string;
  if (username) {
    const result = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    if (result.rows.length) {
      req.user = result.rows[0];
    }
  }
  next();
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

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
