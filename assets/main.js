/* Main JS logic for Arjun R's Portfolio */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Particle Background Canvas
    initParticleCanvas();

    // 1. Initialize Interactive Card Glow Effects & 3D Tilt
    initInteractiveGlows();
    init3DTilt();

    // 2. Inject Shared Components (Drawer, Terminal HUD, Profile Modal, Resume Modal, Project Lightbox Modal, Audio Controls)
    injectSharedComponents();

    // 3. Initialize Controllers
    initMobileDrawer();
    initTerminalHud();
    initProfileModal();
    initResumeModal();
    initProjectModal();
    initAudioToggle();
    initSkillRadar();
    initProjectFilters();
});

// --- 0. Ambient Particle Network Canvas ---
function initParticleCanvas() {
    let canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 55);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.8 + 0.8,
            color: Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(6, 182, 212, '
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + '0.45)';
            ctx.fill();

            // Connect nearby nodes
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = p.color + (0.15 * (1 - dist / 130)) + ')';
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 1. Interactive Card Glows & 3D Tilt ---
function initInteractiveGlows() {
    document.querySelectorAll('.glass-card, .glass-panel').forEach(card => {
        card.classList.add('interactive-glow-card');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    const glow = document.getElementById('cursor-glow');
    if (glow) {
        window.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
            glow.style.opacity = '1';
        });
    }
}

function init3DTilt() {
    const cards = document.querySelectorAll('.glass-card, .project-card');
    cards.forEach(card => {
        card.classList.add('tilt-card');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// --- 2. Inject Shared HTML Components Dynamically ---
function injectSharedComponents() {
    if (!document.getElementById('mobile-drawer')) {
        const drawerHtml = `
            <div id="mobile-drawer-overlay" class="mobile-drawer-overlay"></div>
            <div id="mobile-drawer" class="mobile-nav-drawer p-8 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
                        <div class="flex items-center gap-3">
                            <span class="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span class="font-headline-md font-bold tracking-tighter text-on-surface">Arjun R</span>
                        </div>
                        <button id="mobile-drawer-close" class="material-symbols-outlined text-on-surface-variant hover:text-cyan-400 transition-colors">close</button>
                    </div>
                    <div class="flex flex-col gap-6 font-label-caps text-label-caps text-[14px]">
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="index.html"><span>Home</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="projects.html"><span>Projects</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="experience.html"><span>Experience</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="about.html"><span>About</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="contact.html"><span>Contact</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                    </div>
                </div>
                <div class="font-code-sm text-[11px] text-on-surface-variant opacity-70 flex items-center justify-between">
                    <span>// SYS_STATUS: OPTIMAL</span>
                    <span class="text-cyan-400">V4.5</span>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', drawerHtml);
    }

    if (!document.getElementById('terminal-hud')) {
        const terminalHtml = `
            <div id="terminal-hud" class="terminal-hud-overlay">
                <div class="terminal-hud-window theme-cyan flex flex-col">
                    <div class="terminal-header select-none">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-red-500/60"></div>
                            <div class="w-3 h-3 rounded-full bg-amber-500/60"></div>
                            <div class="w-3 h-3 rounded-full bg-emerald-500/60"></div>
                            <span class="ml-2 font-code-sm text-[12px] opacity-75 text-accent">arjun-cyber-terminal-v4.5.exe</span>
                        </div>
                        <button id="terminal-hud-close" class="material-symbols-outlined text-on-surface-variant hover:text-accent transition-colors font-bold text-sm">close</button>
                    </div>
                    <div id="terminal-body" class="terminal-body flex-grow">
                        <div class="mb-4">
                            <span class="text-accent font-bold">Arjun R Terminal Core UI v4.5.0</span><br>
                            <span>Type <span class="text-accent font-semibold">help</span> to list available commands.</span>
                        </div>
                    </div>
                    <div class="terminal-footer">
                        <span class="text-accent font-code-sm select-none">guest@arjunr:~$</span>
                        <input id="terminal-prompt" class="terminal-prompt-input" type="text" autocomplete="off" spellcheck="false" placeholder="type 'help'...">
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', terminalHtml);
    }

    if (!document.getElementById('profile-modal-overlay')) {
        const modalHtml = `
            <div id="profile-modal-overlay" class="profile-modal-overlay">
                <div class="profile-modal-content glass-panel-v2 p-5 md:p-6 rounded-2xl relative max-w-sm md:max-w-md w-full flex flex-col items-center border border-white/15">
                    <button id="profile-modal-close" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-white/20 text-on-surface flex items-center justify-center transition-colors shadow-md z-10" aria-label="Close Profile Photo Modal">
                        <span class="material-symbols-outlined text-xl">close</span>
                    </button>
                    <div class="w-full aspect-[3/4] rounded-xl overflow-hidden mb-5 border border-cyan-500/30 shadow-2xl relative bg-slate-900">
                        <img id="profile-modal-img" src="assets/images/profile_avatar.jpg" alt="Arjun R Profile Photo" class="w-full h-full object-cover">
                    </div>
                    <div class="flex items-center justify-between w-full px-1">
                        <div>
                            <h3 class="font-headline-md text-headline-md text-on-surface font-bold">Arjun R</h3>
                            <p class="font-code-sm text-code-sm text-cyan-400">Front-End Developer &amp; UI Engineer</p>
                        </div>
                        <a href="assets/images/profile_avatar.jpg" download="Arjun_R_Profile_Photo.jpg" class="glass-panel px-4 py-2.5 rounded-lg font-label-caps text-label-caps text-xs text-on-surface hover:text-cyan-400 hover:border-cyan-400/50 transition-all flex items-center gap-2 shadow-sm" title="Download Full Resolution Photo">
                            <span class="material-symbols-outlined text-sm">download</span>
                            <span>HD</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    if (!document.getElementById('resume-modal-overlay')) {
        const resumeHtml = `
            <div id="resume-modal-overlay" class="resume-modal-overlay">
                <div class="resume-modal-content glass-panel-v2 p-4 md:p-6 rounded-2xl relative max-w-4xl w-full h-[85vh] flex flex-col border border-white/15 shadow-2xl">
                    <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-4 select-none">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                                <span class="material-symbols-outlined text-cyan-400 text-sm">description</span>
                            </div>
                            <div>
                                <h3 class="font-headline-md text-base md:text-lg text-on-surface font-bold">Curriculum Vitae — Arjun R</h3>
                                <p class="font-code-sm text-xs text-slate-400">Arjun_R_Resume.pdf • Official Verification Document</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button id="resume-modal-close" class="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-white/20 text-on-surface flex items-center justify-center transition-colors">
                                <span class="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>
                    </div>
                    <div class="flex-grow w-full rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
                        <iframe src="assets/resume.html" class="w-full h-full border-none" title="Arjun R Resume Preview"></iframe>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', resumeHtml);
    }

    if (!document.getElementById('project-modal-overlay')) {
        const projectModalHtml = `
            <div id="project-modal-overlay" class="project-modal-overlay">
                <div class="project-modal-content glass-panel-v2 p-6 md:p-8 rounded-2xl relative max-w-3xl w-full flex flex-col border border-cyan-500/30 shadow-2xl">
                    <button id="project-modal-close" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-white/20 text-on-surface flex items-center justify-center transition-colors z-20">
                        <span class="material-symbols-outlined text-xl">close</span>
                    </button>
                    <div id="project-modal-body">
                        <!-- Populated dynamically via JS -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', projectModalHtml);
    }
}

// --- 3. Mobile Navigation Drawer ---
function initMobileDrawer() {
    const btn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const drawer = document.getElementById('mobile-drawer');
    const closeBtn = document.getElementById('mobile-drawer-close');

    if (!btn || !overlay || !drawer) return;

    const toggle = (open) => {
        if (open) {
            overlay.classList.add('open');
            drawer.classList.add('open');
            document.body.style.overflow = 'hidden';
        } else {
            overlay.classList.remove('open');
            drawer.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    btn.addEventListener('click', () => toggle(true));
    overlay.addEventListener('click', () => toggle(false));
    if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
}

// --- 4. Interactive HUD Terminal Modal ---
function initTerminalHud() {
    const triggerBtns = document.querySelectorAll('.terminal-trigger, .navbar-terminal-btn');
    const overlay = document.getElementById('terminal-hud');
    const closeBtn = document.getElementById('terminal-hud-close');
    const input = document.getElementById('terminal-prompt');
    const body = document.getElementById('terminal-body');
    const windowEl = overlay ? overlay.querySelector('.terminal-hud-window') : null;

    if (!overlay || !input || !body) return;

    let targetBtns = Array.from(triggerBtns);
    document.querySelectorAll('button').forEach(btn => {
        if (btn.innerText.trim() === 'terminal' || btn.querySelector('.material-symbols-outlined')?.innerText === 'terminal') {
            if (!targetBtns.includes(btn)) targetBtns.push(btn);
        }
    });

    const openTerminal = () => {
        overlay.classList.add('open');
        input.focus();
        document.body.style.overflow = 'hidden';
    };

    const closeTerminal = () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    targetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openTerminal();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeTerminal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            closeTerminal();
        }
        if ((e.ctrlKey && e.key === '\\') || (e.key === '`' && !overlay.classList.contains('open') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
            e.preventDefault();
            if (overlay.classList.contains('open')) closeTerminal();
            else openTerminal();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const commandLine = input.value.trim();
            input.value = '';
            if (commandLine) {
                executeCommand(commandLine, body, windowEl, closeTerminal);
            }
        } else if (e.key.length === 1 || e.key === 'Backspace') {
            CyberAudio.playKey();
        }
    });

    body.addEventListener('click', () => input.focus());
}

function executeCommand(cmdLine, bodyEl, windowEl, closeFn) {
    const rawInput = cmdLine.trim().toLowerCase();
    const parts = rawInput.split(/\s+/);
    const primaryCmd = parts[0];
    const arg = parts[1];

    let output = '';

    const queryEl = document.createElement('div');
    queryEl.className = 'mt-2';
    queryEl.innerHTML = `<span class="text-accent font-semibold">guest@arjunr:~$</span> <span>${escapeHtml(cmdLine)}</span>`;
    bodyEl.appendChild(queryEl);

    let cmd = primaryCmd;
    if (['about', 'profile', 'bio', 'developer', 'who'].includes(cmd) || rawInput.includes('profile')) cmd = 'about';
    else if (['skills', 'skill', 'matrix', 'stack', 'tech', 'metrics'].includes(cmd) || rawInput.includes('metrics') || rawInput.includes('matrix')) cmd = 'skills';
    else if (['experience', 'career', 'summary', 'logs', 'timeline', 'work', 'history'].includes(cmd) || rawInput.includes('logs') || rawInput.includes('summary')) cmd = 'experience';
    else if (['projects', 'output', 'outputs', 'portfolio', 'apps', 'highlight'].includes(cmd) || rawInput.includes('output') || rawInput.includes('outputs')) cmd = 'projects';
    else if (['contact', 'handles', 'dispatch', 'email', 'socials', 'github', 'reach'].includes(cmd) || rawInput.includes('handles') || rawInput.includes('dispatch')) cmd = 'contact';
    else if (['cv', 'resume', 'pdf'].includes(cmd) || rawInput.includes('cv') || rawInput.includes('resume')) cmd = 'cv';
    else if (['theme', 'colors', 'color', 'styling'].includes(cmd) || rawInput.includes('styling')) cmd = 'theme';

    switch (cmd) {
        case 'help':
        case '?':
        case 'man':
        case 'commands':
            output = `
<div class="mt-1 text-accent font-bold">=== ARJUN-TERMINAL COMMAND DIRECTORY ===</div>
<div class="mt-2 space-y-1.5 ml-1 font-mono text-xs md:text-sm">
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-32 shrink-0">[about]</span><span class="text-slate-300">Developer profile & academic summary</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-32 shrink-0">[skills]</span><span class="text-slate-300">Technical matrix & framework proficiencies</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-32 shrink-0">[experience]</span><span class="text-slate-300">Career journey & engineering roles</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-32 shrink-0">[projects]</span><span class="text-slate-300">Digital architecture showreel & outputs</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-32 shrink-0">[contact]</span><span class="text-slate-300">Direct email & social handles</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-32 shrink-0">[cv]</span><span class="text-slate-300">Open full Curriculum Vitae modal</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-32 shrink-0">[theme &lt;col&gt;]</span><span class="text-slate-300">Set theme (cyan/green/amber/purple/steel)</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-32 shrink-0">[clear]</span><span class="text-slate-300">Clear CLI console window</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-32 shrink-0">[exit]</span><span class="text-slate-300">Close terminal window</span></div>
</div>
            `;
            break;
        case 'about':
            output = `
<div class="mt-1">
  <span class="font-bold text-accent">Arjun R</span> &mdash; Senior Front-End Developer & UI Engineer.<br>
  Pursuing Bachelor of Computer Applications (BCA).<br>
  Obsessed with high-performance Web APIs, RxJS state management, and sleek glassmorphic UI systems.
</div>
            `;
            break;
        case 'skills':
            output = `
<div class="mt-1 font-bold text-accent">TECHNICAL STACK MATRIX:</div>
<div class="ml-2 mt-1 select-none font-code-sm leading-tight">
  Angular / TS  <span class="text-accent">[████████████████████████]</span> 95%<br>
  RxJS / NgRx   <span class="text-accent">[██████████████████████░░]</span> 92%<br>
  Sigma / Viz   <span class="text-accent">[████████████████████░░░░]</span> 88%<br>
  React / Tailwind <span class="text-accent">[██████████████████████░░]</span> 90%<br>
  Three.js / WebGL <span class="text-accent">[██████████████████░░░░░░]</span> 82%
</div>
            `;
            break;
        case 'experience':
            output = `
<div class="mt-1 font-bold text-accent">CAREER TIMELINE SUMMARY:</div>
<div class="ml-2 mt-1 space-y-1">
  <div>&bull; <span class="text-accent font-semibold">Front-End Developer</span> | June 20, 2024 &mdash; Present</div>
  <div>&bull; <span class="text-accent font-semibold">MERN Stack Intern</span> | July 2023 &mdash; Jan 2024</div>
  <div>&bull; <span class="text-accent font-semibold">Diploma in Computer Engineering</span> | 2021 &mdash; 2023</div>
</div>
            `;
            break;
        case 'projects':
            output = `
<div class="mt-1 font-bold text-accent">FEATURED OUTPUTS:</div>
<div class="ml-2 mt-1 space-y-1">
  <div>1. <span class="text-accent font-semibold">Network Analysis Dashboard</span> &mdash; Sigma.js</div>
  <div>2. <span class="text-accent font-semibold">Traffic Analytics Hub</span> &mdash; amCharts</div>
  <div>3. <span class="text-accent font-semibold">Luxe3D Quantum One Showcase</span> &mdash; WebGL</div>
  <div>4. <span class="text-accent font-semibold">SVG Convert</span> &mdash; ImageTracerJS Figma Plugin</div>
  <div>5. <span class="text-accent font-semibold">Multi-Source Video Downloader</span> &mdash; Node.js Streams</div>
</div>
            `;
            break;
        case 'contact':
            output = `
<div class="mt-1 font-bold text-accent">COMMUNICATION DIRECTORY:</div>
<div class="ml-2 mt-1">
  Email: <a href="mailto:ajuarjunr@gmail.com" class="text-accent underline">ajuarjunr@gmail.com</a><br>
  Phone: <a href="tel:+918921843248" class="text-accent underline">+91 8921843248</a><br>
  GitHub: <a href="https://github.com/Arjunrajan250" target="_blank" class="text-accent underline">github.com/Arjunrajan250</a><br>
  Location: Alappuzha, Kerala, India
</div>
            `;
            break;
        case 'cv':
            const overlay = document.getElementById('resume-modal-overlay');
            if (overlay) {
                overlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                CyberAudio.playChime();
            }
            output = `<div class="mt-1 text-accent">Opening Curriculum Vitae modal...</div>`;
            break;
        case 'theme':
            const themes = ['cyan', 'green', 'amber', 'purple', 'steel'];
            if (!arg) {
                output = `<div class="mt-1">Specify theme. Available: ${themes.join(', ')}</div>`;
            } else if (themes.includes(arg)) {
                if (windowEl) {
                    themes.forEach(t => windowEl.classList.remove(`theme-${t}`));
                    windowEl.classList.add(`theme-${arg}`);
                }
                output = `<div class="mt-1 text-accent font-semibold">Terminal theme set to: ${arg}</div>`;
            } else {
                output = `<div class="mt-1 text-red-400">Invalid theme. Supported: ${themes.join(', ')}</div>`;
            }
            break;
        case 'clear':
        case 'cls':
            bodyEl.innerHTML = '';
            return;
        case 'exit':
        case 'quit':
        case 'close':
            closeFn();
            return;
        default:
            output = `<div class="mt-1 text-red-400">Unknown command: '${escapeHtml(cmdLine)}'. Type <span class="text-accent font-semibold">help</span>.</div>`;
    }

    const responseEl = document.createElement('div');
    responseEl.className = 'mb-2';
    responseEl.innerHTML = output;
    bodyEl.appendChild(responseEl);
    bodyEl.scrollTop = bodyEl.scrollHeight;
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// --- 5. Profile Photo Lightbox Modal ---
function initProfileModal() {
    const overlay = document.getElementById('profile-modal-overlay');
    const closeBtn = document.getElementById('profile-modal-close');
    if (!overlay) return;

    const openModal = () => {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    const avatarSelectors = ['.profile-avatar-btn', '.profile-avatar-img', 'img[src*="profile_avatar.jpg"]'];

    document.querySelectorAll(avatarSelectors.join(', ')).forEach(el => {
        const targetContainer = el.parentElement && el.parentElement.classList.contains('rounded-full') 
            ? el.parentElement 
            : el;
        targetContainer.classList.add('profile-avatar-btn');
        targetContainer.title = "Click to view profile photo";
        targetContainer.style.cursor = 'pointer';
        targetContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
}

// --- 6. Cyber Micro-Audio Cues Engine ---
const CyberAudio = {
    enabled: localStorage.getItem('arjun_portfolio_audio') === 'true',
    ctx: null,

    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    },

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('arjun_portfolio_audio', this.enabled);
        if (this.enabled) this.playChime();
        return this.enabled;
    },

    playBlip(freq = 650, duration = 0.05) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.3, this.ctx.currentTime + duration);
            gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    },

    playChime() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.05, now + idx * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.05);
                osc.stop(now + idx * 0.05 + 0.25);
            });
        } catch (e) {}
    },

    playKey() {
        if (!this.enabled) return;
        this.playBlip(850 + Math.random() * 250, 0.03);
    }
};

