// calculator.js - Calculadora Actualizada según Normativa 2025

let datosCalculadora = {
    impuestos: [
        { 
            id: 1, 
            nombre: 'Pago a Cuenta Mensual TCP', 
            tasa: 5, 
            activo: true,
            descripcion: '5% sobre ingresos brutos (después de mínimo exento mensual)',
            esDefinitivo: true
        },
        { 
            id: 2, 
            nombre: 'Seguridad Social', 
            tasa: 20, 
            activo: true,
            descripcion: '20% sobre base seleccionada',
            baseMinima: 2000
        },
        { 
            id: 3, 
            nombre: 'Impuesto sobre Ventas', 
            tasa: 10, 
            activo: false,
            descripcion: 'Aplicable según actividad'
        }
    ],
    ingresosMensuales: 0,
    resultados: {},
    escalaProgresiva: [], // Se cargará desde normativas.json
    parametrosFiscales: {}
};

// Cargar normativas al inicio
async function cargarNormativas() {
    try {
        const response = await fetch('normativas.json');
        const normativas = await response.json();
        
        datosCalculadora.escalaProgresiva = normativas.normativas.escala_progresiva;
        datosCalculadora.parametrosFiscales = normativas.normativas.parametros_fiscales;
        datosCalculadora.advertencias = normativas.normativas.advertencias_tcp;
        datosCalculadora.reglasOro = normativas.normativas.reglas_oro;
        
        console.log('Normativas fiscales 2025 cargadas correctamente');
    } catch (error) {
        console.error('Error cargando normativas:', error);
        // Valores por defecto en caso de error
        datosCalculadora.parametrosFiscales = {
            minimo_exento_anual: 39120,
            minimo_exento_mensual: 3260,
            porcentaje_pago_cuenta: 5
        };
    }
}

// Inicializar calculadora con normativas
function initCalculator() {
    cargarNormativas().then(() => {
        cargarImpuestos();
        setupChart();
        cargarResultadosGuardados();
        mostrarAdvertenciasTCP();
    });
}

// Mostrar advertencias importantes para TCP
function mostrarAdvertenciasTCP() {
    const tcpToggle = document.getElementById('tcpToggle');
    if (tcpToggle && tcpToggle.checked && datosCalculadora.advertencias) {
        showConfirmation(`⚠️ ${datosCalculadora.advertencias.pagos_a_cuenta}`, 'warning');
    }
}

// CALCULO DE PAGO MENSUAL TCP (5% sobre excedente)
function calcularPagoMensualTCP(ingresoMensual) {
    const minimoExentoMensual = datosCalculadora.parametrosFiscales.minimo_exento_mensual || 3260;
    const porcentajePago = datosCalculadora.parametrosFiscales.porcentaje_pago_cuenta || 5;
    
    if (ingresoMensual <= minimoExentoMensual) {
        return 0; // No paga si no supera el mínimo exento
    }
    
    const baseCalculo = ingresoMensual - minimoExentoMensual;
    const pagoMensual = baseCalculo * (porcentajePago / 100);
    
    return pagoMensual;
}

// CALCULO DE SEGURIDAD SOCIAL (20% sobre base seleccionada)
function calcularSeguridadSocial(baseSeguridadSocial) {
    const tasaSS = 20; // 20% fijo
    const baseMinima = datosCalculadora.parametrosFiscales.seguridad_social?.base_minima || 2000;
    
    // Asegurar que la base no sea menor al mínimo
    const baseCalculo = Math.max(baseSeguridadSocial, baseMinima);
    const aporteSS = baseCalculo * (tasaSS / 100);
    
    return {
        aporte: aporteSS,
        base: baseCalculo,
        tasa: tasaSS
    };
}

