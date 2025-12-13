import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const hasDatabase = !!process.env.DATABASE_URL;

export const pool = hasDatabase 
  ? new Pool({ connectionString: process.env.DATABASE_URL }) 
  : null;

export const db = pool ? drizzle(pool, { schema }) : null;

export function isDatabaseAvailable(): boolean {
  return hasDatabase && db !== null;
}
