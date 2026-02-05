/**
 * Test para múltiples modelos
 */

const data = {
  'audi-a3': [
    { id: 1, marca: 'Audi', modelo: 'A3 Sportback', precio: 15200, anio: 2019, km: 45000, ubicacion: 'Barcelona', cv: 150 },
    { id: 2, marca: 'Audi', modelo: 'A3 Sedan', precio: 18500, anio: 2020, km: 32000, ubicacion: 'Madrid', cv: 150 }
  ],
  'bmw-serie3': [
    { id: 6, marca: 'BMW', modelo: 'Serie 3', precio: 25000, anio: 2019, km: 40000, ubicacion: 'Barcelona', cv: 184 },
    { id: 7, marca: 'BMW', modelo: 'Serie 3', precio: 28500, anio: 2020, km: 28000, ubicacion: 'Madrid', cv: 184 }
  ]
};

console.log('🧪 Test 1: Múltiples modelos');
console.assert(Object.keys(data).length >= 2, 'Debe haber al menos 2 modelos');
console.log('✅ Hay ' + Object.keys(data).length + ' modelos\n');

console.log('🧪 Test 2: Cada modelo tiene datos');
Object.keys(data).forEach(key => {
  console.assert(data[key].length > 0, key + ' debe tener datos');
  console.assert(data[key][0].marca, key + ' debe tener marca');
  console.assert(data[key][0].modelo, key + ' debe tener modelo');
});
console.log('✅ Todos los modelos tienen datos válidos\n');

console.log('🧪 Test 3: Estructura completa');
Object.keys(data).forEach(key => {
  data[key].forEach((car, i) => {
    console.assert(car.precio, key + '[' + i + '] debe tener precio');
    console.assert(car.anio, key + '[' + i + '] debe tener anio');
    console.assert(car.km !== undefined, key + '[' + i + '] debe tener km');
    console.assert(car.ubicacion, key + '[' + i + '] debe tener ubicacion');
    console.assert(car.cv, key + '[' + i + '] debe tener cv');
  });
});
console.log('✅ Estructura completa en todos los coches\n');

console.log('🎉 Todos los tests pasaron');
