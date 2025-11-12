// Archivo: ClientAPI.gs

/**
 * FUNCIÓN PARA EL FRONTEND
 * Obtiene los datos de las cuentas para mostrar en el resumen.
 * @returns {Array<Array<any>>} Los datos de la hoja matriz.
 */
function getAccountSummaryData() {
  return SheetAPI.getRecords(CONFIG.SHEET_NAMES.MATRIZ);
}

/**
 * FUNCIÓN PARA EL FRONTEND
 * Obtiene y procesa las reglas de automatización para el frontend.
 * @returns {Object} El objeto de reglas de automatización listo para usar.
 */
function getAutomationRules() {
  const automationData = getRecords(CONFIG.SHEET_NAMES.AUTOMATIZACIONES);
  return processAutomationRules(automationData);
}

/**
 * Recibe CUALQUIER registro del frontend y decide si es
 * un registro simple o una automatización.
 */
function addTransaction(data) {
  // 1. Obtenemos el "diccionario" de reglas
  const rules = getAutomationRules();

  // 2. ¡EL VALIDADOR!
  // Verificamos si existe una regla para esta Cartera Y este Concepto
  // Esta es tu "comprobación de coincidencia", pero sin un bucle 'for'
  const ruleSteps =
    rules[data.cartera] && rules[data.cartera][data.concepto]
      ? rules[data.cartera][data.concepto]
      : null;

  // 3. El IF/ELSE que propusiste
  if (ruleSteps) {
    // -------------------------------------------
    // CASO SÍ: Es una Automatización
    // -------------------------------------------
    console.log(`Ejecutando automatización: ${data.concepto}`);

    // Este es tu "for para iterar en el objeto"
    ruleSteps.forEach((step) => {
      // 'step' es el objeto: { cuenta: "NU", concepto: "Fondeo...", tipo: "Ingreso", cantidad: "x" }

      // A. Buscamos en qué HOJA vive esta cartera
      const stepHoja = _findHojaForCartera(step.cuenta);

      if (!stepHoja) {
        console.error(
          `Error de automatización: No se encontró una 'hoja' para la cartera "${step.cuenta}"`
        );
        return; // Salta este paso
      }

      // B. Calculamos los índices
      const walletIndex = CONFIG.WALLET_INDEX[stepHoja][step.cuenta];
      const typeIndex = CONFIG.TYPE_INDEX[step.tipo];
      const targetColumn = walletIndex + typeIndex + 1;

      // C. Calculamos la cantidad (interpretando "X", "95", etc.)
      const finalAmount = _calculateAmount(step.cantidad, data.cantidad);

      // D. Preparamos el registro para ESTE paso
      const record = [step.concepto, finalAmount];

      // E. Ejecutamos la escritura
      writeToNextEmptyRow(CONFIG.SHEET_NAMES[stepHoja], targetColumn, record);
    });
  } else {
    // -------------------------------------------
    // CASO NO: Es un Registro Simple
    // -------------------------------------------
    console.log("Ejecutando registro simple.");

    const walletIndex = CONFIG.WALLET_INDEX[data.hoja][data.cartera];
    const typeIndex = CONFIG.TYPE_INDEX[data.tipo];
    const hoja = CONFIG.SHEET_NAMES[data.hoja];

    if (walletIndex === undefined || typeIndex === undefined) {
      console.error(
        `Error: Cartera (${data.cartera}) o tipo (${data.tipo}) no reconocidos.`
      );
      return;
    }

    const targetColumn = walletIndex + typeIndex + 1;
    const record = [data.concepto, data.cantidad];

    writeToNextEmptyRow(hoja, targetColumn, record);
  }
}



function probarTransaccion(){
  const dataSimple = {
    hoja: "ENTRADAS",       // El nombre de la HOJA (de Config.gs)
    cartera: "BBVA",        // El nombre de la CARTERA (de Config.gs)
    tipo: "",       // El TIPO (de Config.gs)
    concepto: "Transferencia a NU", // Concepto simple
    cantidad: 36.3
  };
  addTransaction(dataSimple);
}

