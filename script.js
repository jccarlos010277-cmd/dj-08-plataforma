// script.js - Funcionalidades Mejoradas (Versión Corregida)

// Declarar variables globales necesarias
let datosDeclaracion = {
    seccionA: {},
    seccionB: {},
    seccionC: {},
    seccionD: {}
};

// Carrusel del Banner
let currentSlide = 1;
const totalSlides = 3;

function nextSlide() {
    currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1;
    updateSlide();
}

function prevSlide() {
    currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
    updateSlide();
}

function updateSlide() {
    // Ocultar todos los slides
    document.querySelectorAll('.hero-slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Mostrar slide actual
    const currentSlideElement = document.querySelector(`.hero-slide[data-slide="${currentSlide}"]`);
    if (currentSlideElement) {
        currentSlideElement.classList.add('active');
    }
    
    // Actualizar dots
    document.querySelectorAll('.dot').forEach(dot => {
        dot.classList.remove('active');
        if (parseInt(dot.dataset.slide) === currentSlide) {
            dot.classList.add('active');
        }
    });
}

// Auto avanzar el carrusel cada 5 segundos
let carruselInterval = setInterval(nextSlide, 5000);

// Detener carrusel al interactuar
document.querySelectorAll('.hero-prev, .hero-next, .dot').forEach(element => {
    element.addEventListener('click', () => {
        clearInterval(carruselInterval);
        carruselInterval = setInterval(nextSlide, 5000);
    });
});

// Inicializar Dashboard
function initDashboard() {
    // Mostrar estadísticas
    updateQuickStats();
    
    // Cargar datos recientes si existen
    loadRecentData();
}

function updateQuickStats() {
    // En una implementación real, esto vendría de una API
    console.log('Dashboard inicializado');
}

function loadRecentData() {
    // Cargar última declaración del localStorage
    const lastDeclaration = localStorage.getItem('lastDeclaration');
    if (lastDeclaration) {
        try {
            datosDeclaracion = JSON.parse(lastDeclaration);
            console.log('Última declaración cargada del localStorage');
        } catch (error) {
            console.error('Error al cargar datos guardados:', error);
        }
    }
}

// Guía Paso a Paso
function iniciarGuia() {
    const messages = [
        "Bienvenido a la Guía DJ-08. Empecemos...",
        "Paso 1: Recolecta tus ingresos del año",
        "Paso 2: Registra ventas brutas y devoluciones",
        "Paso 3: Ingresa tus gastos deducibles",
        "Paso 4: Ajusta según normativas fiscales",
        "Paso 5: Calcula tu impuesto final",
        "¡Listo! Tu DJ-08 está completa."
    ];
    
    let step = 0;
    
    function showNextStep() {
        if (step < messages.length) {
            // Crear un modal mejorado para la guía
            const modal = document.createElement('div');
            modal.className = 'guide-modal';
            modal.innerHTML = `
                <div class="guide-content">
                    <h3><i class="fas fa-compass"></i> Guía DJ-08 - Paso ${step + 1}</h3>
                    <p>${messages[step]}</p>
                    <div class="guide-actions">
                        ${step < messages.length - 1 ? 
                            `<button onclick="this.parentElement.parentElement.parentElement.remove(); showNextStep();" class="btn-primary">
                                Siguiente Paso <i class="fas fa-arrow-right"></i>
                            </button>` : 
                            `<button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-success">
                                Finalizar Guía <i class="fas fa-check"></i>
                            </button>`
                        }
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-secondary">
                            Salir de la Guía
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            step++;
        }
    }
    
    showNextStep();
}

// Actualizar navegación mejorada
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.form-section, .dashboard-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar sección seleccionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        
        // Si es la calculadora, inicializarla
        if (sectionId === 'impuesto-mensual') {
            setTimeout(() => {
                if (typeof initCalculator === 'function') {
                    initCalculator();
                }
            }, 100);
        }
    }

    // Actualizar navegación visual
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(sectionId)) {
            link.classList.add('active');
        }
    });

    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mostrar ayuda
function showHelp() {
    const helpContent = `
        <div class="help-content">
            <h3><i class="fas fa-question-circle"></i> Centro de Ayuda DJ-08</h3>
            <div class="help-sections">
                <div class="help-section">
                    <h4><i class="fas fa-video"></i> Tutoriales</h4>
                    <ul>
                        <li>📹 Cómo usar la calculadora mensual</li>
                        <li>📹 Guía completa de la DJ-08</li>
                        <li>📹 Cómo exportar tus reportes</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4><i class="fas fa-file-alt"></i> Documentación</h4>
                    <ul>
                        <li>📄 Normativa fiscal 2025</li>
                        <li>📄 Instrucciones para TCP</li>
                        <li>📄 Preguntas frecuentes</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4><i class="fas fa-phone-alt"></i> Soporte</h4>
                    <p><i class="fas fa-envelope"></i> soporte@dj08.com</p>
                    <p><i class="fas fa-phone"></i> +53 123 456 7890</p>
                </div>
            </div>
        </div>
    `;
    
    // Crear modal de ayuda
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-question-circle"></i> Ayuda</h3>
                <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="modal-body">
                ${helpContent}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Guardar datos automáticamente
function autoSave() {
    try {
        const datosCompletos = {
            timestamp: new Date().toISOString(),
            datos: datosDeclaracion,
            calculadora: window.datosCalculadora || {}
        };
        
        localStorage.setItem('dj08_autosave', JSON.stringify(datosCompletos));
        console.log('Datos guardados automáticamente:', new Date().toLocaleTimeString());
    } catch (error) {
        console.error('Error en autoSave:', error);
    }
}

// Auto-guardar cada 30 segundos
let autoSaveInterval = setInterval(autoSave, 30000);

// Cargar datos guardados al inicio
window.addEventListener('load', function() {
    try {
        const savedData = localStorage.getItem('dj08_autosave');
        if (savedData) {
            if (confirm('¿Desea recuperar los datos de su última sesión?')) {
                const datos = JSON.parse(savedData);
                datosDeclaracion = datos.datos || datosDeclaracion;
                
                // Actualizar datos de calculadora si existe
                if (datos.calculadora && window.datosCalculadora) {
                    window.datosCalculadora = { ...window.datosCalculadora, ...datos.calculadora };
                }
                
                actualizarDatosUI();
                showConfirmation('Datos recuperados correctamente', 'success');
            }
        }
    } catch (error) {
        console.error('Error al cargar datos guardados:', error);
    }
    
    // Inicializar dashboard
    initDashboard();
    
    // Inicializar carrusel
    updateSlide();
});

function actualizarDatosUI() {
    // Recalcular todas las secciones si existen
    if (typeof calcularSeccionA === 'function') calcularSeccionA();
    if (typeof calcularSeccionB === 'function') calcularSeccionB();
    if (typeof calcularSeccionC === 'function') calcularSeccionC();
    if (typeof calcularSeccionD === 'function') calcularSeccionD();
    
    // Actualizar calculadora si existe
    if (typeof calculateMonthlyTax === 'function') {
        calculateMonthlyTax();
    }
}

// Efectos de Confirmación
function showConfirmation(message, type = 'success') {
    // Eliminar confirmaciones anteriores
    document.querySelectorAll('.confirmation').forEach(el => el.remove());
    
    const confirmation = document.createElement('div');
    confirmation.className = `confirmation ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'warning' ? 'exclamation-triangle' : 
                 type === 'error' ? 'times-circle' : 'info-circle';
    
    confirmation.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(confirmation);
    
    // Animación de entrada
    setTimeout(() => {
        confirmation.style.opacity = '1';
        confirmation.style.transform = 'translateY(0)';
    }, 10);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        confirmation.style.opacity = '0';
        confirmation.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.remove();
            }
        }, 300);
    }, 3000);
}