function initAudioToggle() {
    const btn = document.getElementById('audio-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const isAudioOn = CyberAudio.toggle();
        btn.classList.toggle('active', isAudioOn);
        btn.querySelector('.material-symbols-outlined').textContent = isAudioOn ? 'volume_up' : 'volume_off';
    });

    document.querySelectorAll('button, a.glass-panel, .filter-btn, nav a').forEach(el => {
        el.addEventListener('click', () => CyberAudio.playBlip());
    });
}

// --- 7. In-Page Resume PDF Viewer Modal ---
function initResumeModal() {
    const overlay = document.getElementById('resume-modal-overlay');
    const closeBtn = document.getElementById('resume-modal-close');
    if (!overlay) return;

    const openModal = () => {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        CyberAudio.playChime();
    };

    const closeModal = () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        CyberAudio.playBlip(450, 0.04);
    };

    const selectors = ['a[href*="resume"]', 'a[href*="Resume"]', 'a[href*="CV"]', '[data-action="view-resume"]', '.btn-resume'];

    document.querySelectorAll(selectors.join(', ')).forEach(link => {
        if (link.closest('#resume-modal-overlay')) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });

    document.querySelectorAll('a, button').forEach(el => {
        if (el.closest('#resume-modal-overlay')) return;
        const txt = (el.textContent || '').trim().toUpperCase();
        if ((txt.includes('RESUME') || txt.includes('VIEW CV')) && !el.dataset.resumeBound) {
            el.dataset.resumeBound = 'true';
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal();
            });
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
}

