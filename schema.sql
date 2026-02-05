-- Schema para PostgreSQL
-- Tabla de coches scrapeados

CREATE TABLE IF NOT EXISTS coches (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    version VARCHAR(100),
    precio INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    km INTEGER NOT NULL,
    ubicacion VARCHAR(100),
    provincia VARCHAR(50),
    cv INTEGER,
    combustible VARCHAR(20),
    cambio VARCHAR(20),
    url_anuncio TEXT UNIQUE NOT NULL,
    fuente VARCHAR(20) DEFAULT 'autoscout24',
    fecha_scraped TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_coches_marca_modelo ON coches(marca, modelo);
CREATE INDEX IF NOT EXISTS idx_coches_precio ON coches(precio);
CREATE INDEX IF NOT EXISTS idx_coches_anio ON coches(anio);
CREATE INDEX IF NOT EXISTS idx_coches_fecha ON coches(fecha_scraped);

-- Tabla para logs de scraping
CREATE TABLE IF NOT EXISTS scraper_logs (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    total_coches INTEGER,
    nuevos INTEGER,
    actualizados INTEGER,
    errores INTEGER,
    duracion_segundos INTEGER,
    ejecutado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exito BOOLEAN DEFAULT TRUE,
    mensaje_error TEXT
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_coches_updated_at ON coches;
CREATE TRIGGER update_coches_updated_at
    BEFORE UPDATE ON coches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
