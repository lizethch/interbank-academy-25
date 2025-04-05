# retotecnico-cobol
 Procesador de Transacciones Bancarias (CLI)

🚀 Introducción

Este proyecto implementa una aplicación de línea de comandos (CLI) que procesa transacciones bancarias desde un archivo CSV y genera un reporte detallado. El propósito de este reto técnico es demostrar habilidades en procesamiento de datos y desarrollo de aplicaciones de consola, enfocándose en la manipulación eficiente de datos financieros.

La aplicación analiza las transacciones, calculando el balance final (sumando créditos y restando débitos), identificando la transacción de mayor monto y contabilizando las transacciones según su tipo. Este tipo de herramienta podría ser útil en entornos financieros para el análisis rápido de movimientos bancarios.

⚙️ Instrucciones de Ejecución

📌 Requisitos previos

Tener Node.js instalado (versión 12 o superior).

📥 Instalación

Clonar este repositorio:

git clone https://github.com/tu-usuario/procesador-transacciones-bancarias.git
cd procesador-transacciones-bancarias

Instalar las dependencias:

npm install

▶️ Ejecución

Para procesar un archivo CSV de transacciones:

node src/index.js ruta/al/archivo.csv

Por ejemplo:

node src/index.js data/transacciones.csv

Alternativamente, puedes usar el script npm configurado:

npm start data/transacciones.csv

📂 Formato del Archivo CSV

El archivo CSV debe tener la siguiente estructura:

id,tipo,monto
1,Crédito,100.00
2,Débito,50.00

Donde:

id: Identificador único de la transacción.

tipo: Tipo de transacción ("Crédito" o "Débito").

monto: Cantidad de la transacción en formato decimal.

🏗️ Enfoque y Solución

La solución implementada se basa en un enfoque simple pero efectivo para procesar datos financieros:

📌 Lectura y Procesamiento

Lectura asíncrona: Se utiliza csv-parser para leer el archivo CSV de manera eficiente.

Promesas y async/await: Se manejan operaciones asíncronas de manera clara y legible.

📊 Algoritmo Principal

Recopilación de datos: Se leen todas las transacciones del archivo CSV.

Procesamiento por tipo:

Los créditos aumentan el balance.

Los débitos disminuyen el balance.

Se incrementa el contador correspondiente según el tipo.

Identificación de máximos: Se mantiene un registro de la transacción con el monto más alto.

📜 Generación de Reporte

Se formatea la salida siguiendo exactamente el formato especificado, con números decimales correctamente presentados.

⚠️ Manejo de Errores

Se han implementado validaciones para:

Verificar que se proporcione la ruta del archivo.

Comprobar que el archivo existe y es accesible.

Manejar errores durante la lectura y procesamiento.

📁 Estructura del Proyecto

procesador-transacciones-bancarias/
├── 📂 src/
│   └── 📝 index.js          # Código principal con la lógica de procesamiento
├── 📂 data/
│   └── 📄 transacciones.csv # Archivo de ejemplo con transacciones
├── ⚡ cli.js                # Punto de entrada para la CLI
├── 📦 package.json          # Configuración del proyecto y dependencias
└── 📖 README.md             # Este archivo de documentación

📌 Notas Adicionales

📌 El archivo CSV debe contener las siguientes columnas: id, tipo, monto.

🛑 Se han implementado validaciones para evitar errores con datos incompletos o mal formateados.

⚠️ Se muestran advertencias en caso de encontrar registros inválidos.

🎯 Este proyecto es un ejemplo práctico de cómo manejar archivos CSV en Node.js y estructurar una aplicación CLI eficiente y modular.