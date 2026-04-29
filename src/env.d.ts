// Cloudflare D1 type definitions for @cloudflare/next-on-pages

interface Env {
  DB: D1Database;
}

declare module "@cloudflare/next-on-pages" {
  interface RequestContext {
    env: Env;
  }
}
