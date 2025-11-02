// Archivo: AutomationService.gs

/**
 * Procesa los datos de la hoja de automatizaciones y los convierte en un objeto de reglas.
 * Esta es la lógica de tu antigua función "autoNaim".
 * @param {Array<Array<any>>} automationData - Los datos crudos de la hoja de automatizaciones.
 * @returns {Object} Un objeto donde cada llave es el nombre de una automatización y su valor es la regla.
 */
function processAutomationRules(automationData) {
  const rules = {};
  const filteredData = automationData.map(row => row.filter(cell => cell !== ''));

  filteredData.forEach(ruleData => {
    const ruleName = ruleData[1];
    if (!ruleName) return; // Salta filas sin nombre de regla

    rules[ruleName] = {
      origen: ruleData[0]
    };

    // Itera sobre los pasos de la automatización
    for (let i = 2; i < ruleData.length; i += 6) {
      const stepName = ruleData[i];
      rules[ruleName][stepName] = {
        cuentaUsuario: ruleData[i + 1],
        tipo: ruleData[i + 2],
        iteradorCuenta: ruleData[i + 3], // NOTA: Este valor puede que ya no sea necesario con la nueva lógica.
        cantidad: ruleData[i + 4],
        concepto: ruleData[i + 5]
      };
    }
  });
  
  return rules;
}