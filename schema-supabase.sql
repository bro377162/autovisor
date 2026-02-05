-- Schema para Supabase
-- Ejecutar esto en el SQL Editor de Supabase

-- Crear tabla de coches
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
    url_anuncio TEXT UNIQUE,
    fuente VARCHAR(20) DEFAULT 'autoscout24',
    fecha_scraped TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Habilitar Row Level Security
ALTER TABLE coches ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura pública
CREATE POLICY "Allow public read" ON coches
    FOR SELECT USING (true);

-- Política: Permitir inserción/actualización solo desde API (usando service_role)
CREATE POLICY "Allow insert via API" ON coches
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update via API" ON coches
    FOR UPDATE USING (true);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_coches_marca_modelo ON coches(marca, modelo);
CREATE INDEX IF NOT EXISTS idx_coches_precio ON coches(precio);
CREATE INDEX IF NOT EXISTS idx_coches_anio ON coches(anio);
CREATE INDEX IF NOT EXISTS idx_coches_km ON coches(km);
CREATE INDEX IF NOT EXISTS idx_coches_fecha ON coches(fecha_scraped);
CREATE INDEX IF NOT EXISTS idx_coches_activo ON coches(activo);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_coches_updated_at ON coches;
CREATE TRIGGER update_coches_updated_at
    BEFORE UPDATE ON coches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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

-- Política para logs: solo lectura pública
ALTER TABLE scraper_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read logs" ON scraper_logs
    FOR SELECT USING (true);

-- Insertar datos de ejemplo (Skoda Karoq)
INSERT INTO coches (marca, modelo, version, precio, anio, km, ubicacion, provincia, cv, combustible, cambio, url_anuncio, fuente) VALUES
('Skoda', 'Karoq', 'Ambition 1.0 TSI', 19200, 2019, 45000, 'Barcelona', 'Barcelona', 115, 'Gasolina', 'Manual', 'https://www.autoscout24.es/anuncios/skoda-karoq-001', 'demo'),
('Skoda', 'Karoq', 'Ambition 1.5 TSI', 21800, 2020, 32000, 'Madrid', 'Madrid', 150, 'Gasolina', 'Manual', 'https://www.autoscout24.es/anuncios/skoda-karoq-002', 'demo'),
('Skoda', 'Karoq', 'Style 1.5 TSI DSG', 24500, 2021, 25000, 'Valencia', 'Valencia', 150, 'Gasolina', 'Automático', 'https://www.autoscout24.es/anuncios/skoda-karoq-003', 'demo'),
('Skoda', 'Karoq', 'Style 2.0 TDI 4x4', 26900, 2021, 28000, 'Madrid', 'Madrid', 150, 'Diésel', 'Automático', 'https://www.autoscout24.es/anuncios/skoda-karoq-004', 'demo'),
('Skoda', 'Karoq', 'Scout 2.0 TDI 4x4', 28900, 2022, 18000, 'Barcelona', 'Barcelona', 150, 'Diésel', 'Automático', 'https://www.autoscout24.es/anuncios/skoda-karoq-005', 'demo'),
('Skoda', 'Karoq', 'Sportline 2.0 TSI 4x4', 32500, 2022, 12000, 'Madrid', 'Madrid', 190, 'Gasolina', 'Automático', 'https://www.autoscout24.es/anuncios/skoda-karoq-006', 'demo'),
('Skoda', 'Karoq', 'Active 1.0 TSI', 16800, 2018, 68000, 'Sevilla', 'Sevilla', 115, 'Gasolina', 'Manual', 'https://www.autoscout24.es/anuncios/skoda-karoq-007', 'demo'),
('Skoda', 'Karoq', 'Ambition 2.0 TDI', 23400, 2020, 42000, 'Bilbao', 'Vizcaya', 150, 'Diésel', 'Manual', 'https://www.autoscout24.es/anuncios/skoda-karoq-008', 'demo'),
('Skoda', 'Karoq', 'Style 1.6 TDI', 20500, 2019, 52000, 'Zaragoza', 'Zaragoza', 116, 'Diésel', 'Manual', 'https://www.autoscout24.es/anuncios/skoda-karoq-009', 'demo'),
('Skoda', 'Karoq', 'Sportline 2.0 TDI', 27800, 2021, 22000, 'Valencia', 'Valencia', 200, 'Diésel', 'Automático', 'https://www.autoscout24.es/anuncios/skoda-karoq-010', 'demo')
ON CONFLICT (url_anuncio) DO UPDATE SET
    precio = EXCLUDED.precio,
    km = EXCLUDED.km,
    updated_at = CURRENT_TIMESTAMP,
    activo = true;

-- Verificar inserción
SELECT COUNT(*) as total_coches FROM coches;
