// Variables Globales
let datosDeclaracion = {
    seccionA: {},
    seccionB: {},
    seccionC: {},
    seccionD: {},
    esTCP: false
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventos();
    inicializarDatos();
    actualizarEstadoTCP();
});

// Event Listeners
function inicializarEventos() {
    // Navegación por pestañas
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Toggle TCP
    document.getElementById('tcpToggle').addEventListener('change', function() {
        datosDeclaracion.esTCP = this.checked;
        actualizarEstadoTCP();
    });

    // Inicializar cálculos
    calcularSeccionA();
}

function inicializarDatos() {
    datosDeclaracion = {
        seccionA: {
            ventasBrutasTotales: 0,
            ventasPeriodo: 0,
            devolucionesVentas: 0,
            impuestoVentas: 0,
            ventaActivos: 0,
            donaciones: 0,
            otrosIngresos: 0,
            ingresosNetos: 0
        },
        seccionB: {
            costoVentas: 0,
            gastosAdministracion: 0,
            gastosOperacion: 0,
            gastosFinancieros: 0,
            otrosGastos: 0,
            utilidadAntesAjustes: 0
        },
        seccionC: {
            ajusteDepreciacion: 0,
            multasRecargos: 0,
            cuentasIncobrables: 0,
            otrasAdiciones: 0,
            reservaContingencias: 0,
            ingresosNoImponibles: 0,
            perdidasAnteriores: 0,
            otrasDeducciones: 0,
            totalAdiciones: 0,
            totalDeducciones: 0,
            utilidadNetaImponible: 0
        },
        seccionD: {
            tipoImpositivo: 35,
            impuestoBruto: 0,
            bonificaciones: 0,
            pagoTrimestre1: 0,
            pagoTrimestre2: 0,
            pagoTrimestre3: 0,
            pagoTrimestre4: 0,
            totalPagosCuenta: 0,
            saldoPagar: 0
        },
        esTCP: false
    };
}

// Navegación entre Secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar sección seleccionada
    document.getElementById(sectionId).classList.add('active');

    // Actualizar navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });

    // Scroll suave al inicio de la sección
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Cálculo Sección A: Ingresos
function calcularSeccionA() {
    // Obtener valores
    const ventasBrutas = parseFloat(document.getElementById('ventasBrutasTotales').value) || 0;
    const ventasPeriodo = parseFloat(document.getElementById('ventasPeriodo').value) || 0;
    const devoluciones = parseFloat(document.getElementById('devolucionesVentas').value) || 0;
    const impuestoVentas = parseFloat(document.getElementById('impuestoVentas').value) || 0;
    const ventaActivos = parseFloat(document.getElementById('ventaActivos').value) || 0;
    const donaciones = parseFloat(document.getElementById('donaciones').value) || 0;
    const otrosIngresos = parseFloat(document.getElementById('otrosIngresos').value) || 0;

    // Calcular ingresos brutos totales
    const ingresosBrutos = ventasPeriodo + ventaActivos + donaciones + otrosIngresos;

    // Calcular ingresos netos
    const ingresosNetos = ingresosBrutos - devoluciones - impuestoVentas;

    // Actualizar datos
    datosDeclaracion.seccionA = {
        ventasBrutasTotales: ventasBrutas,
        ventasPeriodo: ventasPeriodo,
        devolucionesVentas: devoluciones,
        impuestoVentas: impuestoVentas,
        ventaActivos: ventaActivos,
        donaciones: donaciones,
        otrosIngresos: otrosIngresos,
        ingresosNetos: Math.max(ingresosNetos, 0) // No permitir valores negativos
    };

    // Actualizar UI
    document.getElementById('ingresosBrutos').textContent = formatCurrency(ingresosBrutos);
    document.getElementById('totalDevoluciones').textContent = formatCurrency(devoluciones);
    document.getElementById('totalImpuestoVentas').textContent = formatCurrency(impuestoVentas);
    document.getElementById('ingresosNetos').textContent = formatCurrency(datosDeclaracion.seccionA.ingresosNetos);
    document.getElementById('ingresosNetosB').textContent = formatCurrency(datosDeclaracion.seccionA.ingresosNetos);

    // Calcular sección B si hay cambios
    calcularSeccionB();
}

