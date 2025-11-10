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
  const automationData = SheetAPI.getRecords(CONFIG.SHEET_NAMES.AUTOMATIZACIONES);
  return AutomationService.processAutomationRules(automationData);
}



/**
 * FUNCIÓN PARA EL FRONTEND
 * Recibe un registro del formulario y lo escribe en la hoja y bloque correctos.
 *
 * @param {Object} data - Objeto con los datos. 
 * Ej: { hoja: "Entradas", cartera: "BBVA BLANCA", tipo: "Egreso", concepto: "Café", cantidad: 50 }
 */
function addTransaction(data) {
  
  // 1. Obtenemos los índices de la configuración
  const walletIndex = CONFIG.WALLET_INDEX[data.hoja][data.cartera];
  const typeIndex = CONFIG.TYPE_INDEX[data.tipo];
  const hoja = CONFIG.SHEET_NAMES[data.hoja];

  // 2. Verificamos que todo exista
  if (walletIndex === undefined || typeIndex === undefined) {
    console.error(`Error: Cartera (${data.cartera}) o tipo (${data.tipo}) no reconocidos.`);
    return;
  }

  // 3. Calculamos la columna final (ej. 6 + 3 = 9)
  // Sumamos 1 porque las columnas en getRange() empiezan en 1, no en 0.
  const targetColumn = walletIndex + typeIndex + 1;

  // 4. Preparamos el registro
  const record = [
    data.concepto,
    data.cantidad
  ];


  console.log("Hoja: " + hoja);
  console.log("Terjet/Columna: " + targetColumn);
  console.log("grabación: ",record);
  
  // 5. Llamamos a la nueva función de SheetAPI
  writeToNextEmptyRow(hoja, targetColumn, record);
}


function prueba(){
  const hj = "INVERSIONES";
  const ct = "Fondo de Inversion";
  const obj = {
    hoja: hj,
    cartera: ct,
    tipo: "Ingreso",
    concepto: "APROBADO POR CHAYYANE INGRESO",
    cantidad: 100
  }
  const obj2 = {
    hoja: hj,
    cartera: ct,
    tipo: "Egreso",
    concepto: "APROBADO POR CHAYYANE EGRESO",
    cantidad: 100
  }
  addTransaction(obj);
  addTransaction(obj2);
}











