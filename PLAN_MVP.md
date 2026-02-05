# 🎯 Plan de Acción - MVP Autovisor

## Objetivo
Scraper de Skoda Karoq con BD, actualización diaria, y visualización web.

## Stack Tecnológico
- **Scraper:** Node.js + Cheerio
- **BD:** PostgreSQL (Vercel Postgres o Supabase)
- **API:** Vercel Serverless Functions
- **Frontend:** HTML + Chart.js (ya tenemos base)
- **Cron:** Vercel Cron Jobs

## Fases

### FASE 1: Configuración BD (30 min)
- [ ] Crear proyecto en Vercel con PostgreSQL
- [ ] Crear tabla `coches`:
  ```sql
  id, marca, modelo, precio, anio, km, 
  ubicacion, cv, url_anuncio, fecha_scraped, 
  created_at, updated_at
  ```
- [ ] Configurar variables de entorno

### FASE 2: Scraper Skoda Karoq (1h)
- [ ] Analizar URL de AutoScout24 para Skoda Karoq
- [ ] Scraper con paginación (obtener TODOS los resultados)
- [ ] Guardar en BD (insert o update si ya existe)
- [ ] Manejar errores y rate limiting
- [ ] Test: scrapear y verificar datos en BD

### FASE 3: API (30 min)
- [ ] Endpoint `/api/cars` que lea de PostgreSQL
- [ ] Filtros opcionales: precio_min, precio_max, anio_min, anio_max
- [ ] Ordenación por precio o año
- [ ] Caché de 1 hora en Vercel

### FASE 4: Web + Cron (30 min)
- [ ] Actualizar frontend para leer de nueva API
- [ ] Configurar cron en Vercel: cada 24h a las 04:00
- [ ] Script de scraper como Vercel Function o GitHub Action
- [ ] Testing completo

### FASE 5: Documentación (15 min)
- [ ] README con instrucciones
- [ ] Variables de entorno necesarias
- [ ] Cómo ejecutar scraper manualmente

## Checklist Pre-Producción
- [ ] Scraper funciona y obtiene todos los coches
- [ ] Datos se guardan correctamente en BD
- [ ] API responde rápido (< 500ms)
- [ ] Web muestra datos actualizados
- [ ] Cron programado correctamente
- [ ] Manejo de errores implementado

## Métricas de Éxito
- Scraper obtiene >50 coches
- Tiempo de scraper < 5 minutos
- API responde en < 500ms
- Web carga en < 2 segundos

---

**Estado:** Plan creado, pendiente aprobación para empezar Fase 1
