# 🗄️ Plan de Migración a Base de Datos

## Opciones de BD Gratuitas Evaluadas

| Opción | Almacenamiento | Transferencia | Pros/Contras |
|--------|---------------|---------------|--------------|
| **Supabase** ⭐ | 500 MB | 2 GB/mes | ✅ PostgreSQL nativo, API REST, fácil Vercel |
| Neon | 3 GB (3 DBs) | Ilimitada | ✅ Serverless PostgreSQL, escalable |
| PlanetScale | 5 GB | 1B lecturas/mes | ⚠️ MySQL (no PostgreSQL), complejo |
| CockroachDB | 5 GB | - | ⚠️ Overkill para este proyecto |

## Recomendación: Supabase 🎯

**Capacidad:**
- 22,000 coches × ~300 bytes = ~6.6 MB
- 500 MB almacenamiento → **sobra 75x**

**Ventajas:**
- PostgreSQL nativo (migramos el schema.sql directamente)
- API REST automática (podemos simplificar la API)
- Dashboard visual para gestionar datos
- Row Level Security (seguridad)
- Conexión directa desde Vercel Functions

## Plan de Acción

### FASE 1: Configurar Supabase (20 min)
1. Crear cuenta en supabase.com
2. Crear proyecto nuevo
3. Ejecutar schema.sql en SQL Editor
4. Copiar URL y API Key (anon/public)
5. Guardar en variables de entorno de Vercel

### FASE 2: Migrar Datos (30 min)
1. Script para leer datos JSON y subir a Supabase
2. Insertar 75 coches Skoda Karoq de ejemplo
3. Verificar datos en Dashboard de Supabase

### FASE 3: Actualizar API (30 min)
1. Instalar cliente de Supabase (`@supabase/supabase-js`)
2. Reescribir `/api/index.js` para leer de Supabase
3. Mantener filtros funcionando (query con .gte(), .lte())
4. Mantener endpoint compatible con frontend actual

### FASE 4: Pruebas (20 min)
1. Verificar web carga datos de Supabase
2. Verificar filtros funcionan
3. Verificar tooltips muestran datos correctos
4. Medir tiempos de respuesta

## Schema Actualizado para Supabase

```sql
-- Habilitar RLS (Row Level Security)
alter table coches enable row level security;

-- Permitir lectura pública
create policy "Allow public read" on coches
  for select using (true);

-- Índices adicionales para Supabase
CREATE INDEX idx_coches_fulltext ON coches 
  USING gin(to_tsvector('spanish', modelo || ' ' || version));
```

## Variables de Entorno

```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

## Decisión Final

**Usamos Supabase** por:
- Capacidad más que suficiente (500MB vs 6.6MB necesarios)
- PostgreSQL nativo (sin cambiar el schema)
- API REST incluida (simplifica backend)
- Integración nativa con Vercel
- Dashboard para gestionar datos manualmente si hace falta

---

**¿Empezamos con la configuración de Supabase?**
