/**
 * Scraper alternativo usando fetch (sin browser)
 * Fallback si Puppeteer es bloqueado
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iuexkrukwvtxvxovvtux.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_jz1kLBugRlipnFWTpclCHg_ppXbWQd7';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Genera datos de ejemplo realistas basados en tendencias de mercado
 * Útil cuando el scraping falla
 */
function generateSampleData(count = 20) {
  const versiones = [
    { nombre: 'Active 1.0 TSI', cv: 115, combustible: 'Gasolina', cambio: 'Manual', basePrice: 17500, baseYear: 2018, baseKm: 60000 },
    { nombre: 'Ambition 1.0 TSI', cv: 115, combustible: 'Gasolina', cambio: 'Manual', basePrice: 19000, baseYear: 2019, baseKm: 45000 },
    { nombre: 'Ambition 1.5 TSI', cv: 150, combustible: 'Gasolina', cambio: 'Manual', basePrice: 21500, baseYear: 2020, baseKm: 35000 },
    { nombre: 'Ambition 2.0 TDI', cv: 150, combustible: 'Diésel', cambio: 'Manual', basePrice: 23000, baseYear: 2020, baseKm: 40000 },
    { nombre: 'Style 1.5 TSI DSG', cv: 150, combustible: 'Gasolina', cambio: 'Automático', basePrice: 24500, baseYear: 2021, baseKm: 28000 },
    { nombre: 'Style 1.6 TDI', cv: 116, combustible: 'Diésel', cambio: 'Manual', basePrice: 20500, baseYear: 2019, baseKm: 50000 },
    { nombre: 'Style 2.0 TDI 4x4', cv: 150, combustible: 'Diésel', cambio: 'Automático', basePrice: 27000, baseYear: 2021, baseKm: 30000 },
    { nombre: 'Scout 2.0 TDI 4x4', cv: 150, combustible: 'Diésel', cambio: 'Automático', basePrice: 29000, baseYear: 2022, baseKm: 20000 },
    { nombre: 'Sportline 2.0 TDI', cv: 200, combustible: 'Diésel', cambio: 'Automático', basePrice: 28000, baseYear: 2021, baseKm: 25000 },
    { nombre: 'Sportline 2.0 TSI 4x4', cv: 190, combustible: 'Gasolina', cambio: 'Automático', basePrice: 32000, baseYear: 2022, baseKm: 15000 }
  ];
  
  const provincias = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Alicante', 'Murcia', 'Zaragoza', 'Bilbao', 'Valladolid'];
  
  const coches = [];
  
  for (let i = 0; i < count; i++) {
    const version = versiones[Math.floor(Math.random() * versiones.length)];
    const provincia = provincias[Math.floor(Math.random() * provincias.length)];
    
    // Variaciones realistas
    const yearVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
    const kmVariation = Math.floor(Math.random() * 20000) - 10000;
    const priceVariation = Math.floor(Math.random() * 4000) - 2000;
    
    coches.push({
      marca: 'Skoda',
      modelo: 'Karoq',
      version: version.nombre,
      precio: version.basePrice + priceVariation,
      anio: version.baseYear + yearVariation,
      km: Math.max(5000, version.baseKm + kmVariation),
      ubicacion: provincia,
      provincia: provincia,
      cv: version.cv,
      combustible: version.combustible,
      cambio: version.cambio,
      url_anuncio: `https://www.autoscout24.es/anuncios/demo-${Date.now()}-${i}`,
      activo: true
    });
  }
  
  return coches;
}

/**
 * Inserta datos de ejemplo en Supabase
 */
async function seedDatabase(count = 50) {
  console.log(`🌱 Generando ${count} coches de ejemplo...`);
  
  const coches = generateSampleData(count);
  
  let insertados = 0;
  
  for (const coche of coches) {
    try {
      const { error } = await supabase
        .from('coches')
        .upsert(coche, { onConflict: 'url_anuncio' });
      
      if (!error) {
        insertados++;
        process.stdout.write('.');
      }
    } catch (e) {
      process.stdout.write('x');
    }
  }
  
  console.log(`\n\n✅ Insertados ${insertados}/${count} coches`);
  return insertados;
}

/**
 * Limpia la tabla y reinserta
 */
async function resetAndSeed(count = 50) {
  console.log('🗑️  Limpiando tabla...');
  
  try {
    await supabase.from('coches').delete().neq('id', 0);
    console.log('✅ Tabla limpiada');
  } catch (e) {
    console.log('⚠️  No se pudo limpiar:', e.message);
  }
  
  return await seedDatabase(count);
}

// CLI
if (require.main === module) {
  const command = process.argv[2];
  const count = parseInt(process.argv[3]) || 50;
  
  switch (command) {
    case 'seed':
      seedDatabase(count).then(() => process.exit(0));
      break;
    case 'reset':
      resetAndSeed(count).then(() => process.exit(0));
      break;
    default:
      console.log('Uso: node scripts/seed-database.js [seed|reset] [cantidad]');
      console.log('  seed  - Añade coches sin borrar los existentes');
      console.log('  reset - Borra todo y añade nuevos coches');
      process.exit(1);
  }
}

module.exports = { generateSampleData, seedDatabase, resetAndSeed };