// --- 8. Project Architecture Detail Lightbox Modal ---
function initProjectModal() {
    const overlay = document.getElementById('project-modal-overlay');
    const closeBtn = document.getElementById('project-modal-close');
    const modalBody = document.getElementById('project-modal-body');
    if (!overlay || !modalBody) return;

    const openProjectModal = (card) => {
        const title = card.querySelector('h3, h4')?.innerText || 'Digital Project Showcase';
        const img = card.querySelector('img')?.src || '';
        const desc = card.querySelector('p')?.innerText || '';
        const badges = Array.from(card.querySelectorAll('.tech-badge, span[class*="bg-"]')).map(b => b.innerText.trim());
        const liveLink = card.querySelector('a[href*="vercel.app"], a[href*="http"]')?.href;
        const liveBtnHtml = liveLink ? `
            <a href="${liveLink}" target="_blank" class="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-label-caps text-xs flex items-center gap-2 transition-all shadow-md">
                <span class="material-symbols-outlined text-sm">open_in_new</span>
                <span>Live Demo</span>
            </a>
        ` : '';

        modalBody.innerHTML = `
            <div class="aspect-video w-full rounded-xl overflow-hidden mb-6 border border-white/10 shadow-2xl relative bg-slate-950">
                <img src="${img}" alt="${title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 class="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">${title}</h2>
                <div class="flex items-center gap-2">
                    ${liveBtnHtml}
                    <a href="https://github.com/Arjunrajan250" target="_blank" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-label-caps text-xs flex items-center gap-2 transition-all shadow-md">
                        <span class="material-symbols-outlined text-sm">code</span>
                        <span>Source Code</span>
                    </a>
                </div>
            </div>
            <p class="font-body-lg text-slate-300 mb-6 leading-relaxed">${desc}</p>
            <div class="border-t border-white/10 pt-4">
                <h4 class="font-label-caps text-xs text-cyan-400 mb-3 tracking-wider">TEHNOLOGY STACK &amp; HIGHLIGHTS</h4>
                <div class="flex flex-wrap gap-2">
                    ${badges.map(b => `<span class="badge-pill border-cyan-500/30 text-cyan-300 bg-cyan-950/40">${b}</span>`).join('')}
                </div>
            </div>
        `;

        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        CyberAudio.playChime();
    };

    document.querySelectorAll('.project-card, .glass-panel:has(h3), .glass-panel:has(h4)').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            openProjectModal(card);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// --- 9. Interactive Skill Radar & Matrix ---
function initSkillRadar() {
    const skillBars = document.querySelectorAll('.skill-progress-fill');
    if (!skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const targetWidth = fill.dataset.level || '88%';
                fill.style.width = targetWidth;
            }
        });
    }, { threshold: 0.15 });

    skillBars.forEach(bar => observer.observe(bar));

    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.skillCat;
            filterBtns.forEach(b => {
                b.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
                b.classList.add('text-slate-400');
            });
            btn.classList.remove('text-slate-400');
            btn.classList.add('bg-indigo-600', 'text-white', 'shadow-md');

            skillCards.forEach(card => {
                if (cat === 'all' || card.dataset.skillCat === cat) {
                    card.style.display = 'block';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => { card.style.display = 'none'; }, 200);
                }
            });
        });
    });
}

