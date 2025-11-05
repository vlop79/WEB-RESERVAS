// Vercel Serverless Function Entry Point
import { createServer } from '../dist/index.js';

let app;

export default async function handler(req, res) {
  if (!app) {
    app = await createServer();
  }
  return app(req, res);
}
