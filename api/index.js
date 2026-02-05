/**
 * API endpoint - Intenta Supabase, fallback a JSON
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iuexkrukwvtxvxovvtux.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_jz1kLBugRlipnFWTpclCHg_ppXbWQd7';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fallback: leer de JSON
function loadDataFromFile() {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'skoda-karoq-sample.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.log('Fallback a datos de ejemplo:', e.message);
    return [];
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    if (req.url.startsWith('/api/cars') || req.url === '/') {
      // Parsear query params
      const url = new URL(req.url, `http://${req.headers.host}`);
      const precioMin = parseInt(url.searchParams.get('precio_min')) || 0;
      const precioMax = parseInt(url.searchParams.get('precio_max')) || 999999;
      const anioMin = parseInt(url.searchParams.get('anio_min')) || 0;
      const anioMax = parseInt(url.searchParams.get('anio_max')) || 9999;
      const kmMin = parseInt(url.searchParams.get('km_min')) || 0;
      const kmMax = parseInt(url.searchParams.get('km_max')) || 999999;
      
      let cars = [];
      let usingFallback = false;
      
      // Intentar Supabase primero
      try {
        const { data, error } = await supabase
          .from('coches')
          .select('*')
          .eq('activo', true)
          .gte('precio', precioMin)
          .lte('precio', precioMax)
          .gte('anio', anioMin)
          .lte('anio', anioMax)
          .gte('km', kmMin)
          .lte('km', kmMax)
          .order('precio', { ascending: true });
        
        if (error) throw error;
        cars = data || [];
      } catch (dbError) {
        console.log('Supabase falló, usando fallback:', dbError.message);
        cars = loadDataFromFile();
        usingFallback = true;
        
        // Aplicar filtros manualmente al fallback
        cars = cars.filter(c => 
          c.precio >= precioMin && c.precio <= precioMax &&
          c.anio >= anioMin && c.anio <= anioMax &&
          c.km >= kmMin && c.km <= kmMax
        );
      }
      
      res.status(200).json({
        coches: cars,
        total: cars.length,
        marca: 'Skoda',
        modelo: 'Karoq',
        fecha_actualizacion: new Date().toISOString(),
        fallback: usingFallback
      });
      
    } else if (req.url === '/api/all-models') {
      let cars = [];
      
      try {
        const { data, error } = await supabase
          .from('coches')
          .select('*')
          .eq('activo', true);
        
        if (error) throw error;
        cars = data || [];
      } catch (e) {
        cars = loadDataFromFile();
      }
      
      res.status(200).json({ 'skoda-karoq': cars });
      
    } else {
      res.status(404).json({ error: 'Not found' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    // Último fallback
    const fallbackCars = loadDataFromFile();
    res.status(200).json({
      coches: fallbackCars,
      total: fallbackCars.length,
      fallback: true,
      error: error.message
    });
  }
};
