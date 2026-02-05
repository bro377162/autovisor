# Autovisor - Skoda Karoq

Visualizador de precios de Skoda Karoq de segunda mano.

## 🌐 Demo

https://autovisor.vercel.app

## 📊 Características

- **75 coches** Skoda Karoq con datos realistas
- Filtros por precio, año y kilómetros
- Gráfico interactivo (precio vs año)
- Tooltip detallado con información completa
- Tabla de coches filtrable

## 🛠️ Stack

- Frontend: HTML + Chart.js
- Backend: Node.js (Vercel Functions)
- Datos: JSON (PostgreSQL en próxima versión)
- Hosting: Vercel

## 📁 Datos

Los datos son de ejemplo generados con precios realistas del mercado español:
- Rango de precios: 15.000€ - 40.000€
- Años: 2018-2024
- Versiones: Ambition, Style, Scout, Sportline
- Ubicaciones: 15 ciudades españolas

## 🔮 Roadmap

- [ ] PostgreSQL para datos persistentes
- [ ] Scraper automático cada 24h
- [ ] Alertas de precios
- [ ] Histórico de precios
- [ ] Más modelos (Audi, BMW, Mercedes)
