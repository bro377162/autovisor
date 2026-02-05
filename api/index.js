/**
 * API endpoint para datos de coches
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.url.startsWith('/api/cars') || req.url === '/') {
    let cars = loadData();
    
    // Parsear query params
    const url = new URL(req.url, `http://${req.headers.host}`);
    const precioMin = parseInt(url.searchParams.get('precio_min')) || 0;
    const precioMax = parseInt(url.searchParams.get('precio_max')) || 999999;
    const anioMin = parseInt(url.searchParams.get('anio_min')) || 0;
    const anioMax = parseInt(url.searchParams.get('anio_max')) || 9999;
    const kmMin = parseInt(url.searchParams.get('km_min')) || 0;
    const kmMax = parseInt(url.searchParams.get('km_max')) || 999999;
    
    // Aplicar filtros
    cars = cars.filter(c => 
      c.precio >= precioMin && 
      c.precio <= precioMax &&
      c.anio >= anioMin &&
      c.anio <= anioMax &&
      c.km >= kmMin &&
      c.km <= kmMax
    );
    
    res.status(200).json({
      coches: cars,
      total: cars.length,
      marca: 'Skoda',
      modelo: 'Karoq',
      fecha_actualizacion: new Date().toISOString()
    });
  } else if (req.url === '/api/all-models') {
    // Devolver todos los modelos disponibles (para comparación)
    const cars = loadData();
    res.status(200).json({
      'skoda-karoq': cars
    });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
