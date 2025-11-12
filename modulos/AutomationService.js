/**
 * Procesa los datos de la hoja de automatizaciones y los convierte
 * en un objeto de reglas anidado y listo para usar.
 */
function processAutomationRules(automationData) {
  
  const rules = {}; // 1. Objeto final que vamos a construir

  // 2. Limpia los datos de celdas vacías
  const filteredData = automationData.map(row => row.filter(cell => cell !== ''));
  
  // 3. Itera sobre cada FILA (cada regla)
  filteredData.forEach(ruleData => {
    
    // 4. Extrae los dos primeros valores (la "llaves")
    const cuentaMadre = ruleData[0]; // ej: "BBVA"
    const ruleName = ruleData[1];    // ej: "Transferencia a NU"

    if (!ruleName) return; // Salta filas inválidas

    // 5. Asegura que el primer nivel del objeto exista
    // Si rules['BBVA'] no existe, lo crea como un objeto vacío {}
    if (!rules[cuentaMadre]) {
      rules[cuentaMadre] = {};
    }

    const stepsArray = []; // Array para guardar los pasos de esta regla

    // 6. ¡LA MAGIA! Itera sobre el resto de la fila en bloques de 4
    // Comienza en el índice 2 (después de cuentaMadre y ruleName)
    // Avanza de 4 en 4 (i += 4)
    for (let i = 2; i < ruleData.length; i += 4) {
      
      // Asegura que tengamos un bloque completo de 4
      if (i + 3 < ruleData.length) { 
        
        const step = {
          cuenta:   ruleData[i],
          concepto: ruleData[i + 1],
          tipo:     ruleData[i + 2],
          cantidad: ruleData[i + 3]
        };
        
        stepsArray.push(step);
      }
    }

    // 7. Asigna el array de pasos a su lugar en el objeto final
    // ej: rules["BBVA"]["Transferencia a NU"] = [ {paso1}, {paso2} ]
    rules[cuentaMadre][ruleName] = stepsArray;
  });

  // 8. ¡Listo!
  console.log("Objeto de Reglas Creado:");
  console.log(JSON.stringify(rules, null, 2)); // Imprime el objeto bonito
  return rules;
}

function probarAD(){
  const dt = getRecords(CONFIG.SHEET_NAMES.AUTOMATIZACIONES);
  processAutomationRules(dt);
};