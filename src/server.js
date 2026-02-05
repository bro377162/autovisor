/**
 * Servidor web simple - Sin dependencias externas
 * Sirve el HTML y datos de coches
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, '..', 'data');

// HTML con el gráfico
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scraper de Coches 🚗</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 2rem;
        }
        .filters {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            justify-content: center;
        }
        select, button {
            padding: 0.8rem 1.5rem;
            border-radius: 10px;
            border: 2px solid #667eea;
            font-size: 1rem;
            cursor: pointer;
            background: white;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
        }
        button:hover {
            background: #764ba2;
        }
        #chart {
            width: 100%;
            height: 500px;
            position: relative;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 15px;
            text-align: center;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            color: #666;
            margin-top: 0.5rem;
        }
        .loading {
            text-align: center;
            padding: 3rem;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚗 Scraper de Coches - AutoScout24</h1>
        
        <div class="filters">
            <select id="marca">
                <option value="audi">Audi</option>
            </select>
            <select id="modelo">
                <option value="a3">A3</option>
            </select>
            <button onclick="scrape()">🔍 Buscar</button>
            <button onclick="loadData()">📊 Cargar últimos datos</button>
        </div>
        
        <div id="chart">
            <canvas id="scatterChart"></canvas>
        </div>
        
        <div class="stats" id="stats">
            <div class="stat-card">
                <div class="stat-value" id="totalCars">-</div>
                <div class="stat-label">Coches</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="avgPrice">-</div>
                <div class="stat-label">Precio Medio</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="avgYear">-</div>
                <div class="stat-label">Año Medio</div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        let chart = null;
        
        // Dibuja el gráfico de dispersión
        function drawChart(data) {
            const ctx = document.getElementById('scatterChart').getContext('2d');
            
            if (chart) {
                chart.destroy();
            }
            
            chart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Coches',
                        data: data.map(c => ({
                            x: c.anio,
                            y: c.precio
                        })),
                        backgroundColor: 'rgba(102, 126, 234, 0.6)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 1,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Precio vs Año',
                            font: { size: 18 }
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    const car = data[ctx.dataIndex];
                                    return car.precio.toLocaleString() + '€ - ' + car.km.toLocaleString() + 'km';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: { display: true, text: 'Año' },
                            min: 2010,
                            max: 2026
                        },
                        y: {
                            title: { display: true, text: 'Precio (€)' },
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // Carga datos del servidor
        async function loadData() {
            try {
                const response = await fetch('/api/cars');
                const data = await response.json();
                
                if (data.length === 0) {
                    alert('No hay datos. Haz scrape primero.');
                    return;
                }
                
                drawChart(data);
                updateStats(data);
            } catch (error) {
                console.error('Error:', error);
                alert('Error cargando datos');
            }
        }
        
        // Actualiza estadísticas
        function updateStats(data) {
            const avgPrice = data.reduce((a, b) => a + b.precio, 0) / data.length;
            const avgYear = data.reduce((a, b) => a + b.anio, 0) / data.length;
            
            document.getElementById('totalCars').textContent = data.length;
            document.getElementById('avgPrice').textContent = Math.round(avgPrice).toLocaleString() + '€';
            document.getElementById('avgYear').textContent = Math.round(avgYear);
        }
        
        // Inicia scrape
        async function scrape() {
            const btn = document.querySelector('button');
            btn.textContent = '⏳ Scraping...';
            btn.disabled = true;
            
            try {
                const response = await fetch('/api/scrape', { method: 'POST' });
                const result = await response.json();
                
                if (result.success) {
                    await loadData();
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error durante el scrape');
            } finally {
                btn.textContent = '🔍 Buscar';
                btn.disabled = false;
            }
        }
        
        // Cargar datos automáticamente si existen
        loadData();
    </</script>
</body>
</html>`;

// Servidor HTTP simple
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.end(HTML_TEMPLATE);
  } else if (req.url === '/api/cars') {
    // Devolver últimos datos
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      res.end(JSON.stringify([]));
      return;
    }
    
    const latest = files.sort().pop();
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, latest)));
    res.end(JSON.stringify(data));
  } else if (req.url === '/api/scrape' && req.method === 'POST') {
    // Ejecutar scraper
    const { scrape } = require('./scraper');
    scrape().then(() => {
      res.end(JSON.stringify({ success: true }));
    }).catch(err => {
      res.end(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log('🚀 Servidor en http://localhost:' + PORT);
  console.log('Presiona Ctrl+C para detener');
});
