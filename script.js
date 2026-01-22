// ============================================
// SISTEMA DE ASESORAMIENTO POR CAMPO
// ============================================

const asesoramientoData = {
    // Sección A: Ingresos
    'ventasBrutasTotales': {
        titulo: 'Ventas Brutas Totales',
        descripcion: 'Ingrese el total acumulado de todas sus ventas o servicios durante el año completo. Incluya todas las facturas emitidas.',
        consejo: 'Mantenga un registro mensual para facilitar este cálculo. Incluya ventas al contado y a crédito.',
        normativa: 'Art. 75 Ley Sistema Tributario',
        icono: 'fa-chart-bar'
    },
    'ventasPeriodo': {
        titulo: 'Ventas del Período Impositivo',
        descripcion: 'Solo ingrese las ventas correspondientes a meses donde le corresponde pagar impuestos.',
        consejo: 'Si tuvo meses exentos o de inactividad, exclúyalos de este cálculo.',
        ejemplo: 'Ejemplo: Si trabajó 8 meses del año, sume solo las ventas de esos 8 meses.',
        icono: 'fa-calendar-check'
    },
    'devolucionesVentas': {
        titulo: 'Devoluciones en Ventas',
        descripcion: 'Monto total de productos devueltos por los clientes durante el período.',
        consejo: 'Mantenga comprobantes de todas las devoluciones para respaldo ante auditorías.',
        normativa: 'Deducción permitida por normativa tributaria',
        icono: 'fa-exchange-alt'
    },
    'impuestoVentas': {
        titulo: 'Impuesto sobre Ventas',
        descripcion: 'Impuesto recaudado en sus ventas que debe declarar y pagar al estado.',
        consejo: 'Verifique las tasas vigentes según su actividad económica.',
        importante: 'Este monto se resta de sus ingresos brutos para calcular ingresos netos.',
        icono: 'fa-file-invoice'
    },
    
    // Sección B: Gastos
    'costoVentas': {
        titulo: 'Costo de Ventas',
        descripcion: 'Costo directo de los productos o servicios que vendió. Incluye materias primas, mano de obra directa y costos de producción.',
        consejo: 'Separe claramente costos directos de gastos generales para una correcta deducción.',
        deducible: '100% deducible cuando está correctamente documentado.',
        icono: 'fa-box-open'
    },
    'gastosAdministracion': {
        titulo: 'Gastos de Administración',
        descripcion: 'Gastos necesarios para el funcionamiento administrativo de su negocio.',
        consejo: 'Incluya sueldos administrativos, alquiler de oficina, servicios básicos y suministros.',
        deducible: 'Generalmente 100% deducible con comprobantes válidos.',
        icono: 'fa-briefcase'
    },
    'gastosFinancieros': {
        titulo: 'Gastos Financieros',
        descripcion: 'Intereses pagados por préstamos, créditos o financiamientos.',
        consejo: 'Solo intereses, no el capital del préstamo. Separe intereses de comisiones.',
        limite: 'Existen límites en la deducción según el tipo de crédito.',
        icono: 'fa-credit-card'
    },
    
    // Sección C: Ajustes
    'ajusteDepreciacion': {
        titulo: 'Ajuste por Depreciación',
        descripcion: 'Diferencia entre la depreciación contable que aplicó y la tasa máxima permitida fiscalmente.',
        consejo: 'Si usó tasas superiores a las legales, la diferencia se suma como ajuste positivo.',
        normativa: 'Consulte tasas oficiales de depreciación por tipo de activo.',
        icono: 'fa-tachometer-alt'
    },
    'reservaContingencias': {
        titulo: 'Reserva para Contingencias',
        descripcion: 'Provisiones para riesgos futuros como litigios, garantías o fluctuaciones del mercado.',
        consejo: 'Generalmente se calcula como 10% de los gastos totales del período.',
        limite: 'Existe un tope máximo establecido por ley.',
        icono: 'fa-piggy-bank'
    },
    'ingresosNoImponibles': {
        titulo: 'Ingresos No Imponibles',
        descripcion: 'Rentas exentas por disposición especial que no están sujetas a impuestos.',
        ejemplo: 'Donaciones, indemnizaciones por seguros, ciertos subsidios estatales.',
        normativa: 'Artículos específicos de exención según Ley del Sistema Tributario.',
        icono: 'fa-hand-holding-usd'
    },
    
    // Sección D: Liquidación
    'tipoImpositivo': {
        titulo: 'Tipo Impositivo',
        descripcion: 'Porcentaje que se aplica sobre la utilidad neta imponible para calcular el impuesto.',
        valor: 'Generalmente 35% según Resolución No. 350/2020.',
        excepcion: 'TCP pueden tener tipos diferentes según su actividad económica específica.',
        icono: 'fa-chart-pie'
    },
    'pagoTrimestre1': {
        titulo: 'Pago 1er Trimestre',
        descripcion: 'Anticipo pagado entre enero y marzo como pago a cuenta del impuesto anual.',
        consejo: 'Para TCP: ¡ESTOS PAGOS SON DEFINITIVOS! Calcule cuidadosamente.',
        advertencia: 'La ONAT NO devuelve excedentes pagados en anticipos por TCP.',
        icono: 'fa-qrcode'
    }
};

