import express from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 44000;

app.use(morgan('dev'));

app.use(
  '/api',
  createProxyMiddleware({
    // eslint-disable-next-line no-undef
    target: process.env.VITE_API_TARGET_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  }),
);

app.use(express.static(path.join(__dirname, './dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(port, () => {
  console.log(`Dev Standard listening on port ${port}`);
});
