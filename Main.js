/**
 * Función especial que se ejecuta cuando el frontend (GitHub Pages)
 * pide datos (hace un "GET").
 *
 * Aquí irán todas las funciones que "LEEN" (como getAutomationRules)
 */
function doGet(e) {
  
  // 'e.parameter.accion' es un "comando" que el frontend envía
  const accion = e.parameter.accion;
  let responseData;

  // Enrutador: ¿Qué datos nos está pidiendo el frontend?
  switch (accion) {
    case "getAutomationRules":
      responseData = getAutomationRules(); // Llama a tu función de ClientAPI
      break;
      
    case "getAccountSummaryData":
      responseData = getAccountSummaryData(); // Llama a tu función de ClientAPI
      break;
      
    default:
      responseData = { error: "Acción desconocida" };
  }
  
  // Devuelve los datos al frontend como un texto JSON
  return ContentService
    .createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Función especial que se ejecuta cuando el frontend (GitHub Pages)
 * envía datos (hace un "POST").
 *
 * Aquí irá tu función que "ESCRIBE" (addTransaction)
 */
function doPost(e) {
  
  // 1. Obtenemos el "paquete" de datos que envió el frontend
  // El 'data' es el objeto {concepto: "Café", cantidad: 50, ...}
  const data = JSON.parse(e.postData.contents);
  
  try {
    // 2. Ejecutamos la transacción
    addTransaction(data); // Llama a tu función de ClientAPI
    
    // 3. Respondemos al frontend que todo salió bien
    const response = { status: "ok", message: "Transacción registrada" };
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 4. Si algo falla, le avisamos al frontend
    const response = { status: "error", message: error.message };
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  }
}