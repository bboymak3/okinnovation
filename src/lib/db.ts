import { getRequestContext } from "@cloudflare/next-on-pages";

// Helper to get D1 database from Cloudflare runtime context
export function getDB(): D1Database {
  try {
    const { env } = getRequestContext();
    return env.DB;
  } catch {
    throw new Error(
      "Database not available. Make sure this is running on Cloudflare Pages."
    );
  }
}
