// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todas as funcionalidades
    initializeAnimations();
    initializeFormValidation();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeMasks();
});

// Animações de entrada dos elementos
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

// Validação de formulários
function initializeFormValidation() {
    const form = document.querySelector('form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Adiciona classe quando o campo está em foco
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            validateInput(input);
        });

        // Validação em tempo real
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });

    // Validação específica para cada tipo de campo
    function validateInput(input) {
        const errorMessage = input.parentElement.querySelector('.error-message') 
            || document.createElement('span');
        errorMessage.className = 'error-message';
        
        let isValid = true;
        let message = '';

        switch(input.id) {
            case 'nome':
                isValid = input.value.length >= 5;
                message = 'O nome deve ter pelo menos 5 caracteres';
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
                message = 'Digite um e-mail válido';
                break;
            case 'cpf':
                isValid = validateCPF(input.value);
                message = 'Digite um CPF válido';
                break;
            case 'telefone':
                isValid = /^\(\d{2}\) \d{4,5}-\d{4}$/.test(input.value);
                message = 'Digite um telefone válido';
                break;
        }

        if (!isValid && input.value) {
            if (!input.parentElement.contains(errorMessage)) {
                input.parentElement.appendChild(errorMessage);
            }
            errorMessage.textContent = message;
            input.classList.add('invalid');
            input.classList.remove('valid');
        } else {
            errorMessage.remove();
            if (input.value) {
                input.classList.add('valid');
                input.classList.remove('invalid');
            } else {
                input.classList.remove('valid', 'invalid');
            }
        }
    }
}

// Efeitos de scroll
function initializeScrollEffects() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Efeito parallax no header
        if (header) {
            header.style.backgroundPositionY = `${currentScroll * 0.5}px`;
        }

        // Efeito de header flutuante
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Menu mobile
function initializeMobileMenu() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const menuButton = document.createElement('button');
    menuButton.className = 'menu-toggle';
    menuButton.innerHTML = '<span></span><span></span><span></span>';
    menuButton.setAttribute('aria-label', 'Menu');
    
    nav.insertBefore(menuButton, nav.firstChild);

    menuButton.addEventListener('click', () => {
        nav.classList.toggle('menu-open');
        menuButton.classList.toggle('active');
    });
}

// Máscaras para campos de formulário
function initializeMasks() {
    const masks = {
        cpf(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        },
        telefone(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4,5})(\d{4})/, '$1-$2');
        }
    };

    document.querySelectorAll('input').forEach(input => {
        const field = input.id;
        if (masks[field]) {
            input.addEventListener('input', (e) => {
                e.target.value = masks[field](e.target.value);
            });
        }
    });
}

// Validação de CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Adiciona classe para controle de animações CSS
document.body.classList.add('js-enabled');