// Función auxiliar para formatear moneda
function formatCurrency(value) {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }
    return new Intl.NumberFormat('es-CU', {
        style: 'currency',
        currency: 'CUP',
        minimumFractionDigits: 2
    }).format(value);
}

// Modal para comparación de escenarios
function closeCompareModal() {
    const modal = document.getElementById('compareModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(event) {
    const modal = document.getElementById('compareModal');
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
    
    // Cerrar modales de ayuda
    const helpModal = document.querySelector('.help-modal');
    if (helpModal && event.target === helpModal) {
        helpModal.remove();
    }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel
    updateSlide();
    
    // Inicializar dashboard
    initDashboard();
    
    // Verificar modo TCP
    const tcpToggle = document.getElementById('tcpToggle');
    if (tcpToggle) {
        tcpToggle.addEventListener('change', function() {
            if (this.checked) {
                showConfirmation('Modo TCP activado. Los pagos mensuales son DEFINITIVOS.', 'warning');
            }
        });
    }
    
    // Cargar normativas.json para la calculadora
    if (typeof cargarNormativas === 'function') {
        cargarNormativas();
    }
});

// Función para añadir escenario en comparación
function addScenario() {
    const scenarioName = prompt('Nombre del nuevo escenario:');
    if (!scenarioName) return;
    
    // Crear copia de datos actuales
    const newScenario = JSON.parse(JSON.stringify(window.datosCalculadora || datosCalculadora));
    
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
    if (typeof calculateScenario === 'function') {
        calculateScenario(newScenario);
    }
    if (typeof addScenarioToGrid === 'function') {
        addScenarioToGrid(scenarioName, newScenario);
    }
    
    showConfirmation('Escenario añadido', 'success');
}

// Función para calcular escenario (si no existe en calculator.js)
function calculateScenario(scenario) {
    if (!scenario) return;
    
    const income = scenario.ingresosMensuales || 0;
    
    // Calcular impuestos activos
    let totalTax = 0;
    
    if (scenario.impuestos && Array.isArray(scenario.impuestos)) {
        scenario.impuestos.forEach(impuesto => {
            if (impuesto.activo) {
                const taxAmount = income * (impuesto.tasa / 100);
                totalTax += taxAmount;
            }
        });
    }
    
    scenario.totalTax = totalTax;
    scenario.netIncome = income - totalTax;
    
    return scenario;
}

// Función para añadir escenario al grid
function addScenarioToGrid(name, data) {
    const compareGrid = document.getElementById('compareGrid');
    if (!compareGrid) return;
    
    const income = data.ingresosMensuales || 0;
    const totalTax = data.totalTax || 0;
    const netIncome = data.netIncome || 0;
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
