# Configuración de Supabase

## Credenciales
- **URL:** https://iuexkrukwvtxvxovvtux.supabase.co
- **Anon Key:** sb_publishable_jz1kLBugRlipnFWTpclCHg_ppXbWQd7

## Paso 1: Crear la tabla (hacer manualmente)

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (en el menú lateral)
4. Pega el contenido de `schema-supabase.sql`
5. Click **Run**

Esto creará:
- Tabla `coches`
- Índices para búsquedas rápidas
- 10 coches de ejemplo (Skoda Karoq)

## Paso 2: Verificar datos

En SQL Editor, ejecuta:
```sql
SELECT COUNT(*) FROM coches;
```

Debería devolver: `10`

## Paso 3: Variables de entorno en Vercel

Añade estas variables en tu proyecto de Vercel:

```
SUPABASE_URL=https://iuexkrukwvtxvxovvtux.supabase.co
SUPABASE_ANON_KEY=sb_publishable_jz1kLBugRlipnFWTpclCHg_ppXbWQd7
```

Settings → Environment Variables → Add New

## Paso 4: Redeploy

Una vez configuradas las variables, redeploy en Vercel.

---

**¿Puedes ejecutar el schema SQL en Supabase?** Luego configuro la API.
