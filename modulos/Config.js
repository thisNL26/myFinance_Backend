const CONFIG = {
  SPREADSHEET_ID: "1HfUUzHzioRc143H7S6VovGJ8aES1Ap01v-7kb_N1ec4", 
  SHEET_NAMES: {
    MATRIZ: "matriz",
    ENTRADAS: "Entradas",
    GASTOS: "Gastos",
    GUSTOS: "Gustos",
    INVERSIONES: "Inversiones",
    AUTOMATIZACIONES: "automatizaciones"

  },
  WALLET_INDEX:{
    ENTRADAS:{
      "Efectivo Entrante": 0,
      "BBVA": 6
    },
    GASTOS:{
      "Efectivo Gatos": 0,
      "NU": 6,
      "BBVA BLUE": 12,
      "Coppel": 18,
      "Tarjeta Tren": 24,
      "Cuenta miSaldo": 30
    },
    GUSTOS:{
      "Efectivo Gustos": 0,
      "OpenBank": 6,
      "CA": 12
    },
    INVERSIONES:{
      "Efectivo Inversiones":0,
      "Mercado Pago":6,
      "Fondo de Inversion":12
    }
  },
  TYPE_INDEX:{
    "Ingreso": 0,
    "Egreso": 3
  }
};

/**
 * Genera una lista única de todos los nombres de carteras (Bancos/Cuentas)
 * definidos en CONFIG.WALLET_INDEX.
 * @returns {string[]} Un array de nombres únicos, ej: ["Efectivo", "BBVA", "NU", ...]
 */

function getUniqueWalletNames() {
  
  // 1. Obtiene todos los objetos de carteras (ej: { "Efectivo": 0, "BBVA": 6 }, etc.)
  const allWalletGroups = Object.values(CONFIG.WALLET_INDEX);
  
  // 2. Obtiene las llaves (nombres) de cada grupo y las "aplana" en un solo array
  // Resultado: ["Efectivo", "BBVA", "Efectivo", "NU", "BBVA BLUE", ...]
  const allWalletNames = allWalletGroups.map(group => Object.keys(group)).flat();
  
  // 3. Usa un "Set" para eliminar duplicados y lo convierte de nuevo a un array
  const uniqueNames = [...new Set(allWalletNames)];
  

  console.log(uniqueNames);
  return uniqueNames;
}