// Función para mostrar asesoramiento
let tooltipActivo = null;

function mostrarAsesoramiento(campoId) {
    const info = asesoramientoData[campoId];
    if (!info) return;
    
    // Cerrar tooltip anterior si existe
    if (tooltipActivo) {
        cerrarAsesoramiento();
    }
    
    // Crear tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'asesoramiento-tooltip';
    tooltip.className = 'tooltip-activo';
    
    // Contenido del tooltip
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <i class="fas ${info.icono || 'fa-info-circle'}"></i>
            <h4>${info.titulo}</h4>
            <button class="tooltip-close" onclick="cerrarAsesoramiento()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="tooltip-body">
            <p class="tooltip-desc">${info.descripcion}</p>
            
            ${info.consejo ? `
            <div class="tooltip-tip">
                <i class="fas fa-lightbulb"></i>
                <div>
                    <strong>Consejo práctico:</strong>
                    <p>${info.consejo}</p>
                </div>
            </div>` : ''}
            
            ${info.normativa ? `
            <div class="tooltip-normativa">
                <i class="fas fa-gavel"></i>
                <div>
                    <strong>Base normativa:</strong>
                    <p>${info.normativa}</p>
                </div>
            </div>` : ''}
            
            ${info.ejemplo ? `
            <div class="tooltip-ejemplo">
                <i class="fas fa-list-alt"></i>
                <div>
                    <strong>Ejemplo:</strong>
                    <p>${info.ejemplo}</p>
                </div>
            </div>` : ''}
            
            ${info.importante ? `
            <div class="tooltip-importante">
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    <strong>Importante:</strong>
                    <p>${info.importante}</p>
                </div>
            </div>` : ''}
        </div>
    `;
    
    // Estilos inline para el tooltip
    tooltip.style.cssText = `
        position: fixed;
        background: white;
        border-radius: 12px;
        padding: 0;
        box-shadow: 0 15px 50px rgba(0,0,0,0.2);
        z-index: 10000;
        width: 380px;
        max-width: 90vw;
        display: block;
        border: 1px solid #e2e8f0;
        animation: tooltipFadeIn 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    document.body.appendChild(tooltip);
    
    // Posicionar tooltip
    const input = document.getElementById(campoId);
    if (input) {
        const rect = input.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Posicionar arriba o abajo según espacio disponible
        if (rect.top > viewportHeight / 2) {
            // Posicionar arriba
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        } else {
            // Posicionar abajo
            tooltip.style.top = (rect.bottom + 10) + 'px';
        }
        
        tooltip.style.left = Math.max(10, Math.min(rect.left, window.innerWidth - tooltip.offsetWidth - 10)) + 'px';
    }
    
    tooltipActivo = tooltip;
    
    // Cerrar al hacer click fuera
    setTimeout(() => {
        document.addEventListener('click', cerrarAsesoramientoClickOutside);
    }, 10);
}

