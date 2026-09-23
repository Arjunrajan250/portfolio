/* Main JS logic for Arjun R's Portfolio */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Theme Toggle early
    initThemeToggle();

    // 1. Initialize Particle Background Canvas
    initParticleCanvas();

    // 2. Initialize Interactive Card Glow Effects & 3D Tilt
    initInteractiveGlows();
    init3DTilt();

    // 3. Inject Shared Components (Drawer, Terminal HUD, Profile Modal, Resume Modal, Project Lightbox Modal, Audio Controls, Apple Dynamic Island)
    injectSharedComponents();

    // 4. Initialize Controllers
    initMobileDrawer();
    initTerminalHud();
    initProfileModal();
    initResumeModal();
    initProjectModal();
    initAudioToggle();
    initSkillRadar();
    initProjectFilters();
    initScrollSpyAndNavbar();
    initGitHubCommitCounter();

    // 5. Apple Design Smooth UI Components
    initAppleSegmentedControls();
    initAppleSheetDragDismiss();
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

    function populateParticles() {
        particles.length = 0;
        const isDark = document.documentElement.classList.contains('dark');
        const colorSlate = isDark ? 'rgba(148, 163, 184, ' : 'rgba(100, 116, 139, ';
        const colorCyan = isDark ? 'rgba(56, 189, 248, ' : 'rgba(2, 132, 199, ';

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.8 + 0.8,
                color: Math.random() > 0.5 ? colorSlate : colorCyan
            });
        }
    }
    populateParticles();
    window.addEventListener('themechanged', populateParticles);

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
    document.querySelectorAll('.glass-card, .glass-panel, .glass-panel-v2').forEach(card => {
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

function injectAppleDynamicIsland() {
    // Dynamic Island element removed per user request
    const existing = document.getElementById('apple-dynamic-island');
    if (existing) existing.remove();
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
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="#home"><span>Home</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="#projects"><span>Projects</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="#experience"><span>Experience</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="#about"><span>About</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                        <a class="text-on-surface-variant hover:text-cyan-400 py-2 border-b border-white/5 transition-colors flex items-center justify-between" href="#contact"><span>Contact</span><span class="material-symbols-outlined text-xs">chevron_right</span></a>
                        
                        <!-- Mobile Theme Switch -->
                        <button id="mobile-theme-toggle-btn" class="drawer-theme-toggle" type="button" aria-label="Toggle theme">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm mobile-theme-icon">light_mode</span>
                                <span class="mobile-theme-label font-mono text-xs">Light Theme</span>
                            </span>
                            <span class="text-xs text-cyan-400 font-mono switch-action-text">Switch to Dark</span>
                        </button>
                    </div>
                </div>
                <div class="font-code-sm text-[11px] text-on-surface-variant opacity-70 flex items-center justify-between">
                    <span>Front-End Developer · Kerala, India</span>
                    <span class="text-cyan-400">Available</span>
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
                        <div class="flex items-center gap-2.5">
                            <span class="material-symbols-outlined text-cyan-400 text-base">terminal</span>
                            <span class="font-mono text-xs font-semibold text-white">Command Palette</span>
                            <span class="text-slate-600 text-xs">/</span>
                            <span class="font-mono text-[11px] text-slate-400">Quick Actions</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded border border-white/10 bg-slate-900/80">ESC</span>
                            <button id="terminal-hud-close" class="material-symbols-outlined text-slate-400 hover:text-white transition-colors font-bold text-sm" aria-label="Close command palette">close</button>
                        </div>
                    </div>
                    <div id="terminal-body" class="terminal-body flex-grow">
                        <div class="mb-4 text-xs font-mono">
                            <span class="text-cyan-400 font-bold">Arjun R &mdash; Quick Command Console</span><br>
                            <span class="text-slate-400">Type <span class="text-cyan-300 font-semibold">help</span> or any keyword (projects, experience, skills, contact, resume) to navigate.</span>
                        </div>
                    </div>
                    <div class="terminal-footer">
                        <span class="text-cyan-400 font-mono text-sm select-none font-bold">›</span>
                        <input id="terminal-prompt" class="terminal-prompt-input" type="text" autocomplete="off" spellcheck="false" placeholder="Type a command (e.g. projects, skills, resume, contact)...">
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
                            <p class="font-code-sm text-code-sm text-cyan-400">Front-End Developer &amp; UI Architect</p>
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
            <div id="resume-modal-overlay" class="resume-modal-overlay" onclick="if(event.target === this) closeResumeModal()">
                <div class="resume-modal-content glass-panel-v2 p-4 md:p-6 rounded-2xl relative max-w-4xl w-full h-[88vh] flex flex-col border border-white/15 shadow-2xl">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-3 select-none flex-shrink-0 gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 shadow-inner">
                                <span class="material-symbols-outlined text-base">description</span>
                            </div>
                            <div>
                                <h3 class="font-sans text-base md:text-lg text-white font-bold tracking-tight">Curriculum Vitae &mdash; Arjun R</h3>
                                <p class="font-sans text-xs text-slate-400" id="cv-modal-subtitle">Front-End Developer &bull; Executive View</p>
                            </div>
                        </div>

                        <!-- Segmented Switcher Tabs (Executive vs ATS) -->
                        <div class="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
                            <div class="flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/10 gap-1 text-xs font-sans">
                                <button type="button" id="tab-cv-executive" onclick="switchCvModalTab('executive')" class="cv-tab-btn active px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer text-white">
                                    <span class="material-symbols-outlined text-sm">palette</span>
                                    <span>Executive</span>
                                </button>
                                <button type="button" id="tab-cv-ats" onclick="switchCvModalTab('ats')" class="cv-tab-btn px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white">
                                    <span class="material-symbols-outlined text-sm">article</span>
                                    <span>ATS View</span>
                                </button>
                            </div>

                            <div class="flex items-center gap-2">
                                <a id="cv-btn-download" href="assets/resume.pdf" download="Arjun_R_Resume.pdf" class="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-sans text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer" title="Download Resume PDF">
                                    <span class="material-symbols-outlined text-sm">download</span>
                                    <span id="cv-download-label">Download PDF</span>
                                </a>
                                <a id="cv-btn-fullscreen" href="assets/resume.html" target="_blank" class="hidden sm:flex px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 font-sans text-xs font-medium items-center gap-1.5 transition-all cursor-pointer" title="Open Fullscreen Resume">
                                    <span class="material-symbols-outlined text-sm">open_in_new</span>
                                    <span>Open Tab</span>
                                </a>
                                <button id="resume-modal-close" onclick="closeResumeModal()" class="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer" aria-label="Close CV Modal">
                                    <span class="material-symbols-outlined text-base">close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="resume-modal-body flex-grow w-full rounded-xl overflow-y-auto bg-[#070a13] border border-white/10 relative p-4 md:p-6 text-slate-200 font-sans text-xs custom-scrollbar">
                        <!-- Pane 1: Executive Cyber CV -->
                        <div id="cv-pane-executive" class="cv-view-pane active space-y-4">

                        <!-- Header -->
                        <header class="glass-box p-4 rounded-xl border border-white/10 bg-slate-900/70 relative overflow-hidden">
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative z-10">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono text-[10px] text-cyan-400 tracking-widest uppercase">CURRICULUM VITAE</span>
                                    </div>
                                    <h1 class="text-2xl font-bold text-white mt-0.5 tracking-tight">Arjun R</h1>
                                    <p class="text-xs text-cyan-300 font-medium">Front-End Developer &amp; UI Architect | 2+ Years Experience | Data Viz Specialist</p>
                                </div>
                                <div class="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px] text-slate-300">
                                    <a href="mailto:ajuarjunr@gmail.com" class="flex items-center gap-1.5 hover:text-cyan-300"><span class="material-symbols-outlined text-cyan-400 text-xs">mail</span> ajuarjunr@gmail.com</a>
                                    <a href="tel:+918921843248" class="flex items-center gap-1.5 hover:text-cyan-300"><span class="material-symbols-outlined text-cyan-400 text-xs">call</span> +91 8921843248</a>
                                    <a href="https://arjun-portfolio-03.vercel.app" target="_blank" class="flex items-center gap-1.5 hover:text-cyan-300 text-cyan-400 font-bold"><span class="material-symbols-outlined text-cyan-400 text-xs">language</span> arjun-portfolio-03.vercel.app</a>
                                    <a href="https://github.com/Arjunrajan250" target="_blank" class="flex items-center gap-1.5 hover:text-cyan-300"><span class="material-symbols-outlined text-cyan-400 text-xs">code</span> github.com/Arjunrajan250</a>
                                    <span class="flex items-center gap-1.5 col-span-2 text-[10px] text-slate-400 mt-0.5"><span class="material-symbols-outlined text-cyan-400 text-xs">location_on</span> Kerala, India &bull; Currently Working</span>
                                </div>
                            </div>
                        </header>

                        <!-- Executive Summary -->
                        <section class="glass-box p-4 rounded-xl border border-white/10 bg-slate-900/70">
                            <h2 class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-sm">person</span> Executive Summary
                            </h2>
                            <p class="text-slate-300 leading-relaxed text-xs">
                                Front-End Developer &amp; UI Architect with <strong class="text-white">2+ years of hands-on experience</strong> in modern JavaScript, Angular, and React architectures with rich data visualization (amCharts, Three.js, Highcharts, Sigma.js, Chart.js). Experienced in engineering enterprise cybersecurity suites (SIEM, SOAR, UEBA, NDR) and interactive telemetry dashboards. Focused on modular component architecture, UI performance optimization, and reliable end-to-end delivery across high-density web platforms.
                            </p>
                        </section>

                        <!-- Technical Stack -->
                        <section class="glass-box p-4 rounded-xl border border-white/10 bg-slate-900/70">
                            <h2 class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-sm">terminal</span> Technical Stack &amp; Architecture
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-[11px]">
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-white/5">
                                    <span class="text-indigo-400 block mb-1 font-bold">CORE FRAMEWORKS</span>
                                    <p class="text-slate-200">Angular, JavaScript, React, and modern UI libraries</p>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-white/5">
                                    <span class="text-cyan-400 block mb-1 font-bold">DATA VIZ &amp; GRAPHICS</span>
                                    <p class="text-slate-200">Three.js, amCharts, Highcharts, Sigma.js, Chart.js</p>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-white/5">
                                    <span class="text-violet-400 block mb-1 font-bold">UI &amp; STYLING</span>
                                    <p class="text-slate-200">Tailwind CSS, Material Design 3, Glassmorphism, Micro-Animations, Responsive UX</p>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-white/5">
                                    <span class="text-emerald-400 block mb-1 font-bold">TOOLING &amp; AUTOMATION</span>
                                    <p class="text-slate-200">Git, GitHub, Vite, Webpack, Node.js, REST APIs, Headless Automation</p>
                                </div>
                            </div>
                        </section>

                        <!-- Professional Experience -->
                        <section class="glass-box p-4 rounded-xl border border-white/10 bg-slate-900/70">
                            <h2 class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-sm">work</span> Professional Experience
                            </h2>
                            <div class="space-y-3">
                                <div class="border-l-2 border-indigo-500/60 pl-3 py-0.5">
                                    <div class="flex justify-between items-center flex-wrap gap-1">
                                        <h3 class="text-white font-semibold text-xs">Front-End Developer — Innspark Solutions (CISAI)</h3>
                                        <span class="font-mono text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">JUNE 2024 — PRESENT</span>
                                    </div>
                                    <ul class="text-slate-300 text-[11px] mt-1 space-y-1 list-disc list-inside leading-relaxed">
                                        <li>Front-End Developer working on mission-critical cybersecurity-related projects, including SIEM, SOAR, UEBA, DNS security, and other highly confidential government projects.</li>
                                        <li>Architected dynamic real-time telemetry dashboards and data visualizations with amCharts, Three.js, Highcharts, Sigma.js, and Chart.js.</li>
                                        <li>Maintained strict client data security, enterprise privacy boundaries, and confidential compliance protocols across all deliverables.</li>
                                        <li>Optimized client-side rendering pipelines and state propagation, reducing dashboard load times and boosting performance on high-event-volume streams.</li>
                                    </ul>
                                </div>
                                <div class="border-l-2 border-cyan-500/60 pl-3 py-0.5">
                                    <div class="flex justify-between items-center flex-wrap gap-1">
                                        <h3 class="text-white font-semibold text-xs">MERN Stack Developer Intern — Techfriar Technologies</h3>
                                        <span class="font-mono text-[10px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-white/10">JULY 2023 — JAN 2024</span>
                                    </div>
                                    <ul class="text-slate-300 text-[11px] mt-1 space-y-1 list-disc list-inside leading-relaxed">
                                        <li>Developed full-stack web applications using React.js, Node.js, Express REST APIs, and MongoDB databases.</li>
                                        <li>Implemented secure JWT authentication workflows and responsive front-end dashboard interfaces.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <!-- Featured Projects -->
                        <section class="glass-box p-4 rounded-xl border border-white/10 bg-slate-900/70">
                            <h2 class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-sm">rocket_launch</span> Key Projects &amp; Engineering Systems
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-[11px]">
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-cyan-500/25 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-cyan-400 font-bold">Enterprise SIEM &amp; SOAR Suite</span>
                                            <span class="text-[9px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">CYBERSECURITY / SOC</span>
                                        </div>
                                        <p class="text-slate-300 text-[10px] leading-tight font-sans">Enterprise cybersecurity UI for event correlation, incident triage, and automated response playbooks.</p>
                                    </div>
                                    <span class="text-[10px] text-slate-400 mt-2 font-mono">Confidential Enterprise Platform (Under NDA)</span>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-indigo-500/25 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-indigo-400 font-bold">UEBA &amp; NDR Telemetry Systems</span>
                                            <span class="text-[9px] text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30">BEHAVIORAL AI / NDR</span>
                                        </div>
                                        <p class="text-slate-300 text-[10px] leading-tight font-sans">User entity behavioral analytics &amp; network detection dashboards visualizing threat risk scores.</p>
                                    </div>
                                    <span class="text-[10px] text-slate-400 mt-2 font-mono">Confidential Security Analytics Suite</span>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-emerald-500/25 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-emerald-400 font-bold">Interactive Web Platforms</span>
                                            <span class="text-[9px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">FULL-STACK UI</span>
                                        </div>
                                        <p class="text-slate-300 text-[10px] leading-tight font-sans">High-performance modern web applications engineered with modular architecture, reactive state, and responsive styling.</p>
                                    </div>
                                    <span class="text-[10px] text-slate-400 mt-2 font-mono">Component Architecture &amp; Delivery</span>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-violet-500/25 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-violet-400 font-bold">Voice Assist AI for Visually Impaired</span>
                                            <span class="text-[9px] text-violet-300 bg-violet-950/80 px-1.5 py-0.5 rounded border border-violet-500/30">DEEP LEARNING</span>
                                        </div>
                                        <p class="text-slate-300 text-[10px] leading-tight font-sans">Deep learning-based intelligent voice assistance system enhancing accessibility and independence.</p>
                                    </div>
                                    <span class="text-[10px] text-slate-400 mt-2 font-mono">Diploma Final Year Capstone Project</span>
                                </div>
                            </div>
                        </section>

                        <!-- Education & Certifications -->
                        <section class="glass-box p-4 rounded-xl border border-white/10 bg-slate-900/70">
                            <h2 class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-sm">school</span> Academic Credentials &amp; Certifications
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-2.5">
                                <div class="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-lg border border-white/5">
                                    <div>
                                        <h3 class="text-white font-semibold text-xs">Bachelor of Computer Applications (BCA)</h3>
                                        <p class="text-slate-400 text-[10px]">Amrita AHEAD (Online) &bull; Software Eng. (Pursuing alongside full-time work)</p>
                                    </div>
                                    <span class="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">2024 — PRES</span>
                                </div>
                                <div class="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-lg border border-white/5">
                                    <div>
                                        <h3 class="text-white font-semibold text-xs">Diploma in Computer Engineering</h3>
                                        <p class="text-slate-400 text-[10px]">Carmel Polytechnic &bull; Distinction &bull; Campus Placed at CISAI (Innspark)</p>
                                    </div>
                                    <span class="font-mono text-[10px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-white/10">2021 — 2024</span>
                                </div>
                            </div>
                            <!-- Diploma Internship Certifications -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-cyan-500/20">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-cyan-400 font-bold text-[11px]">Basics of AI &amp; ML &mdash; Lekshmi Infotech</span>
                                        <span class="text-[9px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30">DIPLOMA INTERNSHIP</span>
                                    </div>
                                    <p class="text-slate-400 text-[10px] leading-snug">Comprehensive training in AI &amp; Machine Learning algorithms, data preprocessing, and hands-on implementation.</p>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-indigo-500/20">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-indigo-400 font-bold text-[11px]">Basics of Telecommunication &mdash; BSNL</span>
                                        <span class="text-[9px] text-indigo-300 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-500/30">DIPLOMA INTERNSHIP</span>
                                    </div>
                                    <p class="text-slate-400 text-[10px] leading-snug">Fundamentals of modern telecom concepts, data transmission, and network infrastructure architecture.</p>
                                </div>
                            </div>
                        </section>

                        <!-- Specialized Competencies & Strengths (4 Cards) -->
                        <section class="glass-box p-4 rounded-xl border border-white/10 bg-slate-900/70">
                            <h2 class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-sm">verified_user</span> Specialized Competencies &amp; Engineering Strengths
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-[11px]">
                                <div class="p-3 bg-slate-950/80 rounded-lg border border-cyan-500/20 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-cyan-400 font-bold text-xs">Security &amp; Data Privacy</span>
                                            <span class="text-[9px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30">CONFIDENTIALITY</span>
                                        </div>
                                        <p class="text-slate-300 text-[10.5px] leading-relaxed mb-2">Adhering to strict enterprise security standards, code cleanliness, and confidentiality protocols when developing mission-critical software.</p>
                                    </div>
                                    <span class="text-[9.5px] text-cyan-400/80 font-mono">Enterprise Privacy &bull; Code Integrity</span>
                                </div>
                                <div class="p-3 bg-slate-950/80 rounded-lg border border-indigo-500/20 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-indigo-400 font-bold text-xs">Cyber &amp; SOC Telemetry Dashboards</span>
                                            <span class="text-[9px] text-indigo-300 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-500/30">TELEMETRY / VIZ</span>
                                        </div>
                                        <p class="text-slate-300 text-[10.5px] leading-relaxed mb-2">Specialized in architecting high-density telemetry consoles, SOC suites (SIEM, SOAR, UEBA, NDR), interactive data grids, dynamic graph topologies, and real-time security analytics.</p>
                                    </div>
                                    <span class="text-[9.5px] text-indigo-400/80 font-mono">amCharts &bull; Three.js &bull; Highcharts &bull; Sigma.js</span>
                                </div>
                                <div class="p-3 bg-slate-950/80 rounded-lg border border-emerald-500/20 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-emerald-400 font-bold text-xs">Technical Adaptability</span>
                                            <span class="text-[9px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">FAST TURNAROUND</span>
                                        </div>
                                        <p class="text-slate-300 text-[10.5px] leading-relaxed mb-2">Quickly mastering new frameworks, libraries, and APIs to design, build, and deploy full-lifecycle websites, apps, and software systems.</p>
                                    </div>
                                    <span class="text-[9.5px] text-emerald-400/80 font-mono">Full-Lifecycle Delivery &bull; Rapid Prototyping</span>
                                </div>
                                <div class="p-3 bg-slate-950/80 rounded-lg border border-violet-500/20 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-violet-400 font-bold text-xs">UI Architecture &amp; Performance</span>
                                            <span class="text-[9px] text-violet-300 bg-violet-950/80 px-1.5 py-0.2 rounded border border-violet-500/30">HIGH PERFORMANCE</span>
                                        </div>
                                        <p class="text-slate-300 text-[10.5px] leading-relaxed mb-2">Engineering modular component systems, reactive state architectures, responsive cross-device layouts, glassmorphic UI polish, and smooth micro-animations for high-load platforms.</p>
                                    </div>
                                    <span class="text-[9.5px] text-violet-400/80 font-mono">Component Design &bull; Reactive Streams &bull; UX Polish</span>
                                </div>
                            </div>
                        </section>

                        <!-- Subtle Closing Portfolio CTA Footer -->
                        <footer class="text-center font-mono text-[10px] text-slate-400 border-t border-white/10 pt-2.5 mt-2">
                            ✦ Explore live interactive demos, architecture case studies &amp; terminal: <a href="https://arjun-portfolio-03.vercel.app" target="_blank" class="text-cyan-400 hover:underline font-bold">arjun-portfolio-03.vercel.app</a>
                        </footer>
                        </div>
                        <!-- End Pane 1 -->

                        <!-- Pane 2: ATS-Friendly CV (Machine-Readable, High Contrast, Single Column) -->
                        <div id="cv-pane-ats" class="cv-view-pane space-y-4">
                            <!-- ATS Utility Bar within pane -->
                            <div class="bg-slate-900/80 border border-white/10 rounded-xl p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-2 h-2 rounded-full bg-slate-400"></div>
                                    <div>
                                        <div class="font-sans text-xs text-white font-semibold tracking-tight">Plain Text &amp; Single-Column Format</div>
                                        <div class="text-[11px] text-slate-400">Optimized for automated parsers and clean text extraction</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button type="button" onclick="copyPlainResumeText()" id="modal-copy-plain-btn" class="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-white/10 font-sans text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer hover:border-white/20">
                                        <span class="material-symbols-outlined text-sm">content_copy</span>
                                        <span id="modal-copy-plain-label">Copy Plain Text</span>
                                    </button>
                                    <a href="assets/resume-ats.pdf" download="Arjun_R_Resume_ATS.pdf" class="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-sans text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
                                        <span class="material-symbols-outlined text-sm">download</span>
                                        <span>Download ATS PDF</span>
                                    </a>
                                </div>
                            </div>

                            <!-- ATS Document Body (Rendered High-Contrast Container) -->
                            <div class="bg-white text-slate-900 p-6 md:p-8 rounded-xl border border-slate-300 shadow-xl space-y-3 font-sans text-xs">
                                <!-- ATS Header -->
                                <div class="text-center pb-2 border-b border-slate-900">
                                    <h1 class="text-2xl font-extrabold uppercase text-slate-950 tracking-tight">Arjun R</h1>
                                    <p class="text-xs font-bold text-slate-800 mt-0.5">Front-End Developer &bull; UI Architect &bull; Data Visualization Specialist</p>
                                    <div class="mt-1.5 text-[10px] text-slate-700 flex flex-wrap justify-center gap-x-2 gap-y-0.5 font-mono">
                                        <span>Alappuzha, Kerala, India</span>
                                        <span>&bull;</span>
                                        <a href="mailto:ajuarjunr@gmail.com" class="text-slate-900 font-semibold hover:underline">ajuarjunr@gmail.com</a>
                                        <span>&bull;</span>
                                        <a href="tel:+918921843248" class="text-slate-900 font-semibold hover:underline">+91 8921843248</a>
                                        <span>&bull;</span>
                                        <a href="https://arjun-portfolio-03.vercel.app" target="_blank" class="text-slate-900 font-semibold hover:underline">arjun-portfolio-03.vercel.app</a>
                                        <span>&bull;</span>
                                        <a href="https://github.com/Arjunrajan250" target="_blank" class="text-slate-900 font-semibold hover:underline">github.com/Arjunrajan250</a>
                                    </div>
                                </div>

                                <!-- ATS Section: Professional Summary -->
                                <div>
                                    <h2 class="font-mono text-[11px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1 mt-2">Professional Summary</h2>
                                    <p class="text-slate-700 leading-relaxed text-[11px]">
                                        Front-End Developer and UI Architect with <strong>2+ years of professional experience</strong> engineering modern JavaScript, Angular, and React applications with high-density data visualizations (amCharts, Three.js, Highcharts, Sigma.js, Chart.js). Proven track record developing enterprise cybersecurity suites (SIEM, SOAR, UEBA, NDR) and telemetry dashboards. Focused on modular component architecture, UI performance optimization, and reliable end-to-end delivery across high-density web platforms.
                                    </p>
                                </div>

                                <!-- ATS Section: Technical Skills -->
                                <div>
                                    <h2 class="font-mono text-[11px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1 mt-2">Core Competencies &amp; Technical Skills</h2>
                                    <div class="space-y-1 text-[11px] text-slate-800">
                                        <div><strong class="text-slate-950">Front-End &amp; UI:</strong> JavaScript (ES6+), TypeScript, Angular, React.js, HTML5, CSS3, Tailwind CSS, Responsive Web Design, Component-Driven UI.</div>
                                        <div><strong class="text-slate-950">Data Visualization &amp; 3D:</strong> Three.js (WebGL), amCharts 5, Highcharts, Sigma.js (Network Graphs), Chart.js, D3.js, Leaflet.js.</div>
                                        <div><strong class="text-slate-950">State &amp; Architecture:</strong> RxJS Reactive Streams, RESTful APIs, State Management, UI Performance Optimization.</div>
                                        <div><strong class="text-slate-950">Domain Expertise:</strong> Cybersecurity Operations (SOC) Suites, SIEM Event Correlation, SOAR Incident Playbooks, UEBA Analytics, NDR Telemetry.</div>
                                        <div><strong class="text-slate-950">Developer Tools:</strong> Git, GitHub, Vite, Webpack, Node.js, Express.js, Headless Automation, Modern CI/CD Workflows.</div>
                                    </div>
                                </div>

                                <!-- ATS Section: Work Experience -->
                                <div>
                                    <h2 class="font-mono text-[11px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1 mt-2">Work Experience</h2>
                                    
                                    <div class="mb-2.5">
                                        <div class="flex justify-between items-baseline flex-wrap">
                                            <span class="font-bold text-slate-950 text-xs">Front-End Developer</span>
                                            <span class="font-mono text-[10px] text-slate-600 font-bold">June 2024 — Present</span>
                                        </div>
                                        <div class="text-[10.5px] font-semibold text-slate-700 mb-1">Innspark Solutions (CISAI) &bull; Kerala, India (Full-Time)</div>
                                        <ul class="list-disc list-outside ml-4 text-[10.5px] text-slate-700 space-y-0.5">
                                            <li>Front-End Developer working on mission-critical cybersecurity-related projects, including SIEM, SOAR, UEBA, DNS security, and other highly confidential government projects.</li>
                                            <li>Architected dynamic real-time telemetry dashboards and data visualizations with amCharts, Three.js, Highcharts, Sigma.js, and Chart.js.</li>
                                            <li>Maintained strict client data security, enterprise privacy boundaries, and confidential compliance protocols across all deliverables.</li>
                                            <li>Optimized client-side rendering pipelines and state propagation, reducing dashboard load times and boosting performance on high-event-volume streams.</li>
                                        </ul>
                                    </div>


                                    <div>
                                        <div class="flex justify-between items-baseline flex-wrap">
                                            <span class="font-bold text-slate-950 text-xs">MERN Stack Developer Intern</span>
                                            <span class="font-mono text-[10px] text-slate-600 font-bold">July 2023 — January 2024</span>
                                        </div>
                                        <div class="text-[10.5px] font-semibold text-slate-700 mb-1">Techfriar Technologies &bull; Kerala, India (Internship)</div>
                                        <ul class="list-disc list-outside ml-4 text-[10.5px] text-slate-700 space-y-0.5">
                                            <li>Developed full-stack web applications with React.js, Node.js, Express REST APIs, and MongoDB.</li>
                                            <li>Implemented secure user authentication with JWT tokens and responsive dashboard interfaces.</li>
                                        </ul>
                                    </div>
                                </div>

                                <!-- ATS Section: Key Projects -->
                                <div>
                                    <h2 class="font-mono text-[11px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1 mt-2">Key Engineering Projects</h2>
                                    <div class="space-y-1.5 text-[10.5px] text-slate-700">
                                        <div>
                                            <div class="flex justify-between items-baseline font-bold text-slate-950">
                                                <span>Enterprise SIEM, SOAR &amp; DNS Security Console</span>
                                                <span class="font-mono text-[9.5px] text-slate-500 font-normal">Cybersecurity / SOC Suite</span>
                                            </div>
                                            <p class="leading-snug">Enterprise console for security operations and confidential government projects: incident correlation, threat investigation, and automated response playbooks.</p>
                                        </div>

                                        <div>
                                            <div class="flex justify-between items-baseline font-bold text-slate-950">
                                                <span>UEBA &amp; NDR Telemetry Systems</span>
                                                <span class="font-mono text-[9.5px] text-slate-500 font-normal">Behavioral AI / NDR</span>
                                            </div>
                                            <p class="leading-snug">Topological graph network dashboards (Sigma.js) monitoring lateral entity movements and data exfiltration.</p>
                                        </div>
                                        <div>
                                            <div class="flex justify-between items-baseline font-bold text-slate-950">
                                                <span>Cyber Crimes &amp; Threat Intelligence India (IndiaLens)</span>
                                                <span class="font-mono text-[9.5px] text-slate-500 font-normal">Open Defense Portal</span>
                                            </div>
                                            <p class="leading-snug">Interactive portal with scam kill-chain visualizers, SMS/URL scanner, and 1930 incident triage workflows.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- ATS Section: Education & Certifications -->
                                <div>
                                    <h2 class="font-mono text-[11px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1 mt-2">Education &amp; Certifications</h2>
                                    <div class="space-y-1 text-[10.5px] text-slate-700">
                                        <div class="flex justify-between items-baseline">
                                            <span class="font-bold text-slate-950">Bachelor of Computer Applications (BCA) &mdash; Software Engineering</span>
                                            <span class="font-mono text-[10px] text-slate-600">2024 — Present</span>
                                        </div>
                                        <p class="text-slate-600 text-[10px]">Amrita AHEAD &bull; Online Higher Education (Pursuing alongside full-time work)</p>

                                        <div class="flex justify-between items-baseline mt-1">
                                            <span class="font-bold text-slate-950">Diploma in Computer Engineering</span>
                                            <span class="font-mono text-[10px] text-slate-600">2021 — 2024</span>
                                        </div>
                                        <p class="text-slate-600 text-[10px]">Carmel Polytechnic College &bull; First Class with Distinction &bull; Campus Placed at CISAI</p>

                                        <div class="mt-1.5 pt-1 border-t border-slate-200">
                                            <strong class="text-slate-950">Certifications:</strong> Basics of AI &amp; ML (Lekshmi Infotech) &bull; Fundamentals of Telecommunications (BSNL).
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- End Pane 2 -->
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

    injectAppleDynamicIsland();
}

// --- Theme Controller (Dark / Light Theme Toggle) ---
function initThemeToggle() {
    const STORAGE_KEY = 'portfolio-theme';

    function getSavedTheme() {
        try {
            const params = new URLSearchParams(window.location.search);
            const qTheme = params.get('theme');
            if (qTheme === 'light' || qTheme === 'dark') return qTheme;
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'light' || saved === 'dark') return saved;
        } catch (e) {
            // localStorage unavailable
        }
        return 'light'; // Clean light theme by default
    }

    function applyTheme(theme, persist = true) {
        const isDark = theme === 'dark';
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }

        if (persist) {
            try {
                localStorage.setItem(STORAGE_KEY, theme);
            } catch (e) {}
        }

        // Update all desktop and header theme toggle buttons
        const toggleButtons = document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn');
        toggleButtons.forEach(btn => {
            btn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
            btn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
        });

        // Update mobile drawer button
        const mobileBtn = document.getElementById('mobile-theme-toggle-btn');
        if (mobileBtn) {
            const icon = mobileBtn.querySelector('.mobile-theme-icon');
            const label = mobileBtn.querySelector('.mobile-theme-label');
            const action = mobileBtn.querySelector('.switch-action-text');
            if (icon) icon.textContent = isDark ? 'dark_mode' : 'light_mode';
            if (label) label.textContent = isDark ? 'Dark Theme' : 'Light Theme';
            if (action) action.textContent = isDark ? 'Switch to Light' : 'Switch to Dark';
        }

        window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme, isDark } }));
    }

    // Set initial theme based on saved setting
    const currentTheme = getSavedTheme();
    applyTheme(currentTheme, false);

    window.togglePortfolioTheme = function() {
        const isCurrentlyDark = document.documentElement.classList.contains('dark');
        const nextTheme = isCurrentlyDark ? 'light' : 'dark';
        applyTheme(nextTheme, true);
        if (window.CyberAudio && typeof window.CyberAudio.playBlip === 'function') {
            window.CyberAudio.playBlip(isCurrentlyDark ? 700 : 950, 0.04);
        }
    };

    window.setPortfolioTheme = function(theme) {
        if (theme === 'light' || theme === 'dark') {
            applyTheme(theme, true);
        }
    };

    // Attach listeners to all theme toggle buttons present on DOM
    document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn').forEach(btn => {
        btn.removeEventListener('click', window.togglePortfolioTheme);
        btn.addEventListener('click', window.togglePortfolioTheme);
    });

    const mobileBtn = document.getElementById('mobile-theme-toggle-btn');
    if (mobileBtn) {
        mobileBtn.removeEventListener('click', window.togglePortfolioTheme);
        mobileBtn.addEventListener('click', window.togglePortfolioTheme);
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
    drawer.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => toggle(false));
    });
}

