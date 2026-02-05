/**
 * Servidor web ultra simple
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, '..', 'data');

// Asegurar que existe directorio de datos
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const server = http.createServer((req, res) => {
  console.log('Request:', req.url);
  
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Scraper de Coches</h1><p>Servidor funcionando</p>');
  } else if (req.url === '/api/cars') {
    try {
      const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
      if (files.length === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([]));
        return;
      }
      const latest = files.sort().pop();
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, latest)));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (e) {
      console.error('Error:', e.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log('✅ Servidor listo en http://localhost:' + PORT);
  console.log('Presiona Ctrl+C para detener');
});

// Mantener proceso vivo
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando...');
  server.close();
});
