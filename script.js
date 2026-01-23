// Funcionalidades Mejoradas

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
    document.querySelector(`.hero-slide[data-slide="${currentSlide}"]`).classList.add('active');
    
    // Actualizar dots
    document.querySelectorAll('.dot').forEach(dot => {
        dot.classList.remove('active');
        if (parseInt(dot.dataset.slide) === currentSlide) {
            dot.classList.add('active');
        }
    });
}

// Auto avanzar el carrusel cada 5 segundos
setInterval(nextSlide, 5000);

// Inicializar Dashboard
function initDashboard() {
    // Mostrar estadísticas
    updateQuickStats();
    
    // Cargar datos recientes si existen
    loadRecentData();
}

function updateQuickStats() {
    // En una implementación real, esto vendría de una API
    // Por ahora son valores estáticos
    console.log('Estadísticas actualizadas');
}

function loadRecentData() {
    // Cargar última declaración del localStorage
    const lastDeclaration = localStorage.getItem('lastDeclaration');
    if (lastDeclaration) {
        console.log('Última declaración cargada');
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
            alert(messages[step]);
            step++;
            if (confirm('¿Continuar al siguiente paso?')) {
                showNextStep();
            }
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
    }

    // Actualizar navegación visual
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Guardar datos automáticamente
function autoSave() {
    const datosCompletos = {
        timestamp: new Date().toISOString(),
        datos: datosDeclaracion,
        calculadora: datosCalculadora
    };
    
    localStorage.setItem('dj08_autosave', JSON.stringify(datosCompletos));
    console.log('Datos guardados automáticamente');
}

// Auto-guardar cada 30 segundos
setInterval(autoSave, 30000);

// Cargar datos guardados al inicio
window.addEventListener('load', function() {
    const savedData = localStorage.getItem('dj08_autosave');
    if (savedData) {
        if (confirm('¿Desea recuperar los datos de su última sesión?')) {
            const datos = JSON.parse(savedData);
            datosDeclaracion = datos.datos || datosDeclaracion;
            datosCalculadora = datos.calculadora || datosCalculadora;
            actualizarDatosUI();
        }
    }
    
    // Inicializar dashboard
    initDashboard();
});

function actualizarDatosUI() {
    // Recalcular todas las secciones
    calcularSeccionA();
    calcularSeccionB();
    calcularSeccionC();
    calcularSeccionD();
    
    // Actualizar calculadora si existe
    if (typeof updateCalculator === 'function') {
        updateCalculator();
    }
}

// Efectos de Confirmación
function showConfirmation(message, type = 'success') {
    const confirmation = document.createElement('div');
    confirmation.className = `confirmation ${type}`;
    confirmation.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
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
            confirmation.remove();
        }, 300);
    }, 3000);
}

// Usar en cálculos importantes
function calcularConConfirmacion(seccion, calculoFn) {
    const resultado = calculoFn();
    showConfirmation(`${seccion} calculada correctamente`, 'success');
    return resultado;
}

// Mejorar cálculos con efectos
function calcularSeccionA() {
    return calcularConConfirmacion('Sección A', function() {
        // Tu código existente de calcularSeccionA aquí
        // ... (mantén el mismo código)
    });
}
