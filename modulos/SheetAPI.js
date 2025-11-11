// Archivo: SheetAPI.gs

// --- Conexión Principal ---
// Abre la hoja de cálculo usando el ID de la configuración.
const libro = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

/**
 * Obtiene todos los datos de una hoja específica.
 * @param {string} sheetName - El nombre de la hoja de la que se quieren obtener los datos.
 * @returns {Array<Array<any>>} Un arreglo bidimensional con los valores de la hoja.
 */
function getRecords(sheetName) {
  try {
    // Intenta obtener la hoja
    var data;
    const sheet = libro.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`La hoja "${sheetName}" no fue encontrada.`);
    }
    console.log(`Leyendo los datos de la hoja "${sheetName}"...`);
 
    data = sheet.getDataRange().getValues();
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Error al leer la hoja "${sheetName}": ${error}`);
    return []; // Devuelve un arreglo vacío en caso de error.
  }
}


/**
 * Escribe en un bloque de 3 columnas (Concepto, Cantidad, Fecha)
 * buscando la primera fila vacía.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - La hoja donde se va a escribir.
 * @param {number} startColumn - El número de la columna donde empieza el bloque (ej. 9).
 * @param {Array<any>} record - El arreglo de datos [concepto, cantidad].
 */
function writeToNextEmptyRow(sheetName, startColumn, record) {
  try {
    const sheet = libro.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Hoja no encontrada: ${sheetName}`);
    }

    let celdaY = 5; // Fila donde empiezan los registros
    let celdaConcepto = sheet.getRange(celdaY, startColumn);
    
    /* Aqui Gemini conservo la logica original del algoritmo, 
    * que era recorrer verticalmente las celdas. 
    */
    while (celdaConcepto.getValue() != "") {
      celdaY++;
      celdaConcepto = sheet.getRange(celdaY, startColumn);
    }
    
    // Escribimos en las celdas correspondientes
    celdaConcepto.setValue(record[0]);                     // Concepto
    sheet.getRange(celdaY, startColumn + 1).setValue(record[1]); // Cantidad
    sheet.getRange(celdaY, startColumn + 2).setValue(new Date()); // Fecha y Hora

    console.log(`Registro añadido a la hoja "${sheetName}" en la fila ${celdaY}`);

  } catch (error) {
    console.error(`Error al escribir en bloque en la hoja "${sheetName}": ${error}`);
  }
}

function pruebaLecturaDatos(){
  getRecords("Entradas");
  getRecords("Gustos");
  getRecords("Gastos");
  getRecords("Inversiones");
}