// CALCULO DE LIQUIDACIÓN ANUAL CON ESCALA PROGRESIVA
function calcularLiquidacionAnual(ingresoAnual, gastosAnuales) {
    const minimoExentoAnual = datosCalculadora.parametrosFiscales.minimo_exento_anual || 39120;
    
    // 1. Calcular Utilidad Imponible
    let utilidadImponible = ingresoAnual - gastosAnuales;
    
    // 2. Aplicar mínimo exento
    utilidadImponible = Math.max(0, utilidadImponible - minimoExentoAnual);
    
    // Si la utilidad después del mínimo exento es 0 o negativa
    if (utilidadImponible <= 0) {
        return {
            utilidadImponible: 0,
            impuestoBruto: 0,
            impuestoNeto: 0,
            tramos: [],
            mensaje: 'No tiene impuesto a pagar (no supera el mínimo exento)'
        };
    }
    
    // 3. Aplicar escala progresiva
    let impuestoAcumulado = 0;
    let utilidadRestante = utilidadImponible;
    const tramosAplicados = [];
    
    // Ordenar escala de menor a mayor
    const escalaOrdenada = [...datosCalculadora.escalaProgresiva].sort((a, b) => a.limite_inferior - b.limite_inferior);
    
    for (const tramo of escalaOrdenada) {
        if (utilidadRestante <= 0) break;
        
        const limiteSuperior = tramo.limite_superior === null ? Infinity : tramo.limite_superior;
        const baseTramo = Math.min(utilidadRestante, limiteSuperior - tramo.limite_inferior);
        
        if (baseTramo > 0) {
            const impuestoTramo = baseTramo * (tramo.porcentaje / 100);
            impuestoAcumulado += impuestoTramo;
            
            tramosAplicados.push({
                tramo: tramo.descripcion,
                base: baseTramo,
                tasa: tramo.porcentaje,
                impuesto: impuestoTramo
            });
            
            utilidadRestante -= baseTramo;
        }
    }
    
    return {
        utilidadImponible: utilidadImponible,
        impuestoBruto: impuestoAcumulado,
        impuestoNeto: impuestoAcumulado, // Sin bonificaciones por ahora
        tramos: tramosAplicados,
        mensaje: `Liquidación calculada con escala progresiva 2025`
    };
}

// FUNCIÓN PRINCIPAL ACTUALIZADA - CALCULO MENSUAL
function calculateMonthlyTax() {
    const income = parseFloat(document.getElementById('monthlyIncome').value) || 0;
    const month = parseInt(document.getElementById('monthSelect').value);
    
    datosCalculadora.ingresosMensuales = income;
    
    // Calcular impuestos activos
    let totalTax = 0;
    const breakdown = [];
    
    datosCalculadora.impuestos.forEach(impuesto => {
        if (impuesto.activo) {
            let taxAmount = 0;
            
            if (impuesto.nombre === 'Pago a Cuenta Mensual TCP') {
                // Cálculo especial para TCP (5% sobre excedente)
                taxAmount = calcularPagoMensualTCP(income);
                
                breakdown.push({
                    name: impuesto.nombre,
                    rate: impuesto.tasa,
                    amount: taxAmount,
                    descripcion: `5% sobre $${(income - 3260).toFixed(2)} (ingreso - mínimo exento)`,
                    esDefinitivo: true
                });
                
            } else if (impuesto.nombre === 'Seguridad Social') {
                // Preguntar base para seguridad social
                const baseSS = prompt(`Ingrese la base para Seguridad Social (mínimo ${impuesto.baseMinima} CUP):`, impuesto.baseMinima) || impuesto.baseMinima;
                const calculoSS = calcularSeguridadSocial(parseFloat(baseSS));
                
                taxAmount = calculoSS.aporte;
                
                breakdown.push({
                    name: impuesto.nombre,
                    rate: impuesto.tasa,
                    amount: taxAmount,
                    descripcion: `20% sobre base de $${calculoSS.base.toFixed(2)}`,
                    base: calculoSS.base
                });
                
            } else {
                // Cálculo normal para otros impuestos
                taxAmount = income * (impuesto.tasa / 100);
                breakdown.push({
                    name: impuesto.nombre,
                    rate: impuesto.tasa,
                    amount: taxAmount
                });
            }
            
            totalTax += taxAmount;
        }
    });
    
    const netIncome = income - totalTax;
    
    // Actualizar UI
    actualizarUIResultados(income, totalTax, netIncome, breakdown, month);
    
    // Actualizar proyección anual
    updateAnnualProjection(income, totalTax);
    
    // Actualizar gráfico
    updateChart(breakdown, income);
    
    // Guardar resultados
    datosCalculadora.resultados[month] = {
        income,
        totalTax,
        netIncome,
        breakdown,
        fecha: new Date().toISOString(),
        esDefinitivo: breakdown.some(item => item.esDefinitivo)
    };
    
    saveCalculatorData();
    
    // Mostrar advertencia si hay pagos definitivos
    if (breakdown.some(item => item.esDefinitivo)) {
        mostrarAdvertenciaPagosDefinitivos();
    }
}

