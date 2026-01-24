// En la función cargarNormativas() de calculator.js, REEMPLAZA con:
async function cargarNormativas() {
    try {
        // Intentar cargar desde el archivo
        const response = await fetch('normativas.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Respuesta de normativas.json:', text.substring(0, 200) + '...');
        
        const normativas = JSON.parse(text);
        
        datosCalculadora.escalaProgresiva = normativas.normativas.escala_progresiva;
        datosCalculadora.parametrosFiscales = normativas.normativas.parametros_fiscales;
        datosCalculadora.advertencias = normativas.normativas.advertencias_tcp;
        datosCalculadora.reglasOro = normativas.normativas.reglas_oro;
        
        console.log('✅ Normativas fiscales 2025 cargadas correctamente');
        console.log('Tramos cargados:', datosCalculadora.escalaProgresiva.length);
        
    } catch (error) {
        console.error('❌ Error cargando normativas:', error.message);
        
        // Usar valores por defecto como fallback
        datosCalculadora.escalaProgresiva = [
            { limite_inferior: 0, limite_superior: 30000, porcentaje: 10, descripcion: "Primer tramo" },
            { limite_inferior: 30000.01, limite_superior: 60000, porcentaje: 15, descripcion: "Segundo tramo" },
            { limite_inferior: 60000.01, limite_superior: 120000, porcentaje: 20, descripcion: "Tercer tramo" },
            { limite_inferior: 120000.01, limite_superior: 250000, porcentaje: 25, descripcion: "Cuarto tramo" },
            { limite_inferior: 250000.01, limite_superior: 500000, porcentaje: 35, descripcion: "Quinto tramo" },
            { limite_inferior: 500000.01, limite_superior: null, porcentaje: 45, descripcion: "Sexto tramo" }
        ];
        
        datosCalculadora.parametrosFiscales = {
            minimo_exento_anual: 39120,
            minimo_exento_mensual: 3260,
            porcentaje_pago_cuenta: 5,
            seguridad_social: { tasa: 20, base_minima: 2000, base_maxima: 50000 }
        };
        
        datosCalculadora.advertencias = {
            pagos_a_cuenta: "DEFINITIVOS - SIN DEVOLUCIÓN",
            excedentes: "Los pagos mensuales son definitivos"
        };
        
        datosCalculadora.reglasOro = [
            "1. MÍNIMO EXENTO: 39,120 CUP anuales",
            "2. GASTOS DEDUCIBLES: 100% con documentación",
            "3. PAGOS A CUENTA: 5% sobre excedente - DEFINITIVOS"
        ];
        
        showConfirmation('Usando valores por defecto para normativas 2025', 'warning');
    }
}