// Animación para tooltip
const style = document.createElement('style');
style.textContent = `
    @keyframes tooltipFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .tooltip-header {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-radius: 12px 12px 0 0;
    }
    
    .tooltip-header h4 {
        margin: 0;
        font-size: 1.1rem;
        flex: 1;
    }
    
    .tooltip-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .tooltip-close:hover {
        background: rgba(255,255,255,0.3);
        transform: rotate(90deg);
    }
    
    .tooltip-body {
        padding: 20px;
    }
    
    .tooltip-desc {
        color: #475569;
        line-height: 1.6;
        margin-bottom: 20px;
        font-size: 0.95rem;
    }
    
    .tooltip-tip, .tooltip-normativa, .tooltip-ejemplo, .tooltip-importante {
        background: #f8fafc;
        border-radius: 8px;
        padding: 12px 15px;
        margin-bottom: 12px;
        display: flex;
        gap: 12px;
        align-items: flex-start;
        border-left: 3px solid;
    }
    
    .tooltip-tip {
        border-left-color: #fbbf24;
    }
    
    .tooltip-normativa {
        border-left-color: #10b981;
    }
    
    .tooltip-ejemplo {
        border-left-color: #8b5cf6;
    }
    
    .tooltip-importante {
        border-left-color: #ef4444;
    }
    
    .tooltip-tip i, .tooltip-normativa i, 
    .tooltip-ejemplo i, .tooltip-importante i {
        font-size: 1.1rem;
        margin-top: 2px;
    }
    
    .tooltip-tip strong, .tooltip-normativa strong,
    .tooltip-ejemplo strong, .tooltip-importante strong {
        display: block;
        font-size: 0.9rem;
        margin-bottom: 5px;
        color: #1e293b;
    }
    
    .tooltip-tip p, .tooltip-normativa p,
    .tooltip-ejemplo p, .tooltip-importante p {
        margin: 0;
        font-size: 0.9rem;
        color: #64748b;
        line-height: 1.5;
    }
`;
document.head.appendChild(style);

function cerrarAsesoramiento() {
    if (tooltipActivo) {
        tooltipActivo.remove();
        tooltipActivo = null;
        document.removeEventListener('click', cerrarAsesoramientoClickOutside);
    }
}

function cerrarAsesoramientoClickOutside(event) {
    if (tooltipActivo && !tooltipActivo.contains(event.target)) {
        // Verificar si el click fue en un icono de ayuda
        const isHelpIcon = event.target.closest('.label-help') || 
                          event.target.closest('.fa-question-circle');
        
        if (!isHelpIcon) {
            cerrarAsesoramiento();
        }
    }
}

// Agregar iconos de ayuda a todos los inputs
function agregarIconosAyuda() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label && asesoramientoData[input.id]) {
            // Agregar icono de ayuda al label
            const helpIcon = document.createElement('span');
            helpIcon.className = 'label-help';
            helpIcon.innerHTML = '<i class="fas fa-question-circle"></i>';
            helpIcon.title = 'Click para ayuda';
            helpIcon.onclick = (e) => {
                e.stopPropagation();
                mostrarAsesoramiento(input.id);
            };
            
            // Insertar después del texto del label
            const labelText = label.childNodes[0];
            if (labelText) {
                label.insertBefore(helpIcon, labelText.nextSibling);
            } else {
                label.appendChild(helpIcon);
            }
            
            // También mostrar al enfocar el input
            input.addEventListener('focus', () => {
                mostrarAsesoramiento(input.id);
            });
        }
    });
}

// ============================================
// VARIABLES GLOBALES Y DATOS
// ============================================

let datosDeclaracion = {
    seccionA: {},
    seccionB: {},
    seccionC: {},
    seccionD: {},
    esTCP: false,
    version: '2.0'
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DJ-08 Automatizada v2.0 cargada');
    
    inicializarEventos();
    inicializarDatos();
    actualizarEstadoTCP();
    
    // Agregar sistema de ayuda
    agregarIconosAyuda();
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        mostrarNotificacion('¡Bienvenido a DJ-08 Automatizada! Haga click en los iconos ? para obtener ayuda en cada campo.', 'info');
    }, 800);
    
    // Efectos iniciales
    aplicarEfectosIniciales();
    
    // Cargar datos guardados si existen
    cargarDatosGuardados();
});

function aplicarEfectosIniciales() {
    // Efecto en logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.02) rotate(-1deg)';
        });
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // Efecto en tarjetas al cargar
    document.querySelectorAll('.form-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

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
        guardarDatos();
    });

    // Inputs que disparan cálculos
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', guardarDatos);
    });
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
        esTCP: false,
        fecha: new Date().toISOString()
    };
}

// ============================================
// NAVEGACIÓN ENTRE SECCIONES
// ============================================

