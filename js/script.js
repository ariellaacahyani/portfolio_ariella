document.addEventListener('DOMContentLoaded', () => {
    // --- Scripts that can run early (UI interactions) ---

    // Hamburger Menu Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    hamburgerBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Smooth scrolling for nav links (both desktop and mobile)
    document.querySelectorAll('a.nav-link, a.mobile-nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
    
    // Tab Logic
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tab}-content`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Typing Effect Logic
    const typingTextElement = document.getElementById('typing-text');
    const phrases = ["a Computer Science Student", "an AI Enthusiast", "a Future Research Scientist", "a Lifelong Learner"];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        const typeSpeed = isDeleting ? 75 : 150;
        if (isDeleting) {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        setTimeout(type, typeSpeed);
    }
    type();
});

// --- Scripts that MUST run after everything is loaded ---
window.addEventListener('load', () => {
    // --- IMMERSIVE PARALLAX Celestial Canvas Logic ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray, milkyWay, northStar, shootingStars;
    const parallaxFactor = 0.3; 

    const mouse = { x: null, y: null, radius: (window.innerHeight / 120) * (window.innerWidth / 120) };

    window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });
    window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = (canvas.height / 150) * (canvas.width / 150);
    }
    setCanvasSize();

    function drawStarShape(x, y, radius, spikes, inset) {
        ctx.beginPath();
        ctx.moveTo(x, y - radius);
        for (let i = 0; i < spikes; i++) {
            let outerX = x + Math.cos(i * 2 * Math.PI / spikes) * radius;
            let outerY = y + Math.sin(i * 2 * Math.PI / spikes) * radius;
            ctx.lineTo(outerX, outerY);
            let innerX = x + Math.cos((i + 0.5) * 2 * Math.PI / spikes) * radius * inset;
            let innerY = y + Math.sin((i + 0.5) * 2 * Math.PI / spikes) * radius * inset;
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
    }

    class NorthStar {
        constructor(x, y, size) { this.x = x; this.y = y; this.size = size; this.shimmerSpeed = 0.003; }
        draw() {
            const currentSize = this.size + Math.sin(Date.now() * this.shimmerSpeed) * 2;
            ctx.save();
            ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(255, 255, 224, 0.7)';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - currentSize * 3); ctx.lineTo(this.x, this.y + currentSize * 3);
            ctx.moveTo(this.x - currentSize * 3, this.y); ctx.lineTo(this.x + currentSize * 3, this.y);
            ctx.lineWidth = currentSize / 4; ctx.strokeStyle = 'rgba(255, 255, 224, 0.3)'; ctx.stroke();
            ctx.fillStyle = 'white';
            drawStarShape(this.x, this.y, currentSize, 8, 0.5);
            ctx.fill(); ctx.restore();
        }
    }
    
    class Particle {
        constructor(x, y, dirX, dirY, size, color) { this.x = x; this.y = y; this.directionX = dirX; this.directionY = dirY; this.size = size; this.color = color; }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            const scrollHeight = document.body.scrollHeight;
            if (this.y - (window.scrollY * parallaxFactor) < -this.size) { this.y += scrollHeight * parallaxFactor + this.size * 2; }
            if (this.y - (window.scrollY * parallaxFactor) > canvas.height + this.size) { this.y -= scrollHeight * parallaxFactor + this.size*2; }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }
    
    class MilkyWayStar {
         constructor(x, y, radius, color) { this.x = x; this.y = y; this.radius = radius; this.color = color; this.alpha = Math.random() * 0.4 + 0.3; this.flickerSpeed = Math.random() * 0.05; }
         draw() {
             const flickerRadius = this.radius * (Math.sin(Date.now() * this.flickerSpeed) * 0.2 + 0.8);
             if (flickerRadius <= 0) return;
             ctx.beginPath(); ctx.arc(this.x, this.y, flickerRadius, 0, Math.PI * 2); ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`; ctx.fill();
         }
    }
    
    class ShootingStar {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.len = (Math.random() * 80) + 10;
            this.speed = (Math.random() * 10) + 6;
            this.size = (Math.random() * 1) + 0.1;
            this.angle = -Math.PI / 4;
        }
        update() {
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
            if (this.y > canvas.height + this.len || this.x > canvas.width + this.len) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.len * Math.cos(this.angle), this.y + this.len * Math.sin(this.angle));
            ctx.lineWidth = this.size;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.stroke();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000; // More particles
        const scrollHeight = document.body.scrollHeight;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1.5) + 0.5;
            let x = Math.random() * canvas.width;
            let y = Math.random() * scrollHeight * parallaxFactor;
            let dirX = (Math.random() * 0.3) - 0.15;
            let dirY = (Math.random() * 0.3) - 0.15;
            particlesArray.push(new Particle(x, y, dirX, dirY, size, '#a5b4fc'));
        }

        milkyWay = [];
        for (let i = 0; i < 500; i++) { // More milky way stars
            let x = Math.random() * canvas.width;
            let y = Math.random() * scrollHeight * parallaxFactor;
            milkyWay.push(new MilkyWayStar(x, y, Math.random() * 0.8, '200, 200, 255'));
        }
        
        shootingStars = [];
        for(let i=0; i<3; i++) { shootingStars.push(new ShootingStar()); }
        
        northStar = new NorthStar(canvas.width * 0.85, canvas.height * 0.15, 8);
    }

    function connect() {
        const scrollOffset = window.scrollY * parallaxFactor;
        const worldMouseY = mouse.y + scrollOffset;

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x)**2) + ((particlesArray[a].y - particlesArray[b].y)**2);
                if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                    let opacityValue = 1 - (distance / 20000);
                    let dx = mouse.x - particlesArray[a].x;
                    let dy = worldMouseY - particlesArray[a].y;
                    let mouseDistance = Math.sqrt(dx*dx + dy*dy);
                    let strokeColor = (mouseDistance < mouse.radius) ? `rgba(236, 72, 153, ${opacityValue * 0.6})` : `rgba(139, 92, 246, ${opacityValue * 0.5})`;
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(0, -window.scrollY * parallaxFactor);

        milkyWay.forEach(s => s.draw());
        particlesArray.forEach(p => p.update());
        connect();
        
        // Draw shooting stars within the translated context
        shootingStars.forEach(s => { s.update(); s.draw(); });

        // North star should not scroll, so draw it after restoring context
        ctx.restore();
        northStar.draw();
    }

    init();
    animate();
    
    window.addEventListener('resize', () => { 
        setCanvasSize(); 
        init(); 
    });
});