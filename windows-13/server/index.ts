import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Pool } from "pg";

const app = express();
const httpServer = createServer(app);

// Postgres pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const originalResJson = res.json;
  let capturedJson: any;
  res.json = function (body: any, ...args: any) {
    capturedJson = body;
    return originalResJson.apply(res, [body, ...args]);
  };
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`, capturedJson ? capturedJson : '');
    }
  });
  next();
});

// --- Guest login ---
app.post("/api/guest-login", async (req: Request, res: Response) => {
  try {
    const guestId = `guest_${Date.now()}`;
    const guestPin = Math.floor(1000 + Math.random() * 9000).toString();

    await pool.query(
      'INSERT INTO users (username, pin, is_guest) VALUES ($1, $2, $3)',
      [guestId, guestPin, true]
    );

    res.json({ success: true, username: guestId, pin: guestPin, isGuest: true });
  } catch (err) {
    console.error("Guest login error:", err);
    res.status(500).json({ success: false, message: "Could not create guest" });
  }
});

// --- Andere routes / Error handling ---
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen(port, () => console.log(`Server running on port ${port}`));