function showSection(sectionId) {
    // Ocultar todas las secciones con animación
    document.querySelectorAll('.form-section').forEach(section => {
        if (section.classList.contains('active')) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            setTimeout(() => {
                section.classList.remove('active');
                section.style.opacity = '';
                section.style.transform = '';
            }, 300);
        }
    });

    // Mostrar sección seleccionada con animación
    setTimeout(() => {
        const section = document.getElementById(sectionId);
        section.classList.add('active');
        section.style.animation = 'fadeIn 0.5s ease';
        
        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
        
        // Scroll suave al inicio
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Cerrar tooltip si está abierto
        cerrarAsesoramiento();
        
        // Guardar sección actual
        datosDeclaracion.seccionActual = sectionId;
        guardarDatos();
    }, 300);
}

// ============================================
// CÁLCULOS PRINCIPALES
// ============================================

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
    const ingresosNetos = Math.max(ingresosBrutos - devoluciones - impuestoVentas, 0);

    // Actualizar datos
    datosDeclaracion.seccionA = {
        ventasBrutasTotales: ventasBrutas,
        ventasPeriodo: ventasPeriodo,
        devolucionesVentas: devoluciones,
        impuestoVentas: impuestoVentas,
        ventaActivos: ventaActivos,
        donaciones: donaciones,
        otrosIngresos: otrosIngresos,
        ingresosNetos: ingresosNetos
    };

    // Actualizar UI con animación
    animarValor('ingresosBrutos', ingresosBrutos);
    animarValor('totalDevoluciones', devoluciones);
    animarValor('totalImpuestoVentas', impuestoVentas);
    animarValor('ingresosNetos', ingresosNetos);
    animarValor('ingresosNetosB', ingresosNetos);

    // Calcular sección B si hay cambios
    setTimeout(calcularSeccionB, 100);
    
    // Guardar datos
    guardarDatos();
}

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

    // Actualizar UI con animación
    animarValor('totalCostoVentas', costoVentas);
    animarValor('totalGastosAdmin', gastosAdmin);
    animarValor('totalGastosOperacion', gastosOperacion);
    animarValor('totalGastosFinancieros', gastosFinancieros);
    animarValor('totalOtrosGastos', otrosGastos);
    animarValor('utilidadAntesAjustes', utilidadAntesAjustes);
    animarValor('utilidadAntesAjustesC', utilidadAntesAjustes);

    // Calcular sección C
    setTimeout(calcularSeccionC, 100);
    guardarDatos();
}

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
    const utilidadNetaImponible = Math.max(utilidadAntesAjustes + totalAdiciones - totalDeducciones, 0);

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
        utilidadNetaImponible: utilidadNetaImponible
    };

    // Actualizar UI con animación
    animarValor('totalAdiciones', totalAdiciones);
    animarValor('totalDeducciones', totalDeducciones);
    animarValor('utilidadNetaImponible', utilidadNetaImponible);
    animarValor('utilidadNetaImponibleD', utilidadNetaImponible);

    // Calcular sección D
    setTimeout(calcularSeccionD, 100);
    guardarDatos();
}

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

    // Actualizar UI con animación
    animarValor('impuestoBruto', impuestoBruto);
    animarValor('impuestoBrutoFinal', impuestoBruto);
    animarValor('totalBonificaciones', bonificaciones);
    animarValor('totalPagosCuenta', totalPagosCuenta);
    animarValor('totalPagosCuentaFinal', totalPagosCuenta);
    animarValor('saldoPagar', saldoPagar);

    // Verificar advertencias TCP
    actualizarAdvertenciaTCP(saldoPagar, totalPagosCuenta, impuestoBruto);
    guardarDatos();
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function animarValor(elementId, valorFinal) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    
    const valorActual = parseFloat(elemento.textContent.replace(/[^0-9.-]+/g, "")) || 0;
    
    if (Math.abs(valorFinal - valorActual) < 0.01) {
        elemento.textContent = formatCurrency(valorFinal);
        return;
    }
    
    elemento.classList.add('calculando');
    
    let valorAnimado = valorActual;
    const incremento = (valorFinal - valorActual) / 20;
    let frame = 0;
    
    function animar() {
        valorAnimado += incremento;
        frame++;
        
        if (frame >= 20 || Math.abs(valorFinal - valorAnimado) < 0.01) {
            elemento.textContent = formatCurrency(valorFinal);
            elemento.classList.remove('calculando');
        } else {
            elemento.textContent = formatCurrency(valorAnimado);
            requestAnimationFrame(animar);
        }
    }
    
    animar();
}