// Cálculo Sección B: Gastos
function calcularSeccionB() {
    const costoVentas = parseFloat(document.getElementById('costoVentas').value) || 0;
    const gastosAdmin = parseFloat(document.getElementById('gastosAdministracion').value) || 0;
    const gastosOperacion = parseFloat(document.getElementById('gastosOperacion').value) || 0;
    const gastosFinancieros = parseFloat(document.getElementById('gastosFinancieros').value) || 0;
    const otrosGastos = parseFloat(document.getElementById('otrosGastos').value) || 0;

    const ingresosNetos = datosDeclaracion.seccionA.ingresosNetos || 0;
    const totalGastos = costoVentas + gastosAdmin + gastosOperacion + gastosFinancieros + otrosGastos;
    const utilidadAntesAjustes = ingresosNetos - totalGastos;

    // Actualizar datos
    datosDeclaracion.seccionB = {
        costoVentas: costoVentas,
        gastosAdministracion: gastosAdmin,
        gastosOperacion: gastosOperacion,
        gastosFinancieros: gastosFinancieros,
        otrosGastos: otrosGastos,
        totalGastos: totalGastos,
        utilidadAntesAjustes: utilidadAntesAjustes
    };

    // Actualizar UI
    document.getElementById('totalCostoVentas').textContent = formatCurrency(costoVentas);
    document.getElementById('totalGastosAdmin').textContent = formatCurrency(gastosAdmin);
    document.getElementById('totalGastosOperacion').textContent = formatCurrency(gastosOperacion);
    document.getElementById('totalGastosFinancieros').textContent = formatCurrency(gastosFinancieros);
    document.getElementById('totalOtrosGastos').textContent = formatCurrency(otrosGastos);
    document.getElementById('utilidadAntesAjustes').textContent = formatCurrency(utilidadAntesAjustes);
    document.getElementById('utilidadAntesAjustesC').textContent = formatCurrency(utilidadAntesAjustes);

    // Calcular sección C si hay cambios
    calcularSeccionC();
}

// Cálculo Sección C: Ajustes Fiscales
function calcularSeccionC() {
    // Obtener adiciones
    const ajusteDepreciacion = parseFloat(document.getElementById('ajusteDepreciacion').value) || 0;
    const multasRecargos = parseFloat(document.getElementById('multasRecargos').value) || 0;
    const cuentasIncobrables = parseFloat(document.getElementById('cuentasIncobrables').value) || 0;
    const otrasAdiciones = parseFloat(document.getElementById('otrasAdiciones').value) || 0;
    
    // Obtener deducciones
    const reservaContingencias = parseFloat(document.getElementById('reservaContingencias').value) || 0;
    const ingresosNoImponibles = parseFloat(document.getElementById('ingresosNoImponibles').value) || 0;
    const perdidasAnteriores = parseFloat(document.getElementById('perdidasAnteriores').value) || 0;
    const otrasDeducciones = parseFloat(document.getElementById('otrasDeducciones').value) || 0;

    // Calcular totales
    const totalAdiciones = ajusteDepreciacion + multasRecargos + cuentasIncobrables + otrasAdiciones;
    const totalDeducciones = reservaContingencias + ingresosNoImponibles + perdidasAnteriores + otrasDeducciones;
    
    const utilidadAntesAjustes = datosDeclaracion.seccionB.utilidadAntesAjustes || 0;
    const utilidadNetaImponible = utilidadAntesAjustes + totalAdiciones - totalDeducciones;

    // Actualizar datos
    datosDeclaracion.seccionC = {
        ajusteDepreciacion: ajusteDepreciacion,
        multasRecargos: multasRecargos,
        cuentasIncobrables: cuentasIncobrables,
        otrasAdiciones: otrasAdiciones,
        reservaContingencias: reservaContingencias,
        ingresosNoImponibles: ingresosNoImponibles,
        perdidasAnteriores: perdidasAnteriores,
        otrasDeducciones: otrasDeducciones,
        totalAdiciones: totalAdiciones,
        totalDeducciones: totalDeducciones,
        utilidadNetaImponible: Math.max(utilidadNetaImponible, 0) // Mínimo 0
    };

    // Actualizar UI
    document.getElementById('totalAdiciones').textContent = formatCurrency(totalAdiciones);
    document.getElementById('totalDeducciones').textContent = formatCurrency(totalDeducciones);
    document.getElementById('utilidadNetaImponible').textContent = formatCurrency(datosDeclaracion.seccionC.utilidadNetaImponible);
    document.getElementById('utilidadNetaImponibleD').textContent = formatCurrency(datosDeclaracion.seccionC.utilidadNetaImponible);

    // Calcular sección D si hay cambios
    calcularSeccionD();
}

