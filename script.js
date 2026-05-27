/* ==========================================================================
   INTERACTIVIDAD Y ANIMACIONES - PORTAFOLIO DE SANTIAGO ARENAS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. EFECTO MÁQUINA DE ESCRIBIR (TYPEWRITER) ---
    const typewriterElement = document.getElementById('typewriter');
    const roles = [
        'Móvil (Android)', 
        'Full-Stack', 
        'Frontend Creativo', 
        'Backend & APIs'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Borrado más rápido
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120; // Escritura normal
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pausa al terminar de escribir el rol entero
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Breve pausa antes de escribir el siguiente
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    // Iniciar máquina de escribir
    if (typewriterElement) {
        setTimeout(typeEffect, 1000);
    }


    // --- 2. PARTÍCULAS INTERACTIVAS EN CANVAS ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas?.getContext('2d');
    
    let particlesArray = [];
    // Partículas en blanco para un fondo más sobrio
    const colors = ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.35)'];
    
    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    if (canvas && ctx) {
        // Redimensionar canvas de forma dinámica
        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        setCanvasSize();
        window.addEventListener('resize', () => {
            setCanvasSize();
            initParticles();
        });

        // Registrar coordenadas del cursor para interacción
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        // Limpiar cursor al salir de la pantalla
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Constructor de la partícula
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            // Dibujar partícula
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // Actualizar movimiento y reaccionar al ratón
            update() {
                // Comprobación de límites de pantalla
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Interacción con ratón (repulsión suave)
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (mouse.x !== null && distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const forceX = (dx / distance) * force * 1.5;
                    const forceY = (dy / distance) * force * 1.5;
                    
                    this.x -= forceX;
                    this.y -= forceY;
                }

                // Mover partícula ordinariamente
                this.x += this.directionX;
                this.y += this.directionY;
                
                this.draw();
            }
        }

        // Inicializar arreglo de partículas según resolución
        function initParticles() {
            particlesArray = [];
            let numberOfParticles = Math.min((canvas.width * canvas.height) / 14000, 80);
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = colors[Math.floor(Math.random() * colors.length)];
                
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Bucle de animación del canvas
        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
        }

        // Conectar partículas cercanas con líneas transparentes
        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 110) {
                        opacityValue = 1 - (distance / 110);
                        ctx.strokeStyle = `rgba(255,255,255, ${opacityValue * 0.06})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        initParticles();
        animateParticles();
    }


    // --- 3. REVELACIÓN DE ELEMENTOS AL HACER SCROLL (FADE IN UP) ---
    const fadeElements = document.querySelectorAll('.fade-in-init');
    
    // Aplicar clase activo a elementos visibles de forma nativa e inmediata en el Hero
    const heroElements = document.querySelectorAll('.hero-section .fade-in-init');
    heroElements.forEach(el => el.classList.add('active'));

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Dejar de observar una vez animado
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    // Agregar todos los elementos que requieran revelación progresiva
    const otherFadeElements = document.querySelectorAll('.section, .about-info, .about-quote, .project-card, .skill-category-card, .contact-card');
    otherFadeElements.forEach(el => {
        el.classList.add('fade-in-init');
        scrollObserver.observe(el);
    });


    // --- 4. CONTROL DE NAVBAR SCROLLED & LINK ACTIVO ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Reducir tamaño de la barra de navegación al hacer scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Resaltar sección activa en el menú de navegación
        let currentSection = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id') || 'home';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });


    // --- 5. MENÚ MÓVIL HABILITADO ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú móvil al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    // --- 6. INTEGRACIÓN DE COPIAR EMAIL AL PORTAPAPELES ---
    const copyBtn = document.getElementById('btn-copy-email');
    const emailToCopy = 'santia51arenas@gmail.com'; // O el email preferido del usuario

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailToCopy).then(() => {
                copyBtn.classList.add('copied');
                
                // Remover feedback de éxito después de 2.5 segundos
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                }, 2500);
            }).catch(err => {
                console.error('Error al copiar el texto: ', err);
            });
        });
    }
});