function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function calcularReservaContingencias() {
    const totalGastos = datosDeclaracion.seccionB.totalGastos || 0;
    const porcentajeReserva = 0.10; // 10%
    
    const reservaCalculada = totalGastos * porcentajeReserva;
    
    document.getElementById('reservaContingencias').value = reservaCalculada.toFixed(2);
    
    // Efecto visual
    const input = document.getElementById('reservaContingencias');
    input.style.borderColor = '#10b981';
    input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
    
    setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }, 1000);
    
    calcularSeccionC();
    mostrarNotificacion(`Reserva calculada: ${formatCurrency(reservaCalculada)} (10% de gastos)`, 'exito');
}

// ============================================
// GESTIÓN TCP
// ============================================

function actualizarEstadoTCP() {
    const esTCP = datosDeclaracion.esTCP;
    const tcpWarning = document.getElementById('tcpWarning');
    const tcpAlert = document.getElementById('tcpAlert');
    const tcpNote = document.getElementById('tcpNote');
    
    if (esTCP) {
        tcpWarning.style.display = 'block';
        tcpAlert.style.display = 'flex';
        tcpNote.innerHTML = '<strong>⚠️ ATENCIÓN TCP:</strong> Los pagos a cuenta son DEFINITIVOS - SIN DEVOLUCIÓN';
        
        // Efecto visual en el toggle
        const toggle = document.getElementById('tcpToggle').parentElement;
        toggle.classList.add('tcp-active');
        
        // Destacar campos importantes para TCP
        document.querySelectorAll('#pagoTrimestre1, #pagoTrimestre2, #pagoTrimestre3, #pagoTrimestre4')
            .forEach(input => {
                input.style.border = '2px solid #fbbf24';
                input.style.background = 'rgba(251, 191, 36, 0.05)';
            });
            
        mostrarNotificacion('Modo TCP activado. Recuerde: pagos a cuenta son DEFINITIVOS.', 'tcp');
    } else {
        tcpWarning.style.display = 'none';
        tcpAlert.style.display = 'none';
        tcpNote.innerHTML = '<strong>Para TCP:</strong> Verificar cálculo antes de pagar anticipos';
        
        // Quitar estilos especiales
        document.querySelectorAll('input').forEach(input => {
            input.style.border = '';
            input.style.background = '';
        });
    }
}

function actualizarAdvertenciaTCP(saldoPagar, totalPagosCuenta, impuestoEsperado) {
    if (!datosDeclaracion.esTCP) return;
    
    if (totalPagosCuenta > impuestoEsperado) {
        const excedente = totalPagosCuenta - impuestoEsperado;
        mostrarNotificacion(
            `ADVERTENCIA TCP: Ha pagado ${formatCurrency(excedente)} de más en anticipos. ` +
            `Recuerde: los pagos a cuenta son DEFINITIVOS.`, 
            'error'
        );
    }
}

function closeWarning() {
    const warning = document.getElementById('tcpWarning');
    warning.style.transform = 'translateY(-100%)';
    warning.style.opacity = '0';
    
    setTimeout(() => {
        warning.style.display = 'none';
        warning.style.transform = '';
        warning.style.opacity = '';
    }, 300);
}

// ============================================
// SISTEMA DE NOTIFICACIONES
// ============================================

function mostrarNotificacion(mensaje, tipo = 'info') {
    const colores = {
        'info': '#2563eb',
        'exito': '#10b981',
        'advertencia': '#f59e0b',
        'error': '#ef4444',
        'tcp': '#fbbf24'
    };
    
    const iconos = {
        'info': 'fa-info-circle',
        'exito': 'fa-check-circle',
        'advertencia': 'fa-exclamation-triangle',
        'error': 'fa-times-circle',
        'tcp': 'fa-user-tie'
    };
    
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    
    notificacion.innerHTML = `
        <div class="notificacion-icono">
            <i class="fas ${iconos[tipo]}"></i>
        </div>
        <div class="notificacion-contenido">
            <p>${mensaje}</p>
        </div>
        <button class="notificacion-cerrar" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-left: 4px solid ${colores[tipo]};
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 15px;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        font-family: 'Inter', sans-serif;
    `;
    
    // Estilos internos
    const icono = notificacion.querySelector('.notificacion-icono');
    icono.style.cssText = `
        color: ${colores[tipo]};
        font-size: 1.4rem;
    `;
    
    const contenido = notificacion.querySelector('.notificacion-contenido');
    contenido.style.cssText = `
        flex: 1;
        color: #475569;
        font-size: 0.95rem;
        line-height: 1.5;
    `;
    
    const cerrarBtn = notificacion.querySelector('.notificacion-cerrar');
    cerrarBtn.style.cssText = `
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 1rem;
        padding: 5px;
        border-radius: 4px;
        transition: all 0.3s ease;
    `;
    
    cerrarBtn.onmouseover = function() {
        this.style.color = '#ef4444';
        this.style.background = '#f1f5f9';
    };
    
    cerrarBtn.onmouseout = function() {
        this.style.color = '#94a3b8';
        this.style.background = 'none';
    };
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.style.transform = 'translateX(120%)';
            setTimeout(() => notificacion.remove(), 400);
        }
    }, 5000);
}

