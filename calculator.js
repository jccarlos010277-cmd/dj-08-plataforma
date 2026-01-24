// calculator.js - Calculadora de Impuesto Mensual

let datosCalculadora = {
    impuestos: [
        { id: 1, nombre: 'Impuesto sobre Utilidades', tasa: 35, activo: true },
        { id: 2, nombre: 'Contribución a la Seguridad Social', tasa: 5, activo: true }
    ],
    ingresosMensuales: 0,
    resultados: {}
};

let taxChart = null;

// Inicializar calculadora
function initCalculator() {
    cargarImpuestos();
    setupChart();
    cargarResultadosGuardados();
}

function cargarImpuestos() {
    const taxesList = document.getElementById('taxesList');
    taxesList.innerHTML = '';
    
    datosCalculadora.impuestos.forEach((impuesto, index) => {
        const taxItem = document.createElement('div');
        taxItem.className = 'tax-item';
        taxItem.innerHTML = `
            <div class="tax-info">
                <div class="tax-name">${impuesto.nombre}</div>
                <div class="tax-rate">${impuesto.tasa}%</div>
            </div>
            <div class="tax-actions">
                <button class="btn-edit" onclick="editTax(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteTax(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taxesList.appendChild(taxItem);
    });
    
    // Calcular después de cargar
    calculateMonthlyTax();
}

function addTax() {
    const name = document.getElementById('taxName').value.trim();
    const rate = parseFloat(document.getElementById('taxRate').value);
    
    if (!name || isNaN(rate) || rate <= 0) {
        alert('Por favor, ingresa un nombre y tasa válidos');
        return;
    }
    
    const nuevoImpuesto = {
        id: Date.now(),
        nombre: name,
        tasa: rate,
        activo: true
    };
    
    datosCalculadora.impuestos.push(nuevoImpuesto);
    cargarImpuestos();
    
    // Limpiar formulario
    document.getElementById('taxName').value = '';
    document.getElementById('taxRate').value = '';
    
    showConfirmation('Impuesto añadido correctamente', 'success');
}

function editTax(index) {
    const impuesto = datosCalculadora.impuestos[index];
    const nuevoNombre = prompt('Nuevo nombre del impuesto:', impuesto.nombre);
    if (nuevoNombre === null) return;
    
    const nuevaTasa = prompt('Nueva tasa (%):', impuesto.tasa);
    if (nuevaTasa === null) return;
    
    const tasaNum = parseFloat(nuevaTasa);
    if (isNaN(tasaNum) || tasaNum < 0) {
        alert('Tasa inválida');
        return;
    }
    
    impuesto.nombre = nuevoNombre;
    impuesto.tasa = tasaNum;
    
    cargarImpuestos();
    showConfirmation('Impuesto actualizado', 'success');
}

function deleteTax(index) {
    if (confirm('¿Eliminar este impuesto?')) {
        datosCalculadora.impuestos.splice(index, 1);
        cargarImpuestos();
        showConfirmation('Impuesto eliminado', 'success');
    }
}

function setPresetTax(name, rate) {
    document.getElementById('taxName').value = name;
    document.getElementById('taxRate').value = rate;
    
    showConfirmation(`Tasa predefinida "${name}" cargada`, 'info');
}

function calculateMonthlyTax() {
    const income = parseFloat(document.getElementById('monthlyIncome').value) || 0;
    const month = parseInt(document.getElementById('monthSelect').value);
    
    datosCalculadora.ingresosMensuales = income;
    
    // Calcular impuestos activos
    let totalTax = 0;
    const breakdown = [];
    
    datosCalculadora.impuestos.forEach(impuesto => {
        if (impuesto.activo) {
            const taxAmount = income * (impuesto.tasa / 100);
            totalTax += taxAmount;
            breakdown.push({
                name: impuesto.nombre,
                rate: impuesto.tasa,
                amount: taxAmount
            });
        }
    });
    
    const netIncome = income - totalTax;
    
    // Actualizar UI
    document.getElementById('monthlyGross').textContent = formatCurrency(income);
    document.getElementById('monthlyTaxTotal').textContent = formatCurrency(totalTax);
    document.getElementById('monthlyNet').textContent = formatCurrency(netIncome);
    
    // Actualizar desglose
    const taxBreakdown = document.getElementById('taxBreakdown');
    taxBreakdown.innerHTML = '';
    
    breakdown.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'breakdown-item';
        itemDiv.innerHTML = `
            <span>${item.name} (${item.rate}%):</span>
            <span>${formatCurrency(item.amount)}</span>
        `;
        taxBreakdown.appendChild(itemDiv);
    });
    
    // Actualizar proyección anual
    updateAnnualProjection(income, totalTax);
    
    // Actualizar gráfico
    updateChart(breakdown, income);
    
    // Guardar resultados
    datosCalculadora.resultados[month] = {
        income,
        totalTax,
        netIncome,
        breakdown
    };
    
    saveCalculatorData();
}

function updateAnnualProjection(monthlyIncome, monthlyTax) {
    const annualIncome = monthlyIncome * 12;
    const annualTax = monthlyTax * 12;
    const effectiveRate = annualIncome > 0 ? (annualTax / annualIncome * 100).toFixed(2) : 0;
    
    document.getElementById('annualIncome').textContent = formatCurrency(annualIncome);
    document.getElementById('annualTax').textContent = formatCurrency(annualTax);
    document.getElementById('effectiveRate').textContent = `${effectiveRate}%`;
}

function setupChart() {
    const ctx = document.getElementById('taxChart').getContext('2d');
    
    taxChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#3498db', // Azul
                    '#2ecc71', // Verde
                    '#e74c3c', // Rojo
                    '#f39c12', // Naranja
                    '#9b59b6', // Púrpura
                    '#1abc9c', // Turquesa
                    '#34495e', // Azul oscuro
                    '#e67e22', // Naranja oscuro
                    '#27ae60', // Verde oscuro
                    '#8e44ad'  // Púrpura oscuro
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateChart(breakdown, totalIncome) {
    if (!taxChart) return;
    
    const labels = breakdown.map(item => item.name);
    const data = breakdown.map(item => item.amount);
    
    // Añadir ingreso neto si hay datos
    if (totalIncome > 0) {
        const netIncome = totalIncome - data.reduce((a, b) => a + b, 0);
        labels.push('Ingreso Neto');
        data.push(netIncome);
    }
    
    taxChart.data.labels = labels;
    taxChart.data.datasets[0].data = data;
    taxChart.update();
}

function exportMonthlyReport() {
    const income = datosCalculadora.ingresosMensuales;
    const month = document.getElementById('monthSelect').value;
    const monthName = document.getElementById('monthSelect').options[month-1].text;
    
    if (income <= 0) {
        alert('Por favor, ingresa un ingreso válido antes de exportar');
        return;
    }
    
    const report = {
        fecha: new Date().toISOString(),
        mes: monthName,
        ingresos: income,
        desglose: datosCalculadora.impuestos.filter(t => t.activo).map(t => ({
            impuesto: t.nombre,
            tasa: t.tasa,
            monto: income * (t.tasa / 100)
        })),
        totalImpuestos: datosCalculadora.resultados[month]?.totalTax || 0,
        ingresoNeto: datosCalculadora.resultados[month]?.netIncome || 0
    };
    
    // Crear contenido para CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Reporte Mensual DJ-08\n\n";
    csvContent += `Mes,${monthName}\n`;
    csvContent += `Ingreso Bruto,${formatCurrency(income)}\n\n`;
    csvContent += "Impuesto,Tasa %,Monto\n";
    
    report.desglose.forEach(item => {
        csvContent += `${item.impuesto},${item.tasa}%,${formatCurrency(item.monto)}\n`;
    });
    
    csvContent += `\nTotal Impuestos,${formatCurrency(report.totalImpuestos)}\n`;
    csvContent += `Ingreso Neto,${formatCurrency(report.ingresoNeto)}\n`;
    
    // Crear enlace de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte-${monthName.toLowerCase()}-${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showConfirmation('Reporte exportado exitosamente', 'success');
}

function compareScenarios() {
    const modal = document.getElementById('compareModal');
    const compareGrid = document.getElementById('compareGrid');
    
    // Limpiar grid
    compareGrid.innerHTML = '';
    
    // Añadir escenario actual
    addScenarioToGrid('Escenario Actual', datosCalculadora);
    
    // Añadir escenario con 10% más de ingresos
    const scenarioPlus10 = JSON.parse(JSON.stringify(datosCalculadora));
    scenarioPlus10.ingresosMensuales *= 1.1;
    calculateScenario(scenarioPlus10);
    addScenarioToGrid('+10% Ingresos', scenarioPlus10);
    
    // Añadir escenario con tasas reducidas
    const scenarioReduced = JSON.parse(JSON.stringify(datosCalculadora));
    scenarioReduced.impuestos.forEach(tax => {
        tax.tasa *= 0.9; // Reducir 10%
    });
    calculateScenario(scenarioReduced);
    addScenarioToGrid('Tasas -10%', scenarioReduced);
    
    // Mostrar modal
    modal.style.display = 'block';
}

function addScenarioToGrid(name, data) {
    const compareGrid = document.getElementById('compareGrid');
    
    const income = data.ingresosMensuales;
    const totalTax = data.impuestos
        .filter(t => t.activo)
        .reduce((sum, tax) => sum + (income * (tax.tasa / 100)), 0);
    const netIncome = income - totalTax;
    const effectiveRate = income > 0 ? (totalTax / income * 100).toFixed(2) : 0;
    
    const scenarioCard = document.createElement('div');
    scenarioCard.className = 'scenario-card';
    scenarioCard.innerHTML = `
        <div class="scenario-header">
            <h5>${name}</h5>
            <button class="btn-scenario-delete" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="scenario-content">
            <div class="scenario-stat">
                <span>Ingreso Bruto:</span>
                <strong>${formatCurrency(income)}</strong>
            </div>
            <div class="scenario-stat">
                <span>Total Impuestos:</span>
                <strong>${formatCurrency(totalTax)}</strong>
            </div>
            <div class="scenario-stat">
                <span>Ingreso Neto:</span>
                <strong>${formatCurrency(netIncome)}</strong>
            </div>
            <div class="scenario-stat">
                <span>Tasa Efectiva:</span>
                <strong>${effectiveRate}%</strong>
            </div>
        </div>
    `;
    
    compareGrid.appendChild(scenarioCard);
}

function addScenario() {
    const scenarioName = prompt('Nombre del nuevo escenario:');
    if (!scenarioName) return;
    
    // Crear copia de datos actuales
    const newScenario = JSON.parse(JSON.stringify(datosCalculadora));
    
    // Permitir modificar ingresos
    const newIncome = prompt('Ingreso mensual para este escenario:', newScenario.ingresosMensuales);
    if (newIncome !== null) {
        newScenario.ingresosMensuales = parseFloat(newIncome) || 0;
    }
    
    // Permitir modificar tasas
    if (confirm('¿Desea modificar las tasas impositivas?')) {
        newScenario.impuestos.forEach((tax, index) => {
            const newRate = prompt(`Nueva tasa para ${tax.nombre} (%):`, tax.tasa);
            if (newRate !== null) {
                tax.tasa = parseFloat(newRate) || tax.tasa;
            }
        });
    }
    
    // Calcular y añadir
    calculateScenario(newScenario);
    addScenarioToGrid(scenarioName, newScenario);
    
    showConfirmation('Escenario añadido', 'success');
}

function calculateScenario(scenario) {
    const income = scenario.ingresosMensuales;
   