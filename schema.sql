-- Schema for OKINNOVATION PE D1 Database
-- Run with: wrangler d1 execute ok_db --remote --file=schema.sql

DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price TEXT DEFAULT 'Cotizar',
  category TEXT DEFAULT 'Bumpers',
  image TEXT DEFAULT '/products/bumper.png',
  featured INTEGER DEFAULT 0,
  "order" INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_order ON products("order");