// ============================================
// ALMACENAMIENTO LOCAL
// ============================================

function guardarDatos() {
    try {
        // Guardar en localStorage
        localStorage.setItem('dj08_datos', JSON.stringify(datosDeclaracion));
        
        // Guardar valores individuales de inputs
        const inputsData = {};
        document.querySelectorAll('input[type="number"]').forEach(input => {
            if (input.value) {
                inputsData[input.id] = input.value;
            }
        });
        localStorage.setItem('dj08_inputs', JSON.stringify(inputsData));
        
        // Guardar estado TCP
        localStorage.setItem('dj08_tcp', datosDeclaracion.esTCP);
        
    } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
    }
}

function cargarDatosGuardados() {
    try {
        // Cargar datos principales
        const datosGuardados = localStorage.getItem('dj08_datos');
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            
            // Cargar valores en inputs
            const inputsData = JSON.parse(localStorage.getItem('dj08_inputs') || '{}');
            Object.keys(inputsData).forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.value = inputsData[id];
                }
            });
            
            // Cargar estado TCP
            const tcpEstado = localStorage.getItem('dj08_tcp') === 'true';
            document.getElementById('tcpToggle').checked = tcpEstado;
            datosDeclaracion.esTCP = tcpEstado;
            
            // Actualizar cálculos
            calcularSeccionA();
            actualizarEstadoTCP();
            
            mostrarNotificacion('Datos anteriores cargados correctamente', 'exito');
        }
    } catch (e) {
        console.warn('Error cargando datos guardados:', e);
    }
}

// ============================================
// EXPORTACIÓN Y GENERACIÓN
// ============================================

