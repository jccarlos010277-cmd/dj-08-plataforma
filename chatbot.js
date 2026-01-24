// chatbot.js - Asistente Virtual para DJ-08

const chatbotMessages = {
    'seccion-a': {
        title: 'Sección A: Ingresos',
        message: 'En esta sección registras todos tus ingresos del período impositivo.',
        tips: [
            'Ingresa las ventas brutas totales del año',
            'Especifica las ventas del período impositivo',
            'No olvides incluir las devoluciones',
            'Los impuestos sobre ventas se restan'
        ],
        next: 'seccion-b'
    },
    
    'seccion-b': {
        title: 'Sección B: Gastos',
        message: 'Aquí registras todos los gastos deducibles para calcular la utilidad.',
        tips: [
            'Incluye costo de ventas y mercancías',
            'Registra gastos de administración',
            'Añade gastos de operación y financieros',
            'Considera otros gastos deducibles'
        ],
        next: 'seccion-c'
    },
    
    'seccion-c': {
        title: 'Ajustes Fiscales',
        message: 'Realiza ajustes según normativa fiscal cubana.',
        tips: [
            'Adiciones aumentan la utilidad imponible',
            'Deducciones reducen la utilidad imponible',
            'Calcula reserva para contingencias (10%)',
            'Considera pérdidas fiscales anteriores'
        ],
        next: 'seccion-d'
    },
    
    'impuesto-mensual': {
        title: 'Calculadora Mensual',
        message: 'Calcula y proyecta tus impuestos mensuales.',
        tips: [
            'Personaliza los tipos impositivos',
            'Usa tasas predefinidas o crea las tuyas',
            'Calcula para diferentes meses',
            'Exporta tus reportes'
        ]
    },
    
    'tcp': {
        title: 'Modo TCP Activado',
        message: '⚠️ ADVERTENCIA IMPORTANTE PARA TCP',
        warning: 'Los pagos a cuenta son DEFINITIVOS. La ONAT NO realiza devoluciones.',
        tips: [
            'Calcula cuidadosamente los anticipos',
            'Evita sobrepagos en trimestres',
            'Consulta con un asesor especializado',
            'Mantén registros detallados'
        ]
    }
};

// Inicializar Chatbot
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
    checkTCPMode();
});

function initChatbot() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotModal = document.getElementById('chatbotModal');
    const closeBtn = document.querySelector('.close-chatbot');
    const chatOptions = document.querySelectorAll('.chat-option');
    
    // Abrir/cerrar chatbot
    chatbotBtn.addEventListener('click', function() {
        chatbotModal.style.display = 'block';
        addBotMessage('¿En qué puedo ayudarte hoy?');
    });
    
    closeBtn.addEventListener('click', function() {
        chatbotModal.style.display = 'none';
    });
    
    // Cerrar al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === chatbotModal) {
            chatbotModal.style.display = 'none';
        }
    });
    
    // Manejar opciones del chatbot
    chatOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionType = this.dataset.option;
            handleChatOption(optionType);
        });
    });
}

function handleChatOption(option) {
    const data = chatbotMessages[option];
    
    if (!data) return;
    
    // Limpiar mensajes anteriores
    const chatBody = document.getElementById('chatbotBody');
    chatBody.innerHTML = '';
    
    // Añadir mensaje del bot
    addBotMessage(`<strong>${data.title}</strong><br>${data.message}`);
    
    // Añadir tips si existen
    if (data.tips && data.tips.length > 0) {
        addBotMessage('<strong>Consejos importantes:</strong><br>' + 
                      data.tips.map(tip => `• ${tip}`).join('<br>'));
    }
    
    // Añadir warning si existe
    if (data.warning) {
        addBotMessage(`<strong class="warning">⚠️ ${data.warning}</strong>`, 'warning');
    }
    
    // Añadir acción si existe siguiente sección
    if (data.next) {
        setTimeout(() => {
            addBotMessage(`¿Te gustaría ir a la ${chatbotMessages[data.next].title}?`, 'action');
            
            // Crear botón de acción
            const actionBtn = document.createElement('button');
            actionBtn.className = 'chat-action-btn';
            actionBtn.innerHTML = `Ir a ${chatbotMessages[data.next].title}`;
            actionBtn.onclick = function() {
                showSection(data.next);
                addUserMessage(`Ir a ${chatbotMessages[data.next].title}`);
                setTimeout(() => {
                    addBotMessage(`Perfecto. Te encuentras en ${chatbotMessages[data.next].title}. ¿Necesitas ayuda con algo específico aquí?`);
                }, 1000);
            };
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chatbot-message bot';
            messageDiv.appendChild(actionBtn);
            chatBody.appendChild(messageDiv);
        }, 1000);
    }
    
    // Scroll al final
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(text, type = 'normal') {
    const chatBody = document.getElementById('chatbotBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message bot ${type}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addUserMessage(text) {
    const chatBody = document.getElementById('chatbotBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user';
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Detectar sección actual y ofrecer ayuda
function detectCurrentSection() {
    const sections = ['seccion-a', 'seccion-b', 'seccion-c', 'seccion-d', 'impuesto-mensual'];
    
    for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.classList.contains('active')) {
            return section;
        }
    }
    
    return 'dashboard';
}

// Ofrecer ayuda contextual
function offerContextualHelp() {
    const currentSection = detectCurrentSection();
    if (currentSection !== 'dashboard') {
        const data = chatbotMessages[currentSection];
        if (data) {
            setTimeout(() => {
                addBotMessage(`Veo que estás en <strong>${data.title}</strong>. ¿Necesitas ayuda con esta sección?`);
            }, 3000);
        }
    }
}

// Verificar modo TCP y ofrecer ayuda
function checkTCPMode() {
    const tcpToggle = document.getElementById('tcpToggle');
    if (tcpToggle && tcpToggle.checked) {
        setTimeout(() => {
            addBotMessage('He detectado que activaste el modo TCP. ¿Necesitas información sobre los pagos a cuenta?', 'warning');
        }, 5000);
    }
}

// Iniciar guía interactiva
function startInteractiveGuide() {
    const steps = [
        { section: 'seccion-a', message: 'Comencemos con la Sección A: Ingresos' },
        { section: 'seccion-b', message: 'Ahora vamos a la Sección B: Gastos' },
        { section: 'seccion-c', message: 'Continuemos con los Ajustes Fiscales' },
        { section: 'seccion-d', message: 'Finalicemos con la Liquidación del Impuesto' }
    ];
    
    let currentStep = 0;
    
    function nextStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            showSection(step.section);
            addBotMessage(step.message);
            currentStep++;
            
            // Preguntar si continuar
            setTimeout(() => {
                if (currentStep < steps.length) {
                    addBotMessage('¿Listo para continuar al siguiente paso?', 'action');
                    
                    const continueBtn = document.createElement('button');
                    continueBtn.className = 'chat-action-btn';
                    continueBtn.textContent = 'Continuar';
                    continueBtn.onclick = nextStep;
                    
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'chatbot-message bot';
                    messageDiv.appendChild(continueBtn);
                    
                    const chatBody = document.getElementById('chatbotBody');
                    chatBody.appendChild(messageDiv);
                    chatBody.scrollTop = chatBody.scrollHeight;
                } else {
                    addBotMessage('¡Felicidades! Has completado la DJ-08. Revisa los resultados en la Sección D.');
                }
            }, 3000);
        }
    }
    
    nextStep();
}

// Inicializar ayuda contextual después de cargar
setTimeout(offerContextualHelp, 2000);