// --- 4. Interactive HUD Terminal Modal ---
function openTerminal() {
    let overlay = document.getElementById('terminal-hud');
    if (!overlay) {
        if (typeof injectSharedComponents === 'function') {
            injectSharedComponents();
        }
        overlay = document.getElementById('terminal-hud');
    }
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Ensure event listeners are bound to prompt input
        initTerminalHud();

        const input = document.getElementById('terminal-prompt');
        if (input) {
            setTimeout(() => input.focus(), 50);
        }
    }
}

function closeTerminal() {
    const overlay = document.getElementById('terminal-hud');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Expose globally on window scope immediately
window.openTerminal = openTerminal;
window.closeTerminal = closeTerminal;

// Global hotkey listener for Ctrl+\ and Backtick
window.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('terminal-hud');
    const isOpen = overlay && overlay.classList.contains('open');

    if (e.key === 'Escape' && isOpen) {
        closeTerminal();
        return;
    }

    const isBackslash = e.key === '\\' || e.key === '\x1c' || e.code === 'Backslash';
    const isBacktick = e.key === '`' || e.code === 'Backquote' || e.key === '~';
    const activeEl = document.activeElement;
    const isEditing = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

    if ((e.ctrlKey && isBackslash) || (isBacktick && !isOpen && !isEditing)) {
        e.preventDefault();
        if (isOpen) closeTerminal();
        else openTerminal();
    }
});

