import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());

// Serve static assets from dist in production
const distPath = path.resolve(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Health check endpoints for Google Cloud Run
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// For any other request, send back index.html for client-side routing
app.get('*', (_req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>EduSport AI</title>
  </head>
  <body style="font-family: sans-serif; text-align: center; padding: 40px;">
    <h2>EduSport AI - Đang tải hệ thống...</h2>
    <p>Hệ thống Giáo dục Thể chất THPT Huỳnh Tấn Phát.</p>
  </body>
</html>`);
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`EduSport AI server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
