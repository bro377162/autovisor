/**
 * API endpoint para datos de coches
 * Lee del archivo JSON (temporal hasta tener PostgreSQL)
 */

const fs = require('fs');
const path = require('path');

// Leer datos del archivo
function loadData() {
  const dataPath = path.join(__dirname, '..', 'data', 'skoda-karoq-sample.json');
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error leyendo datos:', e);
    return [];
  }
}

module.exports = (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.url === '/api/cars' || req.url === '/') {
    let cars = loadData();
    
    // Parsear query params
    const url = new URL(req.url, `http://${req.headers.host}`);
    const precioMin = parseInt(url.searchParams.get('precio_min')) || 0;
    const precioMax = parseInt(url.searchParams.get('precio_max')) || 999999;
    const anioMin = parseInt(url.searchParams.get('anio_min')) || 0;
    const anioMax = parseInt(url.searchParams.get('anio_max')) || 9999;
    const kmMax = parseInt(url.searchParams.get('km_max')) || 999999;
    const orden = url.searchParams.get('orden') || 'precio'; // precio, anio, km
    
    // Aplicar filtros
    cars = cars.filter(c => 
      c.precio >= precioMin && 
      c.precio <= precioMax &&
      c.anio >= anioMin &&
      c.anio <= anioMax &&
      c.km <= kmMax
    );
    
    // Ordenar
    cars.sort((a, b) => {
      if (orden === 'precio') return a.precio - b.precio;
      if (orden === 'anio') return b.anio - a.anio; // Más nuevos primero
      if (orden === 'km') return a.km - b.km;
      return 0;
    });
    
    // Añadir metadatos
    const response = {
      total: cars.length,
      marca: 'Skoda',
      modelo: 'Karoq',
      fecha_actualizacion: new Date().toISOString(),
      filtros_aplicados: {
        precio_min: precioMin || undefined,
        precio_max: precioMax !== 999999 ? precioMax : undefined,
        anio_min: anioMin || undefined,
        anio_max: anioMax !== 9999 ? anioMax : undefined,
        km_max: kmMax !== 999999 ? kmMax : undefined
      },
      coches: cars
    };
    
    res.status(200).json(response);
  } else if (req.url === '/api/stats') {
    const cars = loadData();
    
    const stats = {
      total: cars.length,
      precio_medio: Math.round(cars.reduce((a, b) => a + b.precio, 0) / cars.length),
      precio_min: Math.min(...cars.map(c => c.precio)),
      precio_max: Math.max(...cars.map(c => c.precio)),
      anio_medio: Math.round(cars.reduce((a, b) => a + b.anio, 0) / cars.length),
      km_medio: Math.round(cars.reduce((a, b) => a + b.km, 0) / cars.length),
      por_combustible: {
        gasolina: cars.filter(c => c.combustible === 'Gasolina').length,
        diesel: cars.filter(c => c.combustible === 'Diésel').length
      }
    };
    
    res.status(200).json(stats);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