function initTerminalHud() {
    const overlay = document.getElementById('terminal-hud');
    if (!overlay) return;

    const closeBtn = document.getElementById('terminal-hud-close');
    const input = document.getElementById('terminal-prompt');
    const body = document.getElementById('terminal-body');
    const windowEl = overlay.querySelector('.terminal-hud-window');

    const triggerBtns = document.querySelectorAll('.terminal-trigger, .navbar-terminal-btn');
    triggerBtns.forEach(btn => {
        if (!btn.dataset.bound) {
            btn.dataset.bound = 'true';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openTerminal();
            });
        }
    });

    if (closeBtn && !closeBtn.dataset.bound) {
        closeBtn.dataset.bound = 'true';
        closeBtn.addEventListener('click', closeTerminal);
    }
    if (overlay && !overlay.dataset.bound) {
        overlay.dataset.bound = 'true';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeTerminal();
        });
    }

    if (input && body && !input.dataset.bound) {
        input.dataset.bound = 'true';
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const commandLine = input.value;
                input.value = '';
                executeCommand(commandLine, body, windowEl, closeTerminal);
            } else if (e.key.length === 1 || e.key === 'Backspace') {
                try {
                    if (window.CyberAudio && typeof window.CyberAudio.playKey === 'function') {
                        window.CyberAudio.playKey();
                    }
                } catch (err) {}
            }
        });
        body.addEventListener('click', () => input.focus());
    }
}