// Función auxiliar para actualizar UI
function actualizarUIResultados(income, totalTax, netIncome, breakdown, month) {
    document.getElementById('monthlyGross').textContent = formatCurrency(income);
    document.getElementById('monthlyTaxTotal').textContent = formatCurrency(totalTax);
    document.getElementById('monthlyNet').textContent = formatCurrency(netIncome);
    
    // Actualizar desglose
    const taxBreakdown = document.getElementById('taxBreakdown');
    taxBreakdown.innerHTML = '';
    
    breakdown.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'breakdown-item';
        
        let descripcionExtra = '';
        if (item.descripcion) {
            descripcionExtra = `<br><small class="breakdown-desc">${item.descripcion}</small>`;
        }
        
        if (item.esDefinitivo) {
            itemDiv.classList.add('definitivo');
            descripcionExtra += ' <span class="badge-definitivo">DEFINITIVO</span>';
        }
        
        itemDiv.innerHTML = `
            <div class="breakdown-info">
                <span class="breakdown-name">${item.name} (${item.rate}%)</span>
                ${descripcionExtra}
            </div>
            <span class="breakdown-amount">${formatCurrency(item.amount)}</span>
        `;
        taxBreakdown.appendChild(itemDiv);
    });
}

// Función para mostrar advertencia de pagos definitivos
function mostrarAdvertenciaPagosDefinitivos() {
    const advertenciaDiv = document.createElement('div');
    advertenciaDiv.className = 'advertencia-tcp';
    advertenciaDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <strong>ADVERTENCIA TCP:</strong> Los pagos a cuenta mensuales son DEFINITIVOS. 
        No serán reembolsados si la liquidación anual resulta menor.
    `;
    
    const resultsContainer = document.querySelector('.results-monthly');
    if (resultsContainer && !resultsContainer.querySelector('.advertencia-tcp')) {
        resultsContainer.insertBefore(advertenciaDiv, resultsContainer.firstChild);
    }
}

// SIMULADOR DE LIQUIDACIÓN ANUAL (NUEVA FUNCIÓN)
function simularLiquidacionAnual() {
    const ingresoAnual = datosCalculadora.ingresosMensuales * 12;
    const gastosAnuales = parseFloat(prompt('Ingrese el total de gastos anuales deducibles:', '0')) || 0;
    
    const resultado = calcularLiquidacionAnual(ingresoAnual, gastosAnuales);
    
    // Mostrar resultados en modal
    mostrarResultadosLiquidacion(resultado, ingresoAnual, gastosAnuales);
}

// Mostrar resultados de liquidación anual
function mostrarResultadosLiquidacion(resultado, ingresoAnual, gastosAnuales) {
    const modal = document.createElement('div');
    modal.className = 'modal-liquidacion';
    modal.innerHTML = `
        <div class="modal-content-liquidacion">
            <div class="modal-header">
                <h3><i class="fas fa-file-invoice-dollar"></i> Simulación Liquidación Anual 2025</h3>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="resumen-liquidacion">
                    <h4>Resumen Fiscal</h4>
                    <div class="resumen-item">
                        <span>Ingreso Anual Bruto:</span>
                        <strong>${formatCurrency(ingresoAnual)}</strong>
                    </div>
                    <div class="resumen-item">
                        <span>Gastos Deducibles:</span>
                        <strong>${formatCurrency(gastosAnuales)}</strong>
                    </div>
                    <div class="resumen-item">
                        <span>Utilidad Imponible:</span>
                        <strong>${formatCurrency(resultado.utilidadImponible)}</strong>
                    </div>
                    <div class="resumen-item destacado">
                        <span>Impuesto Anual Calculado:</span>
                        <strong>${formatCurrency(resultado.impuestoBruto)}</strong>
                    </div>
                </div>
                
                <div class="tramos-liquidacion">
                    <h4>Tramos Aplicados (Escala Progresiva)</h4>
                    ${resultado.tramos.map(tramo => `
                        <div class="tramo-item">
                            <span>${tramo.tramo}</span>
                            <div>
                                <small>Base: ${formatCurrency(tramo.base)}</small>
                                <small>Tasa: ${tramo.tasa}%</small>
                                <strong>Impuesto: ${formatCurrency(tramo.impuesto)}</strong>
                            </div>
                        </div>
                    `).join('')}
                    
                    ${resultado.tramos.length === 0 ? 
                        '<p class="sin-impuesto">✅ No aplica impuesto (no supera el mínimo exento)</p>' : ''}
                </div>
                
                <div class="advertencia-liquidacion">
                    <i class="fas fa-info-circle"></i>
                    <p>${datosCalculadora.reglasOro?.join('<br>') || ''}</p>
                </div>
                
                <button class="btn-export-liquidacion" onclick="exportarLiquidacionAnual(${JSON.stringify(resultado).replace(/"/g, '&quot;')}, ${ingresoAnual}, ${gastosAnuales})">
                    <i class="fas fa-download"></i> Exportar Simulación
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Exportar liquidación anual
function exportarLiquidacionAnual(resultado, ingresoAnual, gastosAnuales) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Simulación Liquidación Anual DJ-08 2025\n\n";
    csvContent += "Concepto,Monto (CUP)\n";
    csvContent += `Ingreso Anual Bruto,${ingresoAnual}\n`;
    csvContent += `Gastos Deducibles,${gastosAnuales}\n`;
    csvContent += `Utilidad Imponible,${resultado.utilidadImponible}\n`;
    csvContent += `Impuesto Anual Calculado,${resultado.impuestoBruto}\n\n`;
    
    if (resultado.tramos.length > 0) {
        csvContent += "Tramos Aplicados\n";
        csvContent += "Descripción,Base,Tasa%,Impuesto\n";
        resultado.tramos.forEach(tramo => {
            csvContent += `${tramo.tramo},${tramo.base},${tramo.tasa},${tramo.impuesto}\n`;
        });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `liquidacion-anual-${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showConfirmation('Simulación exportada correctamente', 'success');
}

// Añadir botón de simulación anual en la UI
function agregarBotonSimulacionAnual() {
    const calculatorCard = document.querySelector('.calculator-card:nth-child(3)');
    if (calculatorCard && !calculatorCard.querySelector('.btn-simular-anual')) {
        const btnSimular = document.createElement('button');
        btnSimular.className = 'btn-simular-anual';
        btnSimular.innerHTML = '<i class="fas fa-calculator"></i> Simular Liquidación Anual';
        btnSimular.onclick = simularLiquidacionAnual;
        
        const exportOptions = calculatorCard.querySelector('.export-options');
        if (exportOptions) {
            exportOptions.appendChild(btnSimular);
        }
    }
}

// Inicializar botón después de cargar
setTimeout(agregarBotonSimulacionAnual, 1000);

// ACTUALIZAR LA FUNCIÓN addTax() para incluir impuestos nuevos
function addTax() {
    const name = document.getElementById('taxName').value.trim();
    const rate = parseFloat(document.getElementById('taxRate').value);
    
    if (!name || isNaN(rate) || rate <= 0) {
        alert('Por favor, ingresa un nombre y tasa válidos');
        return;
    }
    
    // Determinar si es definitivo (para TCP)
    const esDefinitivo = name.toLowerCase().includes('tcp') || 
                        name.toLowerCase().includes('pago a cuenta');
    
    const nuevoImpuesto = {
        id: Date.now(),
        nombre: name,
        tasa: rate,
        activo: true,
        esDefinitivo: esDefinitivo,
        descripcion: esDefinitivo ? 'Pago definitivo mensual TCP' : ''
    };
    
    datosCalculadora.impuestos.push(nuevoImpuesto);
    cargarImpuestos();
    
    document.getElementById('taxName').value = '';
    document.getElementById('taxRate').value = '';
    
    showConfirmation('Impuesto añadido correctamente', 'success');
}
