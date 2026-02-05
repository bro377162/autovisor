/**
 * API endpoint - Conecta a Supabase PostgreSQL
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración desde variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iuexkrukwvtxvxovvtux.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_jz1kLBugRlipnFWTpclCHg_ppXbWQd7';

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
  // CORS
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
      
      // Consulta a Supabase
      let query = supabase
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
      
      const { data: cars, error } = await query;
      
      if (error) {
        console.error('Supabase error:', error);
        res.status(500).json({ error: 'Database error', details: error.message });
        return;
      }
      
      res.status(200).json({
        coches: cars || [],
        total: cars?.length || 0,
        marca: 'Skoda',
        modelo: 'Karoq',
        fecha_actualizacion: new Date().toISOString()
      });
      
    } else if (req.url === '/api/all-models') {
      // Para comparación futura - ahora solo Skoda Karoq
      const { data: cars, error } = await supabase
        .from('coches')
        .select('*')
        .eq('activo', true);
      
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      
      res.status(200).json({
        'skoda-karoq': cars || []
      });
      
    } else if (req.url === '/api/stats') {
      const { data: cars, error } = await supabase
        .from('coches')
        .select('precio, anio, km, combustible')
        .eq('activo', true);
      
      if (error || !cars?.length) {
        res.status(200).json({ total: 0 });
        return;
      }
      
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
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
