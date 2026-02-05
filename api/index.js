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
        { id: 3, marca: 'Audi', modelo: 'A3 Sportback', precio: 22000, anio: 2021, km: 25000, ubicacion: 'Valencia', cv: 150 }
      ],
      'audi-a4': [
        { id: 4, marca: 'Audi', modelo: 'A4 Avant', precio: 28000, anio: 2019, km: 38000, ubicacion: 'Madrid', cv: 190 },
        { id: 5, marca: 'Audi', modelo: 'A4 Sedan', precio: 32000, anio: 2020, km: 25000, ubicacion: 'Barcelona', cv: 190 }
      ],
      'audi-q5': [
        { id: 6, marca: 'Audi', modelo: 'Q5', precio: 35000, anio: 2019, km: 42000, ubicacion: 'Valencia', cv: 190 },
        { id: 7, marca: 'Audi', modelo: 'Q5 Sportback', precio: 42000, anio: 2021, km: 18000, ubicacion: 'Madrid', cv: 190 }
      ],
      'bmw-serie3': [
        { id: 8, marca: 'BMW', modelo: 'Serie 3', precio: 25000, anio: 2019, km: 40000, ubicacion: 'Barcelona', cv: 184 },
        { id: 9, marca: 'BMW', modelo: 'Serie 3', precio: 28500, anio: 2020, km: 28000, ubicacion: 'Madrid', cv: 184 }
      ],
      'bmw-serie5': [
        { id: 10, marca: 'BMW', modelo: 'Serie 5', precio: 38000, anio: 2019, km: 35000, ubicacion: 'Barcelona', cv: 231 },
        { id: 11, marca: 'BMW', modelo: 'Serie 5', precio: 45000, anio: 2021, km: 20000, ubicacion: 'Madrid', cv: 231 }
      ],
      'bmw-x3': [
        { id: 12, marca: 'BMW', modelo: 'X3', precio: 42000, anio: 2020, km: 30000, ubicacion: 'Valencia', cv: 190 },
        { id: 13, marca: 'BMW', modelo: 'X3', precio: 48000, anio: 2022, km: 15000, ubicacion: 'Barcelona', cv: 190 }
      ],
      'mercedes-clasea': [
        { id: 14, marca: 'Mercedes', modelo: 'Clase A', precio: 23000, anio: 2019, km: 35000, ubicacion: 'Barcelona', cv: 150 },
        { id: 15, marca: 'Mercedes', modelo: 'Clase A', precio: 26000, anio: 2020, km: 25000, ubicacion: 'Madrid', cv: 150 }
      ],
      'mercedes-clasec': [
        { id: 16, marca: 'Mercedes', modelo: 'Clase C', precio: 32000, anio: 2019, km: 38000, ubicacion: 'Madrid', cv: 170 },
        { id: 17, marca: 'Mercedes', modelo: 'Clase C', precio: 38000, anio: 2021, km: 22000, ubicacion: 'Barcelona', cv: 170 }
      ],
      'mercedes-gla': [
        { id: 18, marca: 'Mercedes', modelo: 'GLA', precio: 28000, anio: 2020, km: 32000, ubicacion: 'Valencia', cv: 150 },
        { id: 19, marca: 'Mercedes', modelo: 'GLA', precio: 34000, anio: 2022, km: 18000, ubicacion: 'Madrid', cv: 150 }
      ]
    };
    
    res.status(200).json(data);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
