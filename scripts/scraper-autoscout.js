/**
 * Scraper de AutoScout24 usando Puppeteer con stealth
 * Extrae datos de coches y los guarda en Supabase
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { createClient } = require('@supabase/supabase-js');

puppeteer.use(StealthPlugin());

// Configuración
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iuexkrukwvtxvxovvtux.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_jz1kLBugRlipnFWTpclCHg_ppXbWQd7';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Extrae datos de un anuncio de AutoScout24
 */
async function scrapeListing(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Esperar a que cargue el contenido
    await page.waitForTimeout(2000);
    
    const data = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : null;
      };
      
      const getPrice = () => {
        const text = getText('[data-testid="price"]') || getText('.price');
        if (!text) return null;
        const match = text.replace(/\./g, '').match(/(\d+)/);
        return match ? parseInt(match[1]) : null;
      };
      
      const getYear = () => {
        const text = getText('[data-testid="first-registration"]');
        if (!text) return null;
        const match = text.match(/(\d{4})/);
        return match ? parseInt(match[1]) : null;
      };
      
      const getKm = () => {
        const text = getText('[data-testid="mileage"]');
        if (!text) return null;
        const match = text.replace(/\./g, '').match(/(\d+)/);
        return match ? parseInt(match[1]) : null;
      };
      
      const getPower = () => {
        const text = getText('[data-testid="power"]');
        if (!text) return null;
        const match = text.match(/(\d+)\s*CV/);
        return match ? parseInt(match[1]) : null;
      };
      
      const getVersion = () => {
        // Título suele tener: "Skoda Karoq Style 1.5 TSI"
        const title = getText('h1') || '';
        const parts = title.replace(/Skoda\s+/i, '').replace(/Karoq\s+/i, '').trim();
        return parts || null;
      };
      
      const getFuel = () => {
        const text = getText('[data-testid="fuel-type"]') || '';
        if (text.includes('Di') || text.includes('Diesel')) return 'Diésel';
        if (text.includes('Gas')) return 'Gasolina';
        return text || null;
      };
      
      const getTransmission = () => {
        const text = getText('[data-testid="transmission-type"]') || '';
        if (text.includes('Auto')) return 'Automático';
        if (text.includes('Manual')) return 'Manual';
        return text || null;
      };
      
      const getLocation = () => {
        return getText('[data-testid="location"]') || getText('.location');
      };
      
      return {
        marca: 'Skoda',
        modelo: 'Karoq',
        version: getVersion(),
        precio: getPrice(),
        anio: getYear(),
        km: getKm(),
        cv: getPower(),
        combustible: getFuel(),
        cambio: getTransmission(),
        ubicacion: getLocation(),
        url_anuncio: window.location.href
      };
    });
    
    return data;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return null;
  }
}

/**
 * Busca URLs de anuncios en AutoScout24
 */
async function searchListings(marca, modelo, maxResults = 20) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const urls = [];
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    // URL de búsqueda de AutoScout24
    const searchUrl = `https://www.autoscout24.es/lst/${marca.toLowerCase()}/${modelo.toLowerCase()}?sort=price&desc=0`;
    
    console.log(`Buscando: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // Extraer URLs de anuncios
    const links = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid="list-item"] a, .cl-list-element a');
      return Array.from(items)
        .map(a => a.href)
        .filter(href => href.includes('/anuncios/'))
        .slice(0, 20);
    });
    
    urls.push(...links);
    console.log(`Encontrados ${urls.length} anuncios`);
    
  } catch (error) {
    console.error('Error en búsqueda:', error.message);
  } finally {
    await browser.close();
  }
  
  return urls.slice(0, maxResults);
}

/**
 * Guarda coches en Supabase
 */
async function saveToSupabase(coches) {
  let insertados = 0;
  let errores = 0;
  
  for (const coche of coches) {
    // Validar datos mínimos
    if (!coche.precio || !coche.anio || !coche.km) {
      console.log('Saltando coche sin datos completos:', coche.url_anuncio);
      continue;
    }
    
    try {
      const { error } = await supabase
        .from('coches')
        .upsert(coche, { onConflict: 'url_anuncio' });
      
      if (error) {
        console.error('Error guardando:', error);
        errores++;
      } else {
        insertados++;
        console.log(`✓ Guardado: ${coche.marca} ${coche.modelo} - ${coche.precio}€`);
      }
    } catch (e) {
      console.error('Error:', e.message);
      errores++;
    }
  }
  
  return { insertados, errores };
}

/**
 * Función principal
 */
async function main() {
  const marca = process.argv[2] || 'Skoda';
  const modelo = process.argv[3] || 'Karoq';
  const maxResults = parseInt(process.argv[4]) || 10;
  
  console.log(`🚗 Scraper AutoScout24 - ${marca} ${modelo}`);
  console.log(`Buscando ${maxResults} anuncios...\n`);
  
  // 1. Buscar URLs
  const urls = await searchListings(marca, modelo, maxResults);
  
  if (urls.length === 0) {
    console.log('❌ No se encontraron anuncios. Posible bloqueo de AutoScout24.');
    process.exit(1);
  }
  
  // 2. Scrapear cada anuncio
  console.log(`\n📄 Scrapeando ${urls.length} anuncios...\n`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const coches = [];
  
  try {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`[${i + 1}/${urls.length}] ${url}`);
      
      const page = await browser.newPage();
      const data = await scrapeListing(page, url);
      await page.close();
      
      if (data && data.precio) {
        coches.push(data);
      }
      
      // Espera entre requests para no ser baneado
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
    }
  } finally {
    await browser.close();
  }
  
  console.log(`\n✅ Scrapeados ${coches.length} coches válidos\n`);
  
  // 3. Guardar en Supabase
  if (coches.length > 0) {
    console.log('💾 Guardando en Supabase...');
    const result = await saveToSupabase(coches);
    console.log(`\n📊 Resultado:`);
    console.log(`  - Insertados/Actualizados: ${result.insertados}`);
    console.log(`  - Errores: ${result.errores}`);
  }
  
  console.log('\n✨ Listo!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { scrapeListing, searchListings, saveToSupabase };
