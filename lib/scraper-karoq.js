/**
 * Scraper de AutoScout24 para Skoda Karoq
 * Extrae todos los coches disponibles y guarda en BD
 */

const https = require('https');
const { parse } = require('url');

// Configuración
const CONFIG = {
  marca: 'skoda',
  modelo: 'karoq',
  baseUrl: 'https://www.autoscout24.es/lst/skoda/karoq',
  maxPaginas: 20  // Máximo de páginas a scrapear (20 x 20 coches = 400 max)
};

/**
 * Hace petición HTTP GET
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.autoscout24.es',
      path: url.replace('https://www.autoscout24.es', ''),
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Cache-Control': 'no-cache'
      },
      timeout: 30000
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

/**
 * Parsea coches del HTML de AutoScout24
 * NOTA: La estructura puede cambiar, necesitamos adaptar esto
 */
function parseCars(html) {
  const cars = [];
  
  // Buscar datos JSON en el HTML (usualmente están en un script)
  const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/);
  
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      const listings = data.listings || [];
      
      listings.forEach(item => {
        if (item.title && item.price) {
          cars.push({
            marca: 'Skoda',
            modelo: 'Karoq',
            version: item.title.replace('Skoda Karoq', '').trim(),
            precio: parseInt(item.price.amount),
            anio: item.year || new Date().getFullYear(),
            km: parseInt(item.mileage) || 0,
            ubicacion: item.location?.city || 'Desconocido',
            provincia: item.location?.province || 'Desconocido',
            cv: item.power || 0,
            combustible: item.fuelType || 'Desconocido',
            cambio: item.gearType || 'Desconocido',
            url_anuncio: `https://www.autoscout24.es${item.url}`,
            fecha_scraped: new Date().toISOString()
          });
        }
      });
    } catch (e) {
      console.log('No se encontró JSON, intentando parseo alternativo...');
    }
  }
  
  // Si no hay datos JSON, intentar con regex (fallback)
  if (cars.length === 0) {
    // Buscar patrones de precio
    const priceMatches = html.match(/(\d{1,3}(?:\.\d{3})*)\s*€/g) || [];
    console.log(`Encontrados ${priceMatches.length} precios (fallback)`);
  }
  
  return cars;
}

/**
 * Función principal de scraping
 */
async function scrapeSkodaKaroq() {
  console.log('🚗 Iniciando scraper de Skoda Karoq...\n');
  
  const allCars = [];
  const inicio = Date.now();
  
  try {
    // Scraping de múltiples páginas
    for (let pagina = 1; pagina <= CONFIG.maxPaginas; pagina++) {
      const url = `${CONFIG.baseUrl}?sort=price&page=${pagina}`;
      console.log(`📄 Página ${pagina}: ${url}`);
      
      try {
        const html = await fetchHTML(url);
        const cars = parseCars(html);
        
        if (cars.length === 0) {
          console.log('   No más coches encontrados.');
          break;
        }
        
        allCars.push(...cars);
        console.log(`   ✅ ${cars.length} coches encontrados`);
        
        // Esperar entre peticiones para no saturar
        if (pagina < CONFIG.maxPaginas) {
          await new Promise(r => setTimeout(r, 1000));
        }
        
      } catch (error) {
        console.error(`   ❌ Error página ${pagina}:`, error.message);
        continue;
      }
    }
    
    const duracion = Math.round((Date.now() - inicio) / 1000);
    
    console.log(`\n📊 RESUMEN:`);
    console.log(`   Total coches: ${allCars.length}`);
    console.log(`   Páginas scrapeadas: ${Math.ceil(allCars.length / 20)}`);
    console.log(`   Duración: ${duracion}s`);
    
    if (allCars.length > 0) {
      const avgPrice = allCars.reduce((a, b) => a + b.precio, 0) / allCars.length;
      const avgYear = allCars.reduce((a, b) => a + b.anio, 0) / allCars.length;
      console.log(`   Precio medio: ${Math.round(avgPrice).toLocaleString()}€`);
      console.log(`   Año medio: ${Math.round(avgYear)}`);
    }
    
    return allCars;
    
  } catch (error) {
    console.error('❌ Error general:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  scrapeSkodaKaroq()
    .then(cars => {
      console.log(`\n💾 Listo para guardar ${cars.length} coches en BD`);
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { scrapeSkodaKaroq, parseCars };
