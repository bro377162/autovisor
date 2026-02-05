/**
 * API endpoint para datos de coches
 * Serverless function para Vercel
 */

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/api/cars' || req.url === '/') {
    // Datos de ejemplo con más campos
    const data = [
      { id: 1, marca: 'Audi', modelo: 'A3 Sportback', precio: 15200, anio: 2019, km: 45000, ubicacion: 'Barcelona', cv: 150 },
      { id: 2, marca: 'Audi', modelo: 'A3 Sedan', precio: 18500, anio: 2020, km: 32000, ubicacion: 'Madrid', cv: 150 },
      { id: 3, marca: 'Audi', modelo: 'A3 Sportback', precio: 22000, anio: 2021, km: 25000, ubicacion: 'Valencia', cv: 150 },
      { id: 4, marca: 'Audi', modelo: 'A3 Sedan', precio: 12000, anio: 2018, km: 68000, ubicacion: 'Sevilla', cv: 116 },
      { id: 5, marca: 'Audi', modelo: 'A3 Sportback', precio: 24500, anio: 2022, km: 15000, ubicacion: 'Madrid', cv: 150 },
      { id: 6, marca: 'Audi', modelo: 'A3 Sedan', precio: 16800, anio: 2019, km: 52000, ubicacion: 'Barcelona', cv: 150 },
      { id: 7, marca: 'Audi', modelo: 'A3 Sportback', precio: 19500, anio: 2020, km: 38000, ubicacion: 'Valencia', cv: 150 },
      { id: 8, marca: 'Audi', modelo: 'A3 Sedan', precio: 14200, anio: 2018, km: 72000, ubicacion: 'Bilbao', cv: 116 },
      { id: 9, marca: 'Audi', modelo: 'A3 Sportback', precio: 21000, anio: 2021, km: 28000, ubicacion: 'Madrid', cv: 150 },
      { id: 10, marca: 'Audi', modelo: 'A3 Sedan', precio: 23500, anio: 2022, km: 22000, ubicacion: 'Barcelona', cv: 150 }
    ];
    
    res.status(200).json(data);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
