/**
 * Servidor web simplificado para coches
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, '..', 'data');

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scraper de Coches</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        button { background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 10px; }
        button:hover { background: #764ba2; }
        #chart { max-width: 800px; margin: 30px auto; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px; }
        .stat { background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; }
        .stat-value { font-size: 28px; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Scraper de Coches - AutoScout24</h1>
        <div style="text-align: center;">
            <button onclick="loadData()">Cargar Datos</button>
        </div>
        <div id="chart">
            <canvas id="scatterChart"></canvas>
        </div>
        <div class="stats" id="stats"></div>
    </div>
    <script>
        async function loadData() {
            const response = await fetch('/api/cars');
            const data = await response.json();
            
            if (data.length === 0) {
                alert('No hay datos. Ejecuta primero: node src/scraper.js');
                return;
            }
            
            const ctx = document.getElementById('scatterChart').getContext('2d');
            new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Audi A3',
                        data: data.map(c => ({ x: c.anio, y: c.precio })),
                        backgroundColor: 'rgba(102, 126, 234, 0.6)',
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'Precio vs Año', font: { size: 18 } }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Año' } },
                        y: { title: { display: true, text: 'Precio (€)' } }
                    }
                }
            });
            
            const avgPrice = data.reduce((a, b) => a + b.precio, 0) / data.length;
            const avgYear = data.reduce((a, b) => a + b.anio, 0) / data.length;
            
            document.getElementById('stats').innerHTML = 
                '<div class="stat"><div class="stat-value">' + data.length + '</div><div class="stat-label">Coches</div></div>' +
                '<div class="stat"><div class="stat-value">' + Math.round(avgPrice).toLocaleString() + '€</div><div class="stat-label">Precio Medio</div></div>' +
                '<div class="stat"><div class="stat-value">' + Math.round(avgYear) + '</div><div class="stat-label">Año Medio</div></div>';
        }
        
        loadData();
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.end(HTML);
    } else if (req.url === '/api/cars') {
        try {
            const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
            if (files.length === 0) {
                res.end(JSON.stringify([]));
                return;
            }
            const latest = files.sort().pop();
            const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, latest)));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        } catch (e) {
            res.end(JSON.stringify([]));
        }
    } else {
        res.statusCode = 404;
        res.end('Not found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('Servidor en http://localhost:' + PORT);
    console.log('También accesible desde red: http://0.0.0.0:' + PORT);
});