function exportarDeclaracion() {
    // Efecto visual en botón
    const btn = document.querySelector('.btn-export');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exportando...';
    btn.disabled = true;
    
    // Crear objeto de exportación
    const exportData = {
        declaracion: datosDeclaracion,
        resumen: generarResumen(),
        timestamp: new Date().toISOString(),
        version: 'DJ-08 Automatizada v2.0'
    };
    
    // Crear y descargar archivo
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dj-08-declaracion-${new Date().toISOString().split('T')[0]}.json`;
    
    // Efecto de descarga
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Restaurar botón
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        mostrarNotificacion('Declaración exportada exitosamente', 'exito');
    }, 1000);
}

function generarDeclaracion() {
    // Validar datos antes de generar
    if (!validarDeclaracionCompleta()) {
        mostrarNotificacion('Complete todos los campos requeridos antes de generar', 'advertencia');
        return;
    }
    
    // Efecto visual
    const btn = document.querySelector('.btn-generar');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    btn.disabled = true;
    
    // Simulación de generación de PDF
    setTimeout(() => {
        const resumen = generarResumen();
        
        // Mostrar resumen
        const mensaje = `
DECLARACIÓN DJ-08 - RESUMEN

📊 INGRESOS NETOS: ${formatCurrency(datosDeclaracion.seccionA.ingresosNetos)}
⚖️ UTILIDAD IMPONIBLE: ${formatCurrency(datosDeclaracion.seccionC.utilidadNetaImponible)}
💰 IMPUESTO BRUTO: ${formatCurrency(datosDeclaracion.seccionD.impuestoBruto)}
💳 PAGOS A CUENTA: ${formatCurrency(datosDeclaracion.seccionD.totalPagosCuenta)}
🎯 SALDO A PAGAR: ${formatCurrency(datosDeclaracion.seccionD.saldoPagar)}

${datosDeclaracion.esTCP ? '⚠️ MODO TCP: LOS PAGOS SON DEFINITIVOS' : ''}
        `.trim();
        
        alert(mensaje);
        
        // Restaurar botón
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        
        mostrarNotificacion('Declaración generada exitosamente. En producción se generaría el PDF.', 'exito');
    }, 1500);
}

function generarResumen() {
    return {
        ingresosNetos: datosDeclaracion.seccionA.ingresosNetos,
        utilidadAntesAjustes: datosDeclaracion.seccionB.utilidadAntesAjustes,
        utilidadNetaImponible: datosDeclaracion.seccionC.utilidadNetaImponible,
        impuestoCalculado: datosDeclaracion.seccionD.impuestoBruto,
        pagosACuenta: datosDeclaracion.seccionD.totalPagosCuenta,
        saldoAPagar: datosDeclaracion.seccionD.saldoPagar,
        esTCP: datosDeclaracion.esTCP,
        fechaGeneracion: new Date().toISOString()
    };
}

function validarDeclaracionCompleta() {
    const camposRequeridos = [
        'ventasPeriodo',
        'costoVentas',
        'tipoImpositivo'
    ];
    
    for (const campo of camposRequeridos) {
        const elemento = document.getElementById(campo);
        if (!elemento || !elemento.value || parseFloat(elemento.value) === 0) {
            // Destacar campo faltante
            elemento.style.borderColor = '#ef4444';
            elemento.style.animation = 'pulse 1s';
            
            setTimeout(() => {
                elemento.style.borderColor = '';
                elemento.style.animation = '';
            }, 2000);
            
            return false;
        }
    }
    
    return true;
}

// ============================================
// RESET Y NUEVA DECLARACIÓN
// ============================================

function resetForm() {
    if (confirm('¿Está seguro de que desea comenzar una nueva declaración?\n\nSe perderán todos los datos actuales.')) {
        // Efecto visual
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.3s';
        
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
        setTimeout(() => {
            calcularSeccionA();
            document.body.style.opacity = '1';
        }, 300);
        
        // Volver a primera sección
        showSection('seccion-a');
        
        // Limpiar localStorage
        localStorage.removeItem('dj08_datos');
        localStorage.removeItem('dj08_inputs');
        localStorage.removeItem('dj08_tcp');
        
        mostrarNotificacion('Nueva declaración iniciada. Complete los datos paso a paso.', 'info');
    }
}

// ============================================
// MODAL DE AYUDA
// ============================================

function showHelp() {
    const modal = document.getElementById('helpModal');
    modal.style.display = 'block';
    
    // Animar entrada
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Cerrar al hacer click fuera
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeHelp();
        }
    };
}

function closeHelp() {
    const modal = document.getElementById('helpModal');
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// ============================================
// EFECTOS VISUALES ADICIONALES
// ============================================

// Añadir estilos para animaciones
const efectosStyle = document.createElement('style');
efectosStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .calculando {
        animation: pulse 0.5s ease-in-out;
        color: #2563eb !important;
    }
    
    .notificacion {
        animation: slideInRight 0.4s ease-out;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(120%); }
        to { transform: translateX(0); }
    }
    
    .tcp-active .slider {
        background: #fbbf24 !important;
    }
    
    .tcp-active .slider:before {
        background: white;
        transform: translateX(30px);
    }
`;
document.head.appendChild(efectosStyle);

// ============================================
// INICIALIZACIÓN FINAL
// ============================================

// Verificar si hay datos guardados al cargar
window.addEventListener('load', function() {
    // Pequeño retraso para que todo cargue
    setTimeout(() => {
        if (localStorage.getItem('dj08_datos')) {
            if (confirm('¿Desea cargar la declaración anterior?')) {
                cargarDatosGuardados();
            }
        }
    }, 1000);
});

// Prevenir pérdida de datos al cerrar
window.addEventListener('beforeunload', function(e) {
    if (Object.values(datosDeclaracion.seccionA).some(v => v > 0)) {
        e.preventDefault();
        e.returnValue = '¿Está seguro de querer salir? Los datos no guardados se perderán.';
        return e.returnValue;
    }
});

console.log('✅ DJ-08 Automatizada v2.0 - Sistema cargado exitosamente');