function executeCommand(cmdLine, bodyEl, windowEl, closeFn) {
    if (!bodyEl) bodyEl = document.getElementById('terminal-body');
    if (!bodyEl) return;

    const trimmedInput = (cmdLine || '').trim();
    if (!trimmedInput) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'mt-2';
        emptyEl.innerHTML = `<span class="text-cyan-400 font-bold">›</span>`;
        bodyEl.appendChild(emptyEl);
        bodyEl.scrollTop = bodyEl.scrollHeight;
        return;
    }

    const rawInput = trimmedInput.toLowerCase();
    const parts = rawInput.split(/\s+/);
    const primaryCmd = parts[0];
    const arg = parts[1];

    let output = '';

    const queryEl = document.createElement('div');
    queryEl.className = 'mt-2';
    queryEl.innerHTML = `<span class="text-cyan-400 font-bold">›</span> <span class="text-white">${escapeHtml(trimmedInput)}</span>`;
    bodyEl.appendChild(queryEl);

    let cmd = primaryCmd;
    if (['about', 'profile', 'bio', 'developer', 'who'].includes(cmd) || rawInput === 'whoami') cmd = 'about';
    else if (['skills', 'skill', 'matrix', 'stack', 'tech', 'metrics'].includes(cmd) || rawInput.includes('metrics') || rawInput.includes('matrix')) cmd = 'skills';
    else if (['experience', 'career', 'summary', 'logs', 'timeline', 'work', 'history'].includes(cmd) || rawInput.includes('logs')) cmd = 'experience';
    else if (['projects', 'output', 'outputs', 'portfolio', 'apps', 'highlight'].includes(cmd) || rawInput.includes('output')) cmd = 'projects';
    else if (['contact', 'handles', 'dispatch', 'email', 'socials', 'github', 'reach'].includes(cmd) || rawInput.includes('socials')) cmd = 'contact';
    else if (['cv', 'resume', 'pdf'].includes(cmd) || rawInput.includes('cv') || rawInput.includes('resume')) cmd = 'cv';
    else if (['theme', 'colors', 'color', 'styling', 'dark', 'light', 'mode'].includes(cmd) || rawInput.includes('styling')) cmd = 'theme';
    else if (['ls', 'dir', 'list'].includes(cmd)) cmd = 'ls';
    else if (['cat', 'read', 'view'].includes(cmd)) cmd = 'cat';
    else if (['date', 'time'].includes(cmd)) cmd = 'date';
    else if (['neofetch', 'system', 'specs', 'sys'].includes(cmd)) cmd = 'neofetch';
    else if (['sudo', 'su', 'root'].includes(cmd)) cmd = 'sudo';
    else if (['ping'].includes(cmd)) cmd = 'ping';

    switch (cmd) {
        case 'help':
        case '?':
        case 'man':
        case 'commands':
            output = `
<div class="mt-1 text-cyan-400 font-bold">=== AVAILABLE COMMANDS ===</div>
<div class="mt-2 space-y-1.5 ml-1 font-mono text-xs md:text-sm">
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-cyan-400 font-bold w-36 shrink-0">[projects]</span><span class="text-slate-300">Selected projects & live web applications</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-cyan-400 font-bold w-36 shrink-0">[skills / stack]</span><span class="text-slate-300">Front-end architecture & framework proficiencies</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-cyan-400 font-bold w-36 shrink-0">[experience]</span><span class="text-slate-300">Career timeline & engineering roles</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-cyan-400 font-bold w-36 shrink-0">[about]</span><span class="text-slate-300">Developer background & bio</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-cyan-400 font-bold w-36 shrink-0">[contact / email]</span><span class="text-slate-300">Direct email, phone & social profiles</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-cyan-400 font-bold w-36 shrink-0">[cv / resume]</span><span class="text-slate-300">Open full Curriculum Vitae modal</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-cyan-400 font-bold w-36 shrink-0">[theme &lt;name&gt;]</span><span class="text-slate-300">Set theme (cyan, green, amber, purple, steel)</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-cyan-400 font-bold w-36 shrink-0">[clear]</span><span class="text-slate-300">Clear console history</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-cyan-400 font-bold w-36 shrink-0">[exit / quit]</span><span class="text-slate-300">Close command palette</span></div>
</div>
            `;
            break;
        case 'about':
            output = `
<div class="mt-1">
  <span class="font-bold text-accent">Arjun R</span> &mdash; Front-End Developer & UI Architect.<br>
  Currently working at <span class="text-accent font-semibold">CISAI</span>.<br>
  Pursuing Bachelor of Computer Applications (BCA).<br>
  Obsessed with high-performance Web APIs, modular component architecture, and sleek glassmorphic UI systems.
</div>
            `;
            break;
        case 'skills':
            output = `
<div class="mt-1 font-bold text-accent">TECHNICAL STACK MATRIX:</div>
<div class="ml-2 mt-1 select-none font-code-sm leading-tight">
  Angular / TS  <span class="text-accent">[████████████████████████]</span> 95%<br>
  UI Architecture <span class="text-accent">[██████████████████████░░]</span> 92%<br>
  Data / Viz    <span class="text-accent">[████████████████████░░░░]</span> 88%<br>
  React / Tailwind <span class="text-accent">[██████████████████████░░]</span> 90%<br>
  Three.js / WebGL <span class="text-accent">[██████████████████░░░░░░]</span> 82%
</div>
            `;
            break;
        case 'experience':
            output = `
<div class="mt-1 font-bold text-accent">CAREER TIMELINE SUMMARY:</div>
<div class="ml-2 mt-1 space-y-1">
  <div>&bull; <span class="text-accent font-semibold">Front-End Developer @ CISAI</span> | Present</div>
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
  <div>1. <span class="text-accent font-semibold">IndiaLens OGD</span> &mdash; Leaflet GIS & data.gov.in AI</div>
  <div>2. <span class="text-accent font-semibold">Cyber Crimes & Threat Intelligence India</span> &mdash; Crime Telemetry & 1930 Triage</div>
  <div>3. <span class="text-accent font-semibold">InstantCred Decision Engine</span> &mdash; Vanilla JS & Vite (<a href="https://www.instantcred.in/" target="_blank" class="text-accent underline">instantcred.in</a>)</div>
  <div>4. <span class="text-accent font-semibold">PixelNest Headless E-Commerce</span> &mdash; React 19 & Shopify GraphQL (<a href="https://pixelnest-headless-shopify.vercel.app/" target="_blank" class="text-accent underline">pixelnest.vercel.app</a>)</div>
  <div>5. <span class="text-accent font-semibold">Sadhnam Indo P2P</span> &mdash; React 19 & Supabase</div>
  <div>6. <span class="text-accent font-semibold">ThreatLens Cyber Console</span> &mdash; D3.js v7 OSINT</div>
  <div>7. <span class="text-accent font-semibold">ARION Tactical &amp; Voice Operations Suite</span> &mdash; Real-Time Data &amp; Voice AI</div>
  <div>8. <span class="text-accent font-semibold">Luxe3D Quantum One Showcase</span> &mdash; Three.js WebGL 3D</div>
  <div>9. <span class="text-accent font-semibold">VortexDL Media Downloader</span> &mdash; <a href="https://938752.vercel.app/" target="_blank" class="text-accent underline">938752.vercel.app</a></div>
  <div>10. <span class="text-accent font-semibold">SVG Convert</span> &mdash; Figma Plugin API</div>
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
            if (arg.includes('ats')) {
                window.openResumeModal('ats');
                output = `<div class="mt-1 text-emerald-400">Opening ATS-Friendly Curriculum Vitae (Machine-Readable)...</div>`;
            } else {
                window.openResumeModal('executive');
                output = `<div class="mt-1 text-accent">Opening Curriculum Vitae modal (Executive View)...</div>`;
            }
            break;
        case 'ls':
            output = `
<div class="mt-1 flex flex-wrap gap-4 font-mono text-xs">
  <span class="text-cyan-400 font-bold">about.txt</span>
  <span class="text-emerald-400 font-bold">skills.md</span>
  <span class="text-violet-400 font-bold">projects.json</span>
  <span class="text-amber-400 font-bold">experience.log</span>
  <span class="text-indigo-400 font-bold">contact.vcf</span>
  <span class="text-red-400 font-bold">cv.pdf</span>
  <span class="text-emerald-400 font-bold">cv-ats.pdf</span>
</div>
            `;
            break;
        case 'cat':
            if (!arg) {
                output = `<div class="mt-1 text-red-400">Usage: cat &lt;filename&gt; (e.g. cat about.txt)</div>`;
            } else if (arg.includes('about')) {
                output = `<div class="mt-1">Arjun R &mdash; Front-End Developer & UI Architect at CISAI specializing in high-performance web interfaces.</div>`;
            } else if (arg.includes('skills')) {
                output = `<div class="mt-1">Angular, React, TypeScript, HTML5/CSS3, Three.js, WebGL, D3.js, Leaflet.js, Tailwind CSS</div>`;
            } else if (arg.includes('projects')) {
                output = `<div class="mt-1">IndiaLens, Cyber Crimes & Threat Intelligence India, InstantCred, PixelNest, Sadhnam Indo, ThreatLens, ARION Tactical Suite, Luxe3D Quantum, VortexDL, SVG Convert</div>`;
            } else if (arg.includes('experience')) {
                output = `<div class="mt-1">Currently working at CISAI as Front-End Developer.</div>`;
            } else if (arg.includes('contact')) {
                output = `<div class="mt-1">Email: ajuarjunr@gmail.com | Phone: +91 8921843248</div>`;
            } else if (arg.includes('ats')) {
                window.openResumeModal('ats');
                output = `<div class="mt-1 text-emerald-400">Opening cv-ats.pdf machine-readable preview...</div>`;
            } else if (arg.includes('cv')) {
                window.openResumeModal('executive');
                output = `<div class="mt-1 text-accent">Opening cv.pdf preview...</div>`;
            } else {
                output = `<div class="mt-1 text-red-400">cat: ${escapeHtml(arg)}: No such file or directory</div>`;
            }
            break;

        case 'date':
            output = `<div class="mt-1 text-accent">${new Date().toUTCString()}</div>`;
            break;
        case 'neofetch':
            output = `
<div class="mt-1 font-mono text-xs text-accent">
  Role: Front-End Developer &amp; UI Engineer<br>
  Location: Alappuzha, Kerala, India (IST)<br>
  Core Stack: Angular, TypeScript, React, Tailwind CSS, Three.js<br>
  Current: Innspark Solutions (CISAI)<br>
  Education: BCA (Amrita AHEAD) / Diploma in Computer Eng.<br>
  Platform: Modern Web Standards (HTML5 / ES2024 / CSS3)
</div>
            `;
            break;
        case 'sudo':
            output = `<div class="mt-1 text-slate-400">All commands in this portfolio are read-only. Try typing <span class="text-cyan-400 font-semibold">projects</span> or <span class="text-cyan-400 font-semibold">resume</span>.</div>`;
            break;
        case 'ping':
            output = `<div class="mt-1 text-emerald-400">Response time: ~0.4ms (Client-Side Reactive SPA)</div>`;
            break;
        case 'theme':
            const themes = ['cyan', 'green', 'amber', 'purple', 'steel'];
            if (primaryCmd === 'dark' || arg === 'dark') {
                window.setPortfolioTheme('dark');
                output = `<div class="mt-1 text-cyan-400 font-semibold">Portfolio switched to: DARK THEME</div>`;
            } else if (primaryCmd === 'light' || arg === 'light') {
                window.setPortfolioTheme('light');
                output = `<div class="mt-1 text-amber-400 font-semibold">Portfolio switched to: LIGHT THEME</div>`;
            } else if (primaryCmd === 'mode' || arg === 'toggle') {
                window.togglePortfolioTheme();
                const isNowDark = document.documentElement.classList.contains('dark');
                output = `<div class="mt-1 text-accent font-semibold">Theme toggled to: ${isNowDark ? 'DARK' : 'LIGHT'}</div>`;
            } else if (!arg) {
                output = `<div class="mt-1">Specify theme. Colors: ${themes.join(', ')} | Mode: 'dark', 'light'</div>`;
            } else if (themes.includes(arg)) {
                if (windowEl) {
                    themes.forEach(t => windowEl.classList.remove(`theme-${t}`));
                    windowEl.classList.add(`theme-${arg}`);
                }
                output = `<div class="mt-1 text-accent font-semibold">Terminal theme set to: ${arg}</div>`;
            } else {
                output = `<div class="mt-1 text-red-400">Invalid theme. Supported: ${themes.join(', ')}, or 'dark' / 'light'</div>`;
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
            output = `<div class="mt-1 text-red-400">Unknown command: '${escapeHtml(cmdLine)}'. Type <span class="text-accent font-semibold">help</span> to list commands.</div>`;
    }

    const responseEl = document.createElement('div');
    responseEl.className = 'mb-2';
    responseEl.innerHTML = output;
    bodyEl.appendChild(responseEl);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    setTimeout(() => {
        const input = document.getElementById('terminal-prompt');
        if (input) input.focus();
    }, 10);
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
        } catch (e) { }
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
        } catch (e) { }
    },

    playKey() {
        if (!this.enabled) return;
        this.playBlip(850 + Math.random() * 250, 0.03);
    }
};
window.CyberAudio = CyberAudio;

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

window.switchCvModalTab = function(tabName) {
    const execTab = document.getElementById('tab-cv-executive');
    const atsTab = document.getElementById('tab-cv-ats');
    const execPane = document.getElementById('cv-pane-executive');
    const atsPane = document.getElementById('cv-pane-ats');
    const subtitle = document.getElementById('cv-modal-subtitle');
    const downloadBtn = document.getElementById('cv-btn-download');
    const fullscreenBtn = document.getElementById('cv-btn-fullscreen');
    const downloadLabel = document.getElementById('cv-download-label');

    if (!execTab || !atsTab || !execPane || !atsPane) return;

    try { if (window.CyberAudio) CyberAudio.playBlip(750, 0.03); } catch(e) {}

    if (tabName === 'ats') {
        execTab.classList.remove('active');
        execTab.classList.add('text-slate-400');
        execTab.classList.remove('text-white');
        
        atsTab.classList.add('active');
        atsTab.classList.remove('text-slate-400');
        atsTab.classList.add('text-white');

        execPane.classList.remove('active');
        atsPane.classList.add('active');

        if (subtitle) subtitle.textContent = 'Front-End Developer • Single-Column Plain Text View';
        if (downloadBtn) {
            downloadBtn.href = 'assets/resume-ats.pdf';
            downloadBtn.download = 'Arjun_R_Resume_ATS.pdf';
            downloadBtn.className = 'px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-sans text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer';
        }
        if (downloadLabel) downloadLabel.textContent = 'Download ATS PDF';
        if (fullscreenBtn) {
            fullscreenBtn.href = 'assets/resume-ats.html';
            fullscreenBtn.className = 'hidden sm:flex px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 font-sans text-xs font-medium items-center gap-1.5 transition-all cursor-pointer';
        }
    } else {
        atsTab.classList.remove('active');
        atsTab.classList.add('text-slate-400');
        atsTab.classList.remove('text-white');

        execTab.classList.add('active');
        execTab.classList.remove('text-slate-400');
        execTab.classList.add('text-white');

        atsPane.classList.remove('active');
        execPane.classList.add('active');

        if (subtitle) subtitle.textContent = 'Front-End Developer • Executive View';
        if (downloadBtn) {
            downloadBtn.href = 'assets/resume.pdf';
            downloadBtn.download = 'Arjun_R_Resume.pdf';
            downloadBtn.className = 'px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-sans text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer';
        }
        if (downloadLabel) downloadLabel.textContent = 'Download PDF';
        if (fullscreenBtn) {
            fullscreenBtn.href = 'assets/resume.html';
            fullscreenBtn.className = 'hidden sm:flex px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 font-sans text-xs font-medium items-center gap-1.5 transition-all cursor-pointer';
        }
    }
};

window.copyPlainResumeText = function() {
    const plainText = `ARJUN R
Front-End Developer | UI Architect | Data Visualization Specialist
Alappuzha, Kerala, India | Email: ajuarjunr@gmail.com | Phone: +91 8921843248
Portfolio: https://arjun-portfolio-03.vercel.app | GitHub: https://github.com/Arjunrajan250

PROFESSIONAL SUMMARY
Front-End Developer & UI Architect with 2+ years of hands-on experience in modern JavaScript, Angular, and React architectures with rich data visualization (amCharts, Three.js, Highcharts, Sigma.js, Chart.js). Experienced in engineering enterprise cybersecurity suites (SIEM, SOAR, UEBA, NDR) and interactive telemetry dashboards. Focused on modular component architecture, UI performance optimization, and reliable end-to-end delivery across high-density web platforms.

TECHNICAL SKILLS
• Front-End: JavaScript (ES6+), TypeScript, Angular, React.js, HTML5, CSS3, Tailwind CSS, Responsive Design
• Data Visualization: Three.js (WebGL), amCharts 5, Highcharts, Sigma.js, Chart.js, D3.js, Leaflet.js
• State & Architecture: RxJS, RESTful APIs, Component-Driven UI, UI Optimization, Micro-Frontend
• Domains: Cybersecurity Operations (SOC), SIEM, SOAR, UEBA, NDR Telemetry, Accessibility
• Tools: Git, GitHub, Webpack, Vite, Node.js, Express.js, Headless Browser Automation, Agile/Scrum

WORK EXPERIENCE

Front-End Developer | Innspark Solutions (CISAI)
June 2024 — Present | Kerala, India
• Front-End Developer working on mission-critical cybersecurity-related projects, including SIEM, SOAR, UEBA, DNS security, and other highly confidential government projects.
• Architected dynamic real-time telemetry dashboards and data visualizations with amCharts, Three.js, Highcharts, Sigma.js, and Chart.js.
• Maintained strict client data security, enterprise privacy boundaries, and confidential compliance protocols.
• Optimized client-side performance and rendering pipelines for high-event-volume streams.

MERN Stack Developer Intern | Techfriar Technologies
July 2023 — January 2024 | Kerala, India
• Developed full-stack web applications using React.js, Node.js, Express REST APIs, and MongoDB.
• Implemented JWT authentication and responsive front-end dashboard interfaces.

KEY PROJECTS
• Enterprise SIEM, SOAR & DNS Security Console: Mission-critical consoles for SOC triage, SIEM alert correlation, SOAR automation, and confidential government projects.
• UEBA & NDR Network Telemetry Systems: Behavioral AI and network analytics dashboards with topological graph network visualizers.
• Cyber Crimes & Threat Intelligence India (IndiaLens): Open cyber defense portal synthesizing crime telemetry, scam kill-chains, and 1930 incident triage.
• Voice Assist AI: Accessibility assistant using deep learning and speech synthesis for visually impaired users.

EDUCATION
• Bachelor of Computer Applications (BCA) — Software Engineering | Amrita AHEAD (2024 — Present, Pursuing alongside full-time work)
• Diploma in Computer Engineering | Carmel Polytechnic College (2021 — 2024, First Class Distinction, Campus Placed at CISAI)

CERTIFICATIONS
• Basics of AI & ML — Lekshmi Infotech
• Fundamentals of Telecommunication — BSNL`;

    navigator.clipboard.writeText(plainText).then(() => {
        try { if (window.CyberAudio) CyberAudio.playChime(); } catch(e) {}
        const label = document.getElementById('modal-copy-plain-label');
        if (label) {
            const orig = label.textContent;
            label.textContent = 'Copied to Clipboard!';
            setTimeout(() => { label.textContent = orig; }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

window.openResumeModal = function(initialView = 'executive') {
    let overlay = document.getElementById('resume-modal-overlay');
    if (!overlay) {
        injectSharedComponents();
        overlay = document.getElementById('resume-modal-overlay');
    }
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (initialView === 'ats') {
            window.switchCvModalTab('ats');
        } else {
            window.switchCvModalTab('executive');
        }
        try { if (window.CyberAudio) CyberAudio.playChime(); } catch(e) {}
    }
};

window.closeResumeModal = function() {
    const overlay = document.getElementById('resume-modal-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        try { if (window.CyberAudio) CyberAudio.playBlip(450, 0.04); } catch(e) {}
    }
};

// --- 7. In-Page Resume PDF Viewer Modal ---
function initResumeModal() {

    document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('#resume-modal-close');
        if (closeBtn) {
            e.preventDefault();
            e.stopPropagation();
            window.closeResumeModal();
            return;
        }

        const overlay = document.getElementById('resume-modal-overlay');
        if (overlay && e.target === overlay) {
            e.preventDefault();
            e.stopPropagation();
            window.closeResumeModal();
            return;
        }

        const atsTrigger = e.target.closest('[data-action="view-ats-resume"]');
        if (atsTrigger) {
            if (atsTrigger.closest('#resume-modal-overlay')) return;
            e.preventDefault();
            e.stopPropagation();
            window.openResumeModal('ats');
            return;
        }

        const trigger = e.target.closest('[data-action="view-resume"], .btn-resume, a[href*="resume"], a[href*="Resume"], a[href*="CV"]');
        if (trigger) {
            if (trigger.closest('#resume-modal-overlay')) return;
            e.preventDefault();
            e.stopPropagation();
            window.openResumeModal('executive');
            return;
        }


        const btnOrLink = e.target.closest('a, button');
        if (btnOrLink && !btnOrLink.closest('#resume-modal-overlay')) {
            const txt = (btnOrLink.textContent || '').trim().toUpperCase();
            if (txt.includes('ATS')) {
                e.preventDefault();
                e.stopPropagation();
                window.openResumeModal('ats');
            } else if (txt.includes('CV') || txt.includes('RESUME')) {
                e.preventDefault();
                e.stopPropagation();
                window.openResumeModal('executive');
            }
        }
    });


    window.addEventListener('keydown', (e) => {
        const overlay = document.getElementById('resume-modal-overlay');
        if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
            window.closeResumeModal();
        }
    });

    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('modal') === 'resume') {
            setTimeout(() => {
                window.openResumeModal(params.get('tab') || 'executive');
            }, 120);
        }
    } catch (e) {}
}

// --- 8. Project Architecture Detail Lightbox Modal ---
const PROJECT_DETAILS = {
    'PixelNest': {
        title: 'PixelNest — Headless Commerce & Admin Portal',
        category: 'E-Commerce Architecture · React 19 · Headless Shopify',
        img: 'assets/images/pixelnest.png',
        desc: 'Ultra-fast headless e-commerce storefront and merchant administration portal engineered with React 19, Tailwind CSS, and the Shopify Storefront GraphQL API. Delivers sub-second transitions, dynamic cart state management, and real-time inventory synchronization.',
        architecture: 'Decoupled headless architecture utilizing GraphQL queries, reactive client caching, and custom component design tokens for seamless checkout integration.',
        badges: ['React 19', 'Shopify Storefront API', 'GraphQL', 'Tailwind CSS', 'Headless Architecture', 'Vite'],
        liveLink: 'https://pixelnest-headless-shopify.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250'
    },
    'Media Extraction Tool': {
        title: 'VortexDL — High-Speed Media Extraction Tool',
        category: 'Node.js Streams · Media Extraction · Express API',
        img: 'assets/images/vortexdl.png',
        desc: 'High-performance media extraction and streaming utility built on Node.js piping architectures. Streams audio/video payloads directly through child processes and client-side download streams with zero server-side disk overhead.',
        architecture: 'Leverages Node.js Stream APIs, child process execution with yt-dlp binary wrappers, and chunked transfer encoding for instant browser downloads.',
        badges: ['Node.js Streams', 'Express API', 'yt-dlp Binary', 'Stream Pipes', 'JavaScript', 'Tailwind CSS'],
        liveLink: 'https://938752.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250'
    },
    'VortexDL': {
        title: 'VortexDL — High-Speed Media Extraction Tool',
        category: 'Node.js Streams · Media Extraction · Express API',
        img: 'assets/images/vortexdl.png',
        desc: 'High-performance media extraction and streaming utility built on Node.js piping architectures. Streams audio/video payloads directly through child processes and client-side download streams with zero server-side disk overhead.',
        architecture: 'Leverages Node.js Stream APIs, child process execution with yt-dlp binary wrappers, and chunked transfer encoding for instant browser downloads.',
        badges: ['Node.js Streams', 'Express API', 'yt-dlp Binary', 'Stream Pipes', 'JavaScript', 'Tailwind CSS'],
        liveLink: 'https://938752.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250'
    },
    'Sadhnam Indo': {
        title: 'Sadhnam Indo — P2P Mutual Aid Platform',
        category: 'Web Platforms · React 19 · Supabase · Leaflet',
        img: 'assets/images/sadhnam_indo.png',
        desc: 'Hyperlocal community mutual aid and emergency logistics platform built with React 19 and Supabase. Features neighborhood geospatial request mapping with Leaflet, client-side AES encrypted messaging, and multilingual accessibility.',
        architecture: 'Real-time PostgreSQL listeners via Supabase, client-side cryptographic hashing for sensitive requests, and custom Leaflet marker clustering for 1000+ local aid pins.',
        badges: ['React 19', 'Supabase', 'Leaflet GIS', 'AES Crypto', 'Tailwind CSS', 'PostgreSQL'],
        liveLink: 'https://sadhnam-indo.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250'
    },
    'ARION': {
        title: 'ARION — Geospatial 3D Tactical Dashboard',
        category: '3D Graphics · WebGL Globe · Web Speech API',
        img: 'assets/images/arion.png',
        desc: 'Interactive 3D geospatial dashboard with WebGL globe rendering, tactical mission waypoint overlays, and real-time voice command recognition powered by the browser Web Speech API.',
        architecture: 'Hardware-accelerated 3D sphere projection using Three.js, event-driven speech grammar recognition for hands-free navigation, and dynamic audio cue generation via Web Audio API.',
        badges: ['WebGL Globe', 'Three.js', 'Web Speech API', 'Web Audio', 'Tailwind CSS', 'PWA'],
        liveLink: 'https://arion-aju.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250'
    },
    'InstantCred': {
        title: 'InstantCred — Card Decision & Comparison Engine',
        category: 'FinTech · Decision Tree · Vite · TypeScript',
        img: 'assets/images/instantcred.png',
        desc: 'A credit-card suitability and decision platform built around personalized fee-vs-reward calculations. Evaluates real-time reward point redemption values, milestone spend criteria, and annual fee amortization for 50+ banking products.',
        architecture: 'High-speed client-side filtering algorithms with TypeScript, Vite, and responsive mobile-first UI with smooth micro-interactions and zero UI lag.',
        badges: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Financial Modeling', 'Affiliate Platform'],
        liveLink: 'https://instant-cred-git-main-arjunrajan250s-projects.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250'
    },
    'Cyber Threat Intelligence': {
        title: 'Cyber Crimes & Threat Intelligence India',
        category: 'Cybersecurity · Data Visualization · React 19',
        img: 'assets/images/cyber_threat_intel.png',
        desc: 'An open defense telemetry platform designed to aggregate nation-wide cybercrime vectors, scam attack kill-chains, and 1930 incident triage into actionable visual intelligence. Features interactive geospatial heatmaps, dynamic timeline telemetry, and instant threat lookups.',
        architecture: 'Engineered with React 19, Leaflet GIS, D3.js and modular Tailwind CSS. Built to ingest and render heavy geospatial datasets with client-side indexing and debounced spatial filters.',
        badges: ['React 19', 'D3.js', 'Leaflet GIS', 'GeoJSON', 'TailwindCSS', 'Threat Telemetry', 'amCharts 5'],
        liveLink: 'https://cyber-crimes-and-threat-intelligence-india.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250'
    },
    'IndiaLens': {
        title: 'IndiaLens — Geospatial Public Data Analytics',
        category: 'Data Visualization · React · Leaflet',
        img: 'assets/images/indialens.png',
        desc: 'Interactive platform for exploring open government datasets across India through choropleth maps and high-performance visual analytics. Enables citizens and analysts to cross-reference multi-year census, demographic, and agricultural telemetry at sub-district resolution.',
        architecture: 'Engineered with Leaflet, GeoJSON, and Highcharts for 60fps canvas/SVG rendering across 700+ districts with zero UI blocking during complex spatial queries.',
        badges: ['React', 'Leaflet', 'GeoJSON', 'Highcharts', 'data.gov.in API', 'Web Workers', 'GIS Analytics'],
        liveLink: 'https://indialens.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250'
    },
    'ThreatLens': {
        title: 'ThreatLens — SOC Security Console',
        category: 'Cybersecurity · Real-Time Telemetry',
        img: 'assets/images/threatlens.png',
        desc: 'High-density security operations center console visualizing alert correlations, SIEM feeds, and anomalous entity behavior in real-time.',
        architecture: 'WebSocket ingestion stream with throttled DOM batch updates and dark-optimized tactical UI.',
        badges: ['React', 'WebSockets', 'D3.js', 'SOC Monitoring', 'SIEM / SOAR'],
        liveLink: 'https://threatlens-jade.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250/ThreatLens'
    },
    'Luxe3D': {
        title: 'Luxe3D Quantum — 3D Product Configurator',
        category: '3D Graphics · WebGL · Three.js',
        img: 'assets/images/luxe3d.png',
        desc: 'Photorealistic WebGL 3D asset configurator enabling real-time material swapping, HDR environment lighting, and interactive camera orbits.',
        architecture: 'Built with Three.js and GLTF pipeline with baked PBR materials for 60fps mobile execution.',
        badges: ['Three.js', 'WebGL', 'GLTF', 'PBR Shaders', '3D Interaction'],
        liveLink: 'https://luxe-3-d.vercel.app/',
        githubLink: 'https://github.com/Arjunrajan250'
    }
};

function initProjectModal() {
    const overlay = document.getElementById('project-modal-overlay');
    const closeBtn = document.getElementById('project-modal-close');
    const modalBody = document.getElementById('project-modal-body');
    if (!overlay || !modalBody) return;

    window.openProjectModalByTitle = function(titleKey) {
        let project = PROJECT_DETAILS[titleKey];
        if (!project) {
            const foundKey = Object.keys(PROJECT_DETAILS).find(k =>
                k.toLowerCase().includes(titleKey.toLowerCase()) || titleKey.toLowerCase().includes(k.toLowerCase())
            );
            if (foundKey) project = PROJECT_DETAILS[foundKey];
        }
        if (!project) {
            project = {
                title: titleKey,
                category: 'Frontend Engineering Case Study',
                img: 'assets/images/cyber_threat_intel.png',
                desc: 'Production application developed by Arjun R with focus on high-performance frontend architecture, responsive design, and intuitive user workflows.',
                architecture: 'Engineered with modern component patterns and clean separation of concerns.',
                badges: ['React', 'TypeScript', 'TailwindCSS', 'Frontend Systems'],
                liveLink: 'https://github.com/Arjunrajan250',
                githubLink: 'https://github.com/Arjunrajan250'
            };
        }

        const liveBtnHtml = project.liveLink ? `
            <a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" class="btn-editorial-primary px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-2 transition-all shadow-sm">
                <span class="material-symbols-outlined text-sm">open_in_new</span>
                <span>Live Project</span>
            </a>
        ` : '';

        const githubBtnHtml = project.githubLink ? `
            <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="btn-editorial-secondary px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-sm">code</span>
                <span>Source Code</span>
            </a>
        ` : '';

        modalBody.innerHTML = `
            <div class="aspect-video w-full rounded-xl overflow-hidden mb-6 border border-zinc-200 dark:border-zinc-800 shadow-xl relative bg-zinc-100 dark:bg-zinc-900">
                <img src="${project.img}" alt="${project.title}" class="w-full h-full object-cover">
            </div>
            <div class="mb-4">
                <p class="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 mb-1 tracking-wider uppercase">${project.category}</p>
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <h2 class="font-headline-lg text-2xl md:text-3xl text-zinc-900 dark:text-zinc-100 font-bold">${project.title}</h2>
                    <div class="flex items-center gap-2">
                        ${liveBtnHtml}
                        ${githubBtnHtml}
                    </div>
                </div>
            </div>
            <p class="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">${project.desc}</p>
            ${project.architecture ? `
                <div class="p-4 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 mb-6">
                    <h4 class="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Architecture & Engineering Decisions</h4>
                    <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">${project.architecture}</p>
                </div>
            ` : ''}
            <div class="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <h4 class="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 mb-3 tracking-wider uppercase">TECH STACK &amp; CAPABILITIES</h4>
                <div class="flex flex-wrap gap-2">
                    ${project.badges.map(b => `<span class="tech-tag">${b}</span>`).join('')}
                </div>
            </div>
        `;

        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        try { if (window.CyberAudio && typeof CyberAudio.playChime === 'function') CyberAudio.playChime(); } catch(e) {}
    };

    const openProjectModalFromCard = (card) => {
        const title = card.querySelector('h3, h4')?.innerText || 'Digital Project Showcase';
        window.openProjectModalByTitle(title);
    };

    document.querySelectorAll('.project-card, .glass-panel:has(h3), .glass-panel:has(h4)').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a') || e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            openProjectModalFromCard(card);
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

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const autoProject = urlParams.get('project');
        if (autoProject) {
            setTimeout(() => {
                window.openProjectModalByTitle(autoProject);
            }, 250);
        }
    } catch(e) {}
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
        const activeBtn = document.querySelector('.apple-segmented-item.active, .filter-btn.active, .filter-btn.bg-indigo-600');
        let activeCategory = 'all';

        if (activeBtn) {
            const btnText = activeBtn.innerText.toUpperCase();
            if (btnText.includes('WEB')) activeCategory = 'web';
            else if (btnText.includes('DATA')) activeCategory = 'data';
            else if (btnText.includes('DASHBOARD')) activeCategory = 'ui';
            else if (btnText.includes('PLUGIN')) activeCategory = 'plugins';
        }

        filterProjectsList(activeCategory, query);
    });

    window.filterProjects = function (category) {
        const buttons = document.querySelectorAll('.apple-segmented-item, .filter-btn');

        buttons.forEach(btn => {
            btn.classList.remove('active', 'bg-indigo-600', 'bg-primary', 'text-white', 'text-on-primary', 'shadow-md');
            btn.classList.add('text-slate-400');
        });

        const activeBtn = Array.from(buttons).find(btn =>
            btn.innerText.toLowerCase().includes(category.toLowerCase()) ||
            (category === 'all' && btn.innerText.includes('ALL'))
        );

        if (activeBtn) {
            activeBtn.classList.remove('text-slate-400');
            activeBtn.classList.add('active');

            const parentControl = activeBtn.closest('.apple-segmented-control');
            if (parentControl) {
                const indicator = parentControl.querySelector('.apple-segmented-indicator');
                if (indicator) {
                    const controlRect = parentControl.getBoundingClientRect();
                    const btnRect = activeBtn.getBoundingClientRect();
                    const left = btnRect.left - controlRect.left - parentControl.clientLeft;
                    indicator.style.transform = `translateX(${left}px)`;
                    indicator.style.width = `${btnRect.width}px`;
                }
            }
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

        const cardCat = card.dataset.category || '';
        const matchesCategory = (category === 'all' || cardCat === category || cardCat.split(' ').includes(category));
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

// --- 11. Animated ScrollSpy & Sticky Floating Glass Navbar ---
function initScrollSpyAndNavbar() {
    const navLinks = document.querySelectorAll('.nav-link[data-nav]');
    const navElement = document.querySelector('nav');
    const sections = document.querySelectorAll('section[id], div[id="about"]');

    if (!navLinks.length) return;

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            const targetSec = document.querySelector(targetId);
            if (targetSec) {
                e.preventDefault();
                targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Sticky Nav Glass backdrop on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navElement?.classList.add('shadow-2xl', 'bg-slate-950/90', 'backdrop-blur-3xl');
        } else {
            navElement?.classList.remove('shadow-2xl', 'bg-slate-950/90');
        }
    });

    // IntersectionObserver ScrollSpy
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.dataset.nav === currentId) {
                        link.classList.remove('text-slate-400');
                        link.classList.add('text-cyan-400', 'border-b-2', 'border-cyan-400', 'pb-1', 'font-semibold');
                    } else {
                        link.classList.remove('text-cyan-400', 'border-b-2', 'border-cyan-400', 'pb-1', 'font-semibold');
                        link.classList.add('text-slate-400');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
}

// --- 11. Apple Design Smooth UI Components ---

function initAppleSegmentedControls() {
    document.querySelectorAll('.apple-segmented-control').forEach(control => {
        let indicator = control.querySelector('.apple-segmented-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'apple-segmented-indicator';
            control.prepend(indicator);
        }

        const updateIndicator = (activeBtn) => {
            if (!activeBtn) return;
            const controlRect = control.getBoundingClientRect();
            const btnRect = activeBtn.getBoundingClientRect();
            const left = btnRect.left - controlRect.left - control.clientLeft;
            const width = btnRect.width;

            indicator.style.transform = `translateX(${left}px)`;
            indicator.style.width = `${width}px`;
        };

        const activeItem = control.querySelector('.apple-segmented-item.active') || control.querySelector('.apple-segmented-item');
        if (activeItem) {
            activeItem.classList.add('active');
            // Allow layout to render before measuring rect
            requestAnimationFrame(() => updateIndicator(activeItem));
        }

        control.querySelectorAll('.apple-segmented-item').forEach(item => {
            item.addEventListener('click', () => {
                control.querySelectorAll('.apple-segmented-item').forEach(btn => btn.classList.remove('active'));
                item.classList.add('active');
                updateIndicator(item);
            });
        });

        window.addEventListener('resize', () => {
            const currentActive = control.querySelector('.apple-segmented-item.active');
            if (currentActive) updateIndicator(currentActive);
        });
    });
}

function initAppleSheetDragDismiss() {
    const modals = document.querySelectorAll('.profile-modal-content, .resume-modal-content, .project-modal-content, .terminal-hud-window');
    modals.forEach(content => {
        if (content.querySelector('.apple-sheet-handle')) return;
        const handle = document.createElement('div');
        handle.className = 'apple-sheet-handle';
        content.prepend(handle);

        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        const onPointerDown = (e) => {
            if (e.target !== handle && !e.target.classList.contains('apple-sheet-handle')) return;
            startY = e.clientY;
            isDragging = true;
            content.style.transition = 'none';
            handle.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            currentY = Math.max(0, e.clientY - startY);
            content.style.transform = `translateY(${currentY}px)`;
            const overlay = content.closest('.profile-modal-overlay, .resume-modal-overlay, .project-modal-overlay, .terminal-hud-overlay');
            if (overlay) {
                const opacity = Math.max(0.2, 1 - currentY / 400);
                overlay.style.opacity = opacity;
            }
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            content.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)';
            const overlay = content.closest('.profile-modal-overlay, .resume-modal-overlay, .project-modal-overlay, .terminal-hud-overlay');

            if (currentY > 120) {
                content.style.transform = `translateY(100vh)`;
                setTimeout(() => {
                    if (overlay) {
                        overlay.classList.remove('open');
                        overlay.style.opacity = '';
                    }
                    content.style.transform = '';
                    document.body.style.overflow = '';
                }, 250);
            } else {
                content.style.transform = '';
                if (overlay) overlay.style.opacity = '';
            }
        };

        handle.addEventListener('pointerdown', onPointerDown);
        handle.addEventListener('pointermove', onPointerMove);
        handle.addEventListener('pointerup', onPointerUp);
        handle.addEventListener('pointercancel', onPointerUp);
    });
}

// --- Live GitHub Commit Counter & Dynamic Rollup ---
function initGitHubCommitCounter() {
    const el = document.getElementById('github-commit-count');
    if (!el) return;

    const initialTarget = parseInt(el.textContent) || 125;
    animateCounterNumber(el, initialTarget);

    fetch('https://api.github.com/users/Arjunrajan250/repos?per_page=100')
        .then(res => res.ok ? res.json() : [])
        .then(async (repos) => {
            if (!Array.isArray(repos) || repos.length === 0) return;
            const fetchPromises = repos.map(repo =>
                fetch(`https://api.github.com/repos/Arjunrajan250/${repo.name}/commits?per_page=100`)
                    .then(res => res.ok ? res.json() : [])
                    .then(commits => Array.isArray(commits) ? commits.length : 0)
                    .catch(() => 0)
            );
            const counts = await Promise.all(fetchPromises);
            const total = counts.reduce((acc, curr) => acc + curr, 0);
            if (total > initialTarget) {
                animateCounterNumber(el, total);
            }
        })
        .catch(err => console.debug('GitHub commit fetch notice:', err));
}

function animateCounterNumber(element, target, customSuffix = null) {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const suffix = customSuffix !== null ? customSuffix : (target > 999 ? '+' : '');

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeProgress * target);
        element.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target + suffix;
        }
    }
    requestAnimationFrame(step);
}
