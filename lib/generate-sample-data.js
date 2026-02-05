/**
 * Generador de datos de ejemplo para Skoda Karoq
 * Datos realistas basados en precios de mercado actual
 */

const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
  marca: 'Skoda',
  modelo: 'Karoq',
  cantidad: 75,
  anioMin: 2018,
  anioMax: 2024,
  precioMin: 16500,
  precioMax: 38500,
  kmMin: 5000,
  kmMax: 120000
};

// Versiones disponibles
const versiones = [
  'Ambition 1.0 TSI',
  'Ambition 1.5 TSI',
  'Ambition 2.0 TDI',
  'Style 1.0 TSI',
  'Style 1.5 TSI',
  'Style 2.0 TDI 4x4',
  'Scout 2.0 TDI 4x4',
  'Sportline 2.0 TSI 4x4',
  'Active 1.0 TSI'
];

// Ubicaciones españolas con provincias
const ubicaciones = [
  { ciudad: 'Madrid', provincia: 'Madrid' },
  { ciudad: 'Barcelona', provincia: 'Barcelona' },
  { ciudad: 'Valencia', provincia: 'Valencia' },
  { ciudad: 'Sevilla', provincia: 'Sevilla' },
  { ciudad: 'Bilbao', provincia: 'Vizcaya' },
  { ciudad: 'Málaga', provincia: 'Málaga' },
  { ciudad: 'Zaragoza', provincia: 'Zaragoza' },
  { ciudad: 'Alicante', provincia: 'Alicante' },
  { ciudad: 'Palma de Mallorca', provincia: 'Islas Baleares' },
  { ciudad: 'Murcia', provincia: 'Murcia' },
  { ciudad: 'Las Palmas', provincia: 'Las Palmas' },
  { ciudad: 'Valladolid', provincia: 'Valladolid' },
  { ciudad: 'Pamplona', provincia: 'Navarra' },
  { ciudad: 'Granada', provincia: 'Granada' },
  { ciudad: 'Tarragona', provincia: 'Tarragona' }
];

// Combustibles
const combustibles = ['Gasolina', 'Diésel'];

// Tipos de cambio
const cambios = ['Manual', 'Automático'];

// Potencias por combustible
const potencias = {
  'Gasolina': [115, 150, 190],
  'Diésel': [116, 150, 200]
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateCar(id) {
  const anio = randomInt(CONFIG.anioMin, CONFIG.anioMax);
  const version = randomItem(versiones);
  const ubicacion = randomItem(ubicaciones);
  const combustible = version.includes('TDI') ? 'Diésel' : randomItem(combustibles);
  const cv = randomItem(potencias[combustible]);
  
  // Cálculo de precio basado en año y km
  const depreciacionAnual = (CONFIG.anioMax - anio) * 2500;
  const factorKm = randomInt(CONFIG.kmMin, CONFIG.kmMax) / 10000 * 500;
  const precioBase = CONFIG.precioMax - depreciacionAnual - factorKm;
  const precio = Math.max(CONFIG.precioMin, Math.round(precioBase / 100) * 100);
  
  // KM basados en año (aprox 15k-25k km/año)
  const kmEstimados = (2024 - anio) * randomInt(15000, 25000) + randomInt(0, 10000);
  const km = Math.min(kmEstimados, CONFIG.kmMax);
  
  return {
    id,
    marca: CONFIG.marca,
    modelo: CONFIG.modelo,
    version,
    precio,
    anio,
    km,
    ubicacion: ubicacion.ciudad,
    provincia: ubicacion.provincia,
    cv,
    combustible,
    cambio: randomItem(cambios),
    url_anuncio: `https://www.autoscout24.es/anuncios/skoda-karoq-${id}`,
    fecha_scraped: new Date().toISOString(),
    activo: true
  };
}

function generateData() {
  console.log(`🚗 Generando ${CONFIG.cantidad} coches Skoda Karoq...\n`);
  
  const cars = [];
  for (let i = 1; i <= CONFIG.cantidad; i++) {
    cars.push(generateCar(i));
  }
  
  // Ordenar por precio
  cars.sort((a, b) => a.precio - b.precio);
  
  // Estadísticas
  const avgPrice = cars.reduce((a, b) => a + b.precio, 0) / cars.length;
  const avgYear = cars.reduce((a, b) => a + b.anio, 0) / cars.length;
  const avgKm = cars.reduce((a, b) => a + b.km, 0) / cars.length;
  
  console.log('📊 Estadísticas:');
  console.log(`   Total: ${cars.length} coches`);
  console.log(`   Precio medio: ${Math.round(avgPrice).toLocaleString()}€`);
  console.log(`   Año medio: ${Math.round(avgYear)}`);
  console.log(`   KM medio: ${Math.round(avgKm).toLocaleString()}`);
  console.log(`   Precio mín: ${cars[0].precio.toLocaleString()}€`);
  console.log(`   Precio máx: ${cars[cars.length - 1].precio.toLocaleString()}€`);
  
  // Guardar en archivo
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filename = path.join(dataDir, 'skoda-karoq-sample.json');
  fs.writeFileSync(filename, JSON.stringify(cars, null, 2));
  
  console.log(`\n💾 Guardado en: ${filename}`);
  
  return cars;
}

// Ejecutar
if (require.main === module) {
  generateData();
}

module.exports = { generateData, generateCar };
