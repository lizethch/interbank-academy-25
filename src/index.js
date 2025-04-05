/**
 * Procesador de Transacciones Bancarias CLI
 * 
 * Este programa lee un archivo CSV de transacciones bancarias y genera
 * un reporte con balance final, transacción de mayor monto y conteo de transacciones.
 */
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Constantes para configuración
const TIPOS_TRANSACCION = {
    CREDITO: 'Crédito',
    DEBITO: 'Débito'
};

/**
 * Lee las transacciones desde un archivo CSV
 * @param {string} rutaArchivo - Ruta al archivo CSV
 * @returns {Promise<Array>} Array con las transacciones procesadas
 */
async function leerTransacciones(rutaArchivo) {
    const transacciones = [];

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(rutaArchivo)
                .on('error', (error) => reject(new Error(`Error al leer el archivo: ${error.message}`)))
                .pipe(csv())
                .on('data', (data) => {
                    // Validar y convertir los datos
                    if (!data.id || isNaN(parseInt(data.id))) {
                        console.warn(`Advertencia: Transacción con ID inválido ignorada: ${JSON.stringify(data)}`);
                        return;
                    }

                    if (!data.monto || isNaN(parseFloat(data.monto)) || parseFloat(data.monto) <= 0) {
                        console.warn(`Advertencia: Transacción con monto inválido ignorada: ${JSON.stringify(data)}`);
                        return;
                    }

                    if (![TIPOS_TRANSACCION.CREDITO, TIPOS_TRANSACCION.DEBITO].includes(data.tipo)) {
                        console.warn(`Advertencia: Tipo de transacción desconocido ignorado: ${data.tipo}`);
                        return;
                    }

                    const transaccion = {
                        id: parseInt(data.id),
                        tipo: data.tipo,
                        monto: parseFloat(data.monto)
                    };

                    transacciones.push(transaccion);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        return transacciones;
    } catch (error) {
        throw new Error(`Error al leer las transacciones: ${error.message}`);
    }
}

/**
 * Analiza las transacciones y obtiene estadísticas
 * @param {Array} transacciones - Lista de transacciones a procesar
 * @returns {Object} Objeto con las estadísticas calculadas
 */
function analizarTransacciones(transacciones) {
    if (transacciones.length === 0) {
        return null;
    }

    let balanceFinal = 0;
    let transaccionMayor = { id: 0, monto: 0 };
    let conteoCreditos = 0;
    let conteoDebitos = 0;
    let sumaCreditos = 0;
    let sumaDebitos = 0;

    transacciones.forEach(transaccion => {
        // Actualizar el balance según el tipo de transacción
        if (transaccion.tipo === TIPOS_TRANSACCION.CREDITO) {
            balanceFinal += transaccion.monto;
            conteoCreditos++;
            sumaCreditos += transaccion.monto;
        } else if (transaccion.tipo === TIPOS_TRANSACCION.DEBITO) {
            balanceFinal -= transaccion.monto;
            conteoDebitos++;
            sumaDebitos += transaccion.monto;
        }

        // Verificar si es la transacción de mayor monto
        if (transaccion.monto > transaccionMayor.monto) {
            transaccionMayor = {
                id: transaccion.id,
                monto: transaccion.monto
            };
        }
    });

    return {
        balanceFinal,
        transaccionMayor,
        conteoCreditos,
        conteoDebitos,
        sumaCreditos,
        sumaDebitos
    };
}

/**
 * Genera un reporte basado en las estadísticas de transacciones
 * @param {Object} estadisticas - Estadísticas calculadas de las transacciones
 */
function generarReporte(estadisticas) {
    if (!estadisticas) {
        console.log('No se encontraron transacciones válidas para generar el reporte.');
        return;
    }

    console.log('Reporte de Transacciones');
    console.log('---------------------------------------------');
    console.log(`Balance Final: ${estadisticas.balanceFinal.toFixed(2)}`);
    console.log(`Transacción de Mayor Monto: ID ${estadisticas.transaccionMayor.id} - ${estadisticas.transaccionMayor.monto.toFixed(2)}`);
    console.log(`Conteo de Transacciones: Crédito: ${estadisticas.conteoCreditos} Débito: ${estadisticas.conteoDebitos}`);
    console.log(`Suma Total de Créditos: ${estadisticas.sumaCreditos.toFixed(2)}`);
    console.log(`Suma Total de Débitos: ${estadisticas.sumaDebitos.toFixed(2)}`);
}

/**
 * Procesa el archivo CSV de transacciones y genera un reporte
 * @param {string} rutaArchivo - Ruta al archivo CSV
 * @returns {Promise<void>}
 */
async function procesarTransacciones(rutaArchivo) {
    try {
        // Leer transacciones del archivo
        const transacciones = await leerTransacciones(rutaArchivo);

        // Verificar si hay transacciones
        if (transacciones.length === 0) {
            console.log('No se encontraron transacciones en el archivo.');
            return;
        }

        // Analizar las transacciones
        const estadisticas = analizarTransacciones(transacciones);

        // Generar el reporte
        generarReporte(estadisticas);
    } catch (error) {
        console.error(`Error durante el procesamiento: ${error.message}`);
        throw error;
    }
}

/**
 * Valida los argumentos de la línea de comandos
 * @returns {string|null} Ruta del archivo o null si hay error
 */
function validarArgumentos() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Error: Debes proporcionar la ruta del archivo CSV');
        console.error('Uso: node src/index.js ruta/al/archivo.csv');
        return null;
    }

    const rutaArchivo = args[0];

    // Verificar si el archivo existe
    if (!fs.existsSync(rutaArchivo)) {
        console.error(`Error: El archivo ${rutaArchivo} no existe`);
        return null;
    }

    // Verificar extensión del archivo
    if (path.extname(rutaArchivo).toLowerCase() !== '.csv') {
        console.error('Error: El archivo debe tener extensión .csv');
        return null;
    }

    return rutaArchivo;
}

/**
 * Función principal que se ejecuta cuando se inicia el programa
 */
async function main() {
    const rutaArchivo = validarArgumentos();

    if (!rutaArchivo) {
        process.exit(1);
    }

    try {
        await procesarTransacciones(rutaArchivo);
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        process.exit(1);
    }
}

// Ejecutar la función principal
main();