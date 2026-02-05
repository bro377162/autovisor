/**
 * API endpoint para datos de coches
 * Serverless function para Vercel
 */

const fs = require('fs');
const path = require('path');

// Datos de ejemplo (en producción vendrían de una BD o se scrapearían)
const sampleData = [
  { id: 1, marca: 'Audi', modelo: 'A3', precio: 15200, anio: 2019, km: 45000 },
  { id: 2, marca: 'Audi', modelo: 'A3', precio: 18500, anio: 2020, km: 32000 },
  { id: 3, marca: 'Audi', modelo: 'A3', precio: 22000, anio: 2021, km: 25000 },
  { id: 4, marca: 'Audi', modelo: 'A3', precio: 12000, anio: 2018, km: 68000 },
  { id: 5, marca: 'Audi', modelo: 'A3', precio: 24500, anio: 2022, km: 15000 },
  { id: 6, marca: 'Audi', modelo: 'A3', precio: 16800, anio: 2019, km: 52000 },
  { id: 7, marca: 'Audi', modelo: 'A3', precio: 19500, anio: 2020, km: 38000 },
  { id: 8, marca: 'Audi', modelo: 'A3', precio: 14200, anio: 2018, km: 72000 },
  { id: 9, marca: 'Audi', modelo: 'A3', precio: 21000, anio: 2021, km: 28000 },
  { id: 10, marca: 'Audi', modelo: 'A3', precio: 23500, anio: 2022, km: 22000 }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/api/cars' || req.url === '/') {
    res.status(200).json(sampleData);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
