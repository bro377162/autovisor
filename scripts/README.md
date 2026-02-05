# 🚗 Scraper de AutoScout24

## Instalación de dependencias

```bash
cd /Users/admin/.openclaw/workspace/coches-scraper
npm install
```

## Scripts disponibles

### 1. Generar datos de ejemplo (rápido, sin scraping)

```bash
# Añade 50 coches sin borrar los existentes
node scripts/seed-database.js seed 50

# Borra todo y añade 100 coches nuevos
node scripts/seed-database.js reset 100
```

### 2. Scraper real de AutoScout24 (lento, puede fallar por anti-bot)

```bash
# Buscar y scrapear Skoda Karoq (10 resultados)
node scripts/scraper-autoscout.js Skoda Karoq 10

# Otro modelo
node scripts/scraper-autoscout.js Audi A3 20
```

⚠️ **Nota:** AutoScout24 tiene protección anti-bot. El scraper usa Puppeteer con stealth mode pero puede ser bloqueado.

## Estrategia recomendada

1. **Para desarrollo/demo:** Usa `seed-database.js` - genera datos realistas al instante
2. **Para producción:** El scraper real cuando AutoScout24 no bloquee

## Datos generados

Los datos de ejemplo incluyen:
- 10 versiones diferentes del Skoda Karoq
- Variaciones realistas de precio, año y km
- Ubicaciones por toda España
- Combustible (Gasolina/Diésel) y transmisión (Manual/Automático)

## Estructura de datos

```javascript
{
  marca: "Skoda",
  modelo: "Karoq",
  version: "Style 1.5 TSI DSG",
  precio: 24500,
  anio: 2021,
  km: 25000,
  ubicacion: "Madrid",
  provincia: "Madrid",
  cv: 150,
  combustible: "Gasolina",
  cambio: "Automático",
  url_anuncio: "https://www.autoscout24.es/anuncios/...",
  activo: true
}
```