// Cálculo Sección D: Liquidación
function calcularSeccionD() {
    const tipoImpositivo = parseFloat(document.getElementById('tipoImpositivo').value) || 35;
    const bonificaciones = parseFloat(document.getElementById('bonificaciones').value) || 0;
    
    const pagoTrimestre1 = parseFloat(document.getElementById('pagoTrimestre1').value) || 0;
    const pagoTrimestre2 = parseFloat(document.getElementById('pagoTrimestre2').value) || 0;
    const pagoTrimestre3 = parseFloat(document.getElementById('pagoTrimestre3').value) || 0;
    const pagoTrimestre4 = parseFloat(document.getElementById('pagoTrimestre4').value) || 0;
    
    const utilidadNeta = datosDeclaracion.seccionC.utilidadNetaImponible || 0;
    const impuestoBruto = utilidadNeta * (tipoImpositivo / 100);
    const totalPagosCuenta = pagoTrimestre1 + pagoTrimestre2 + pagoTrimestre3 + pagoTrimestre4;
    const saldoPagar = Math.max(impuestoBruto - bonificaciones - totalPagosCuenta, 0);

    // Actualizar datos
    datosDeclaracion.seccionD = {
        tipoImpositivo: tipoImpositivo,
        impuestoBruto: impuestoBruto,
        bonificaciones: bonificaciones,
        pagoTrimestre1: pagoTrimestre1,
        pagoTrimestre2: pagoTrimestre2,
        pagoTrimestre3: pagoTrimestre3,
        pagoTrimestre4: pagoTrimestre4,
        totalPagosCuenta: totalPagosCuenta,
        saldoPagar: saldoPagar
    };

    // Actualizar UI
    document.getElementById('impuestoBruto').textContent = formatCurrency(impuestoBruto);
    document.getElementById('impuestoBrutoFinal').textContent = formatCurrency(impuestoBruto);
    document.getElementById('totalBonificaciones').textContent = formatCurrency(bonificaciones);
    document.getElementById('totalPagosCuenta').textContent = formatCurrency(totalPagosCuenta);
    document.getElementById('totalPagosCuentaFinal').textContent = formatCurrency(totalPagosCuenta);
    document.getElementById('saldoPagar').textContent = formatCurrency(saldoPagar);

    // Actualizar advertencia TCP
    actualizarAdvertenciaTCP(saldoPagar, totalPagosCuenta);
}

// Cálculo Automático de Reserva para Contingencias
function calcularReservaContingencias() {
    const totalGastos = datosDeclaracion.seccionB.totalGastos || 0;
    const porcentajeReserva = 0.10; // 10% según normativa
    
    const reservaCalculada = totalGastos * porcentajeReserva;
    
    document.getElementById('reservaContingencias').value = reservaCalculada.toFixed(2);
    calcularSeccionC();
}

// Actualizar Estado TCP
function actualizarEstadoTCP() {
    const esTCP = datosDeclaracion.esTCP;
    const tcpWarning = document.getElementById('tcpWarning');
    const tcpAlert = document.getElementById('tcpAlert');
    const tcpNote = document.getElementById('tcpNote');
    
    if (esTCP) {
        tcpWarning.style.display = 'block';
        tcpAlert.style.display = 'flex';
        tcpNote.innerHTML = '<strong>ATENCIÓN TCP:</strong> Los pagos a cuenta son definitivos - SIN DEVOLUCIÓN';
        
        // Ajustar tipo impositivo para TCP si es necesario
        // En Cuba, los TCP pueden tener tipos impositivos diferentes
        // Este valor debería venir de una base de datos por actividad económica
        const actividadTCP = obtenerActividadTCP(); // Función simulada
        if (actividadTCP && actividadTCP.tipoImpositivo) {
            document.getElementById('tipoImpositivo').value = actividadTCP.tipoImpositivo;
        }
    } else {
        tcpWarning.style.display = 'none';
        tcpAlert.style.display = 'none';
        tcpNote.textContent = 'Para TCP: Verificar cálculo antes de pagar anticipos';
    }
    
    calcularSeccionD();
}

function actualizarAdvertenciaTCP(saldoPagar, totalPagosCuenta) {
    if (!datosDeclaracion.esTCP) return;
    
    const utilidadNeta = datosDeclaracion.seccionC.utilidadNetaImponible || 0;
    const tipoImpositivo = datosDeclaracion.seccionD.tipoImpositivo || 35;
    const impuestoEsperado = utilidadNeta * (tipoImpositivo / 100);
    
    if (totalPagosCuenta > impuestoEsperado) {
        const excedente = totalPagosCuenta - impuestoEsperado;
        alert(`ADVERTENCIA TCP: Ha pagado $${formatCurrency(excedente)} de más en anticipos. \n\nRECUERDE: Para TCP los pagos a cuenta son DEFINITIVOS y la ONAT NO realiza devoluciones.`);
    }
}

