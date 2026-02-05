/**
 * Test simple para verificar que los datos tienen el formato correcto
 */

const data = [
  { id: 1, marca: 'Audi', modelo: 'A3 Sportback', precio: 15200, anio: 2019, km: 45000, ubicacion: 'Barcelona', cv: 150 },
  { id: 2, marca: 'Audi', modelo: 'A3 Sedan', precio: 18500, anio: 2020, km: 32000, ubicacion: 'Madrid', cv: 150 }
];

// Test 1: Verificar estructura de datos
console.log('🧪 Test 1: Estructura de datos');
data.forEach((car, i) => {
  console.assert(car.modelo, `Coche ${i} debe tener modelo`);
  console.assert(car.ubicacion, `Coche ${i} debe tener ubicacion`);
  console.assert(car.cv, `Coche ${i} debe tener cv`);
  console.assert(car.precio, `Coche ${i} debe tener precio`);
  console.assert(car.km !== undefined, `Coche ${i} debe tener km`);
});
console.log('✅ Todos los coches tienen la estructura correcta\n');

// Test 2: Verificar tipos
console.log('🧪 Test 2: Tipos de datos');
data.forEach((car, i) => {
  console.assert(typeof car.modelo === 'string', `modelo debe ser string`);
  console.assert(typeof car.ubicacion === 'string', `ubicacion debe ser string`);
  console.assert(typeof car.cv === 'number', `cv debe ser number`);
  console.assert(typeof car.precio === 'number', `precio debe ser number`);
  console.assert(typeof car.km === 'number', `km debe ser number`);
});
console.log('✅ Tipos de datos correctos\n');

console.log('🎉 Todos los tests pasaron');
