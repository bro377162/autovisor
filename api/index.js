/**
 * API endpoint para datos de coches
 * Serverless function para Vercel
 */

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/api/cars' || req.url === '/') {
    // Datos de múltiples modelos para comparar
    const data = {
      'audi-a3': [
        { id: 1, marca: 'Audi', modelo: 'A3 Sportback', precio: 15200, anio: 2019, km: 45000, ubicacion: 'Barcelona', cv: 150 },
        { id: 2, marca: 'Audi', modelo: 'A3 Sedan', precio: 18500, anio: 2020, km: 32000, ubicacion: 'Madrid', cv: 150 },
        { id: 3, marca: 'Audi', modelo: 'A3 Sportback', precio: 22000, anio: 2021, km: 25000, ubicacion: 'Valencia', cv: 150 },
        { id: 4, marca: 'Audi', modelo: 'A3 Sedan', precio: 12000, anio: 2018, km: 68000, ubicacion: 'Sevilla', cv: 116 },
        { id: 5, marca: 'Audi', modelo: 'A3 Sportback', precio: 24500, anio: 2022, km: 15000, ubicacion: 'Madrid', cv: 150 }
      ],
      'bmw-serie3': [
        { id: 6, marca: 'BMW', modelo: 'Serie 3', precio: 25000, anio: 2019, km: 40000, ubicacion: 'Barcelona', cv: 184 },
        { id: 7, marca: 'BMW', modelo: 'Serie 3', precio: 28500, anio: 2020, km: 28000, ubicacion: 'Madrid', cv: 184 },
        { id: 8, marca: 'BMW', modelo: 'Serie 3', precio: 32000, anio: 2021, km: 20000, ubicacion: 'Valencia', cv: 184 },
        { id: 9, marca: 'BMW', modelo: 'Serie 3', precio: 22000, anio: 2018, km: 55000, ubicacion: 'Sevilla', cv: 150 },
        { id: 10, marca: 'BMW', modelo: 'Serie 3', precio: 35000, anio: 2022, km: 12000, ubicacion: 'Madrid', cv: 184 }
      ],
      'mercedes-clasea': [
        { id: 11, marca: 'Mercedes', modelo: 'Clase A', precio: 23000, anio: 2019, km: 35000, ubicacion: 'Barcelona', cv: 150 },
        { id: 12, marca: 'Mercedes', modelo: 'Clase A', precio: 26000, anio: 2020, km: 25000, ubicacion: 'Madrid', cv: 150 },
        { id: 13, marca: 'Mercedes', modelo: 'Clase A', precio: 29000, anio: 2021, km: 18000, ubicacion: 'Valencia', cv: 150 },
        { id: 14, marca: 'Mercedes', modelo: 'Clase A', precio: 20000, anio: 2018, km: 48000, ubicacion: 'Sevilla', cv: 116 },
        { id: 15, marca: 'Mercedes', modelo: 'Clase A', precio: 31000, anio: 2022, km: 10000, ubicacion: 'Madrid', cv: 150 }
      ]
    };
    
    res.status(200).json(data);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