// Funciones de Utilidad
function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function closeWarning() {
    document.getElementById('tcpWarning').style.display = 'none';
}

// Funciones del Modal de Ayuda
function showHelp() {
    document.getElementById('helpModal').style.display = 'block';
}

function closeHelp() {
    document.getElementById('helpModal').style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('helpModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Exportar Declaración
function exportarDeclaracion() {
    const declaracionCompleta = {
        timestamp: new Date().toISOString(),
        datos: datosDeclaracion,
        resumen: generarResumen()
    };
    
    const blob = new Blob([JSON.stringify(declaracionCompleta, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dj-08-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Declaración exportada exitosamente');
}

// Generar Declaración Final
function generarDeclaracion() {
    // Validar datos antes de generar
    if (!validarDeclaracionCompleta()) {
        alert('Por favor, complete todos los campos requeridos antes de generar la declaración.');
        return;
    }
    
    // Aquí se integraría con un servicio para generar PDF
    // Por ahora simulamos la generación
    const resumen = generarResumen();
    
    const mensaje = `DECLARACIÓN DJ-08 GENERADA\n\n` +
                    `RESUMEN:\n` +
                    `Ingresos Netos: ${formatCurrency(datosDeclaracion.seccionA.ingresosNetos)}\n` +
                    `Utilidad Neta Imponible: ${formatCurrency(datosDeclaracion.seccionC.utilidadNetaImponible)}\n` +
                    `Impuesto Bruto: ${formatCurrency(datosDeclaracion.seccionD.impuestoBruto)}\n` +
                    `Pagos a Cuenta: ${formatCurrency(datosDeclaracion.seccionD.totalPagosCuenta)}\n` +
                    `Saldo a Pagar: ${formatCurrency(datosDeclaracion.seccionD.saldoPagar)}\n\n` +
                    (datosDeclaracion.esTCP ? 
                     '⚠️ ADVERTENCIA TCP: LOS PAGOS A CUENTA SON DEFINITIVOS\n' : '');
    
    alert(mensaje);
    
    // En una implementación real, aquí se generaría el PDF
    // y se mostraría un enlace para descargar
}

function validarDeclaracionCompleta() {
    // Validar campos requeridos básicos
    const camposRequeridos = [
        'ventasPeriodo',
        'costoVentas',
        'tipoImpositivo'
    ];
    
    for (const campo of camposRequeridos) {
        const elemento = document.getElementById(campo);
        if (!elemento || !elemento.value || parseFloat(elemento.value) === 0) {
            return false;
        }
    }
    
    return true;
}

function generarResumen() {
    return {
        ingresosNetos: datosDeclaracion.seccionA.ingresosNetos,
        utilidadAntesAjustes: datosDeclaracion.seccionB.utilidadAntesAjustes,
        utilidadNetaImponible: datosDeclaracion.seccionC.utilidadNetaImponible,
        impuestoCalculado: datosDeclaracion.seccionD.impuestoBruto,
        saldoAPagar: datosDeclaracion.seccionD.saldoPagar,
        esTCP: datosDeclaracion.esTCP,
        advertenciaTCP: datosDeclaracion.esTCP ? 
            'LOS PAGOS A CUENTA SON DEFINITIVOS - NO HAY DEVOLUCIÓN' : 
            null
    };
}

// Resetear Formulario
function resetForm() {
    if (confirm('¿Está seguro de que desea comenzar una nueva declaración? Se perderán todos los datos actuales.')) {
        // Resetear todos los inputs
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });
        
        // Restaurar valores por defecto
        document.getElementById('tipoImpositivo').value = '35';
        document.getElementById('tcpToggle').checked = false;
        
        // Reiniciar datos
        inicializarDatos();
        actualizarEstadoTCP();
        
        // Recalcular
        calcularSeccionA();
        
        // Volver a primera sección
        showSection('seccion-a');
        
        alert('Formulario reiniciado. Puede comenzar una nueva declaración.');
    }
}

// Simulación de datos TCP (en producción vendría de una base de datos)
function obtenerActividadTCP() {
    // Simulación: En producción esto vendría de una API o base de datos
    const actividadesTCP = {
        '001': { nombre: 'Servicios Técnicos', tipoImpositivo: 35 },
        '002': { nombre: 'Transporte', tipoImpositivo: 30 },
        '003': { nombre: 'Alimentación', tipoImpositivo: 25 },
        '004': { nombre: 'Artesanía', tipoImpositivo: 20 }
    };
    
    // Por simplicidad, devolvemos un tipo fijo
    // En la implementación real, el usuario seleccionaría su actividad
    return { tipoImpositivo: 35 };
}