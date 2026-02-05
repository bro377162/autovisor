/**
 * Scraper de AutoScout24 - Versión simple sin dependencias
 * Extrae datos de coches y los guarda en JSON
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
  marca: 'audi',
  modelo: 'a3',
  urlBase: 'https://www.autoscout24.es/lst/audi/a3',
  dataDir: path.join(__dirname, '..', 'data')
};

// Crear directorio de datos si no existe
if (!fs.existsSync(CONFIG.dataDir)) {
  fs.mkdirSync(CONFIG.dataDir, { recursive: true });
}

/**
 * Hace una petición HTTP GET y devuelve el HTML
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Parsea el HTML y extrae datos de coches
 * Usa expresiones regulares simples (sin cheerio)
 */
function parseCars(html) {
  const cars = [];
  
  // Buscar precios (formato: € X.XXX)
  const priceMatches = html.match(/€\s*[\d.]+/g) || [];
  
  // Buscar años (formato: 20XX)
  const yearMatches = html.match(/20[0-2]\d/g) || [];
  
  // Buscar km (formato: X.XXX km)
  const kmMatches = html.match(/[\d.]+\s*km/gi) || [];
  
  console.log(`Encontrados: ${priceMatches.length} precios, ${yearMatches.length} años, ${kmMatches.length} km`);
  
  // Combinar datos (simplificado)
  const maxItems = Math.min(priceMatches.length, yearMatches.length, kmMatches.length);
  
  for (let i = 0; i < maxItems; i++) {
    const price = parseInt(priceMatches[i].replace(/[€\s.]/g, ''));
    const year = parseInt(yearMatches[i]);
    const km = parseInt(kmMatches[i].replace(/[\skm.]/gi, ''));
    
    if (price && year && km) {
      cars.push({
        id: i + 1,
        marca: CONFIG.marca,
        modelo: CONFIG.modelo,
        precio: price,
        anio: year,
        km: km,
        fechaScrapeo: new Date().toISOString()
      });
    }
  }
  
  return cars;
}

/**
 * Guarda datos en JSON
 */
function saveData(cars) {
  const filename = path.join(CONFIG.dataDir, `${CONFIG.marca}-${CONFIG.modelo}-${Date.now()}.json`);
  fs.writeFileSync(filename, JSON.stringify(cars, null, 2));
  console.log(`💾 Guardados ${cars.length} coches en ${filename}`);
  return filename;
}

/**
 * Función principal
 */
async function scrape() {
  console.log('🚗 Iniciando scraper de AutoScout24...');
  console.log(`Buscando: ${CONFIG.marca} ${CONFIG.modelo}`);
  
  try {
    const html = await fetchHTML(CONFIG.urlBase);
    console.log('📄 HTML descargado');
    
    const cars = parseCars(html);
    
    if (cars.length === 0) {
      console.log('⚠️ No se encontraron coches. Posible cambio en la estructura de la web.');
      return;
    }
    
    const filename = saveData(cars);
    
    console.log('\n📊 Resumen:');
    console.log(`- Total coches: ${cars.length}`);
    console.log(`- Precio medio: ${(cars.reduce((a, b) => a + b.precio, 0) / cars.length).toFixed(0)}€`);
    console.log(`- Año medio: ${(cars.reduce((a, b) => a + b.anio, 0) / cars.length).toFixed(0)}`);
    console.log(`- KM medio: ${(cars.reduce((a, b) => a + b.km, 0) / cars.length / 1000).toFixed(1)}k`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  scrape();
}

module.exports = { scrape, parseCars };