// --- 10. Live Project Search & Filter ---
function initProjectFilters() {
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const activeBtn = document.querySelector('.filter-btn.bg-indigo-600, .filter-btn.bg-primary');
        let activeCategory = 'all';

        if (activeBtn) {
            if (activeBtn.innerText.includes('WEB')) activeCategory = 'web';
            else if (activeBtn.innerText.includes('DATA')) activeCategory = 'data';
            else if (activeBtn.innerText.includes('DASHBOARD')) activeCategory = 'ui';
        }

        filterProjectsList(activeCategory, query);
    });

    window.filterProjects = function(category) {
        const buttons = document.querySelectorAll('.filter-btn');

        buttons.forEach(btn => {
            btn.classList.remove('bg-indigo-600', 'bg-primary', 'text-white', 'text-on-primary', 'shadow-md');
            btn.classList.add('text-slate-400');
        });

        const activeBtn = Array.from(buttons).find(btn => 
            btn.innerText.toLowerCase().includes(category.toLowerCase()) || 
            (category === 'all' && btn.innerText.includes('ALL'))
        );

        if (activeBtn) {
            activeBtn.classList.remove('text-slate-400');
            activeBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
        }

        const query = searchInput.value.toLowerCase().trim();
        filterProjectsList(category, query);
    };
}

function filterProjectsList(category, searchQuery) {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        const title = card.querySelector('h3, h4')?.innerText.toLowerCase() || '';
        const description = card.querySelector('p')?.innerText.toLowerCase() || '';
        const badges = Array.from(card.querySelectorAll('.tech-badge, span')).map(b => b.innerText.toLowerCase()).join(' ');

        const matchesCategory = (category === 'all' || card.dataset.category === category);
        const matchesSearch = !searchQuery || title.includes(searchQuery) || description.includes(searchQuery) || badges.includes(searchQuery);

        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';

        setTimeout(() => {
            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        }, 200);
    });
}
