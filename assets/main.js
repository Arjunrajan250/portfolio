/* Main JS logic for Arjun R's Portfolio */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Particle Background Canvas
    initParticleCanvas();

    // 1. Initialize Interactive Card Glow Effects & 3D Tilt
    initInteractiveGlows();
    init3DTilt();

    // 2. Inject Shared Components (Drawer, Terminal HUD, Profile Modal, Resume Modal, Project Lightbox Modal, Audio Controls, Apple Dynamic Island)
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
    initScrollSpyAndNavbar();
    initGitHubCommitCounter();

    // 4. Apple Design Smooth UI Components
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

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.8 + 0.8,
            color: Math.random() > 0.5 ? 'rgba(148, 163, 184, ' : 'rgba(56, 189, 248, '
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
                            <div class="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                                <span class="material-symbols-outlined text-cyan-400 text-sm">description</span>
                            </div>
                            <div>
                                <h3 class="font-headline-md text-base md:text-lg text-on-surface font-bold">Curriculum Vitae — Arjun R</h3>
                                <p class="font-code-sm text-xs text-slate-400" id="cv-modal-subtitle">Official Verification Document • Executive View</p>
                            </div>
                        </div>

                        <!-- Segmented Switcher Tabs (Executive vs ATS) -->
                        <div class="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
                            <div class="flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/10 gap-1 text-xs font-mono">
                                <button type="button" id="tab-cv-executive" onclick="switchCvModalTab('executive')" class="cv-tab-btn active px-3 py-1.5 rounded-lg border border-transparent font-semibold flex items-center gap-1.5 cursor-pointer text-slate-300">
                                    <span class="material-symbols-outlined text-xs">tune</span>
                                    <span>Executive</span>
                                </button>
                                <button type="button" id="tab-cv-ats" onclick="switchCvModalTab('ats')" class="cv-tab-btn px-3 py-1.5 rounded-lg border border-transparent font-semibold flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white">
                                    <span class="material-symbols-outlined text-xs text-emerald-400">verified</span>
                                    <span class="text-emerald-400">ATS-Friendly</span>
                                </button>
                            </div>

                            <div class="flex items-center gap-1.5">
                                <a id="cv-btn-download" href="assets/resume.pdf" download="Arjun_R_Resume.pdf" class="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer" title="Download Resume PDF">
                                    <span class="material-symbols-outlined text-sm">download</span>
                                    <span id="cv-download-label">PDF</span>
                                </a>
                                <a id="cv-btn-fullscreen" href="assets/resume.html" target="_blank" class="hidden sm:flex px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer" title="Open Fullscreen Resume">
                                    <span class="material-symbols-outlined text-sm">open_in_new</span>
                                    <span>Fullscreen</span>
                                </a>
                                <button id="resume-modal-close" onclick="closeResumeModal()" class="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-white/20 text-on-surface flex items-center justify-center transition-colors cursor-pointer" aria-label="Close CV Modal">
                                    <span class="material-symbols-outlined text-xl">close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="flex-grow w-full rounded-xl overflow-y-auto bg-[#070a13] border border-white/10 relative p-4 md:p-6 text-slate-200 font-sans text-xs custom-scrollbar">
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
                                Front-End Developer &amp; UI Architect with <strong class="text-white">2+ years of hands-on experience</strong> in modern JavaScript, Angular, and React architectures with rich data visualization (amCharts, Three.js, Highcharts, Sigma.js, Chart.js). Experienced in engineering enterprise cybersecurity suites (SIEM, SOAR, UEBA, NDR) and interactive telemetry dashboards. Expert in AI-integrated rapid development workflows with strict data integrity, zero data-leakage security posture, and fast adaptability to build full-lifecycle websites, apps, and software systems.
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
                                    <p class="text-slate-200">Angular, JavaScript, React, and other libraries and frameworks</p>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-white/5">
                                    <span class="text-cyan-400 block mb-1 font-bold">DATA VIZ &amp; GRAPHICS</span>
                                    <p class="text-slate-200">Three.js, amCharts, Highcharts, Sigma.js, Chart.js, etc.</p>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-white/5">
                                    <span class="text-violet-400 block mb-1 font-bold">UI &amp; STYLING</span>
                                    <p class="text-slate-200">Tailwind CSS, Material Design 3, Glassmorphism, Micro-Animations, Responsive UX</p>
                                </div>
                                <div class="p-2.5 bg-slate-950/80 rounded-lg border border-white/5">
                                    <span class="text-emerald-400 block mb-1 font-bold">AI WORKFLOWS &amp; TOOLING</span>
                                    <p class="text-slate-200">Privacy-First AI Integration, REST APIs, Git, Webpack, Vite, Node.js</p>
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
                                        <h3 class="text-white font-semibold text-xs">Front-End Developer — Innspark Solutions</h3>
                                        <span class="font-mono text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">JUNE 2024 — PRESENT</span>
                                    </div>
                                    <ul class="text-slate-300 text-[11px] mt-1 space-y-1 list-disc list-inside leading-relaxed">
                                        <li>Front-End Developer working on mission-critical cybersecurity-related projects, including SIEM, SOAR, UEBA, DNS security, and other highly confidential government projects.</li>
                                        <li>Architected dynamic real-time telemetry dashboards and data visualizations with amCharts, Three.js, Highcharts, Sigma.js, and Chart.js.</li>
                                        <li>Enforced strict zero data-leakage standards, enterprise privacy boundaries, and confidential security protocols across all deliverables.</li>
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
                                            <span class="text-emerald-400 font-bold">AI-Integrated Web Applications</span>
                                            <span class="text-[9px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">AI DEVELOPMENT</span>
                                        </div>
                                        <p class="text-slate-300 text-[10px] leading-tight font-sans">High-velocity front-end applications built utilizing AI-integrated development workflows &amp; modern tooling.</p>
                                    </div>
                                    <span class="text-[10px] text-slate-400 mt-2 font-mono">AI-Driven Architecture &amp; Rapid Delivery</span>
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
                                            <span class="text-cyan-400 font-bold text-xs">AI Dev &amp; Data Integrity</span>
                                            <span class="text-[9px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30">ZERO LEAKAGE</span>
                                        </div>
                                        <p class="text-slate-300 text-[10.5px] leading-relaxed mb-2">Leveraging advanced AI workflows for rapid engineering velocity while strictly adhering to corporate data privacy boundaries, code cleanliness, and security integrity.</p>
                                    </div>
                                    <span class="text-[9.5px] text-cyan-400/80 font-mono">High-Productivity AI Workflows &bull; Safe Prompting</span>
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
                                            <span class="text-emerald-400 font-bold text-xs">Rapid Tech Stack Adaptability</span>
                                            <span class="text-[9px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">FAST LEARNER</span>
                                        </div>
                                        <p class="text-slate-300 text-[10.5px] leading-relaxed mb-2">Fast-learning agility to master new frameworks and libraries with minimal turnaround time to design, build, and deploy full-lifecycle websites, apps, and software systems.</p>
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
                            <!-- ATS Action Bar within pane -->
                            <div class="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2.5">
                                <div class="flex items-center gap-2">
                                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <div>
                                        <div class="font-mono text-xs text-emerald-300 font-bold">ATS Optimized &bull; 99% Parser Score</div>
                                        <div class="text-[10.5px] text-slate-300">Clean single-column structure &bull; Zero graphics interference &bull; Standard keywords</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button type="button" onclick="copyPlainResumeText()" id="modal-copy-plain-btn" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                                        <span class="material-symbols-outlined text-sm">content_copy</span>
                                        <span id="modal-copy-plain-label">Copy Plain Text</span>
                                    </button>
                                    <a href="assets/resume-ats.pdf" download="Arjun_R_Resume_ATS.pdf" class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md">
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
                                        Front-End Developer and UI Architect with <strong>2+ years of professional experience</strong> engineering modern JavaScript, Angular, and React applications with high-density data visualizations (amCharts, Three.js, Highcharts, Sigma.js, Chart.js). Proven track record developing enterprise cybersecurity suites (SIEM, SOAR, UEBA, NDR) and telemetry dashboards. Expert in AI-assisted rapid development workflows with zero data-leakage posture and fast adaptability to build full-lifecycle websites, apps, and software systems.
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
                                        <div><strong class="text-slate-950">Tooling &amp; AI:</strong> Git, GitHub, Vite, Webpack, Node.js, Express.js, Headless Automation, AI-Integrated Engineering Workflows.</div>
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
                                        <div class="text-[10.5px] font-semibold text-slate-700 mb-1">Innspark Solutions &bull; Kerala, India (Full-Time)</div>
                                        <ul class="list-disc list-outside ml-4 text-[10.5px] text-slate-700 space-y-0.5">
                                            <li>Front-End Developer working on mission-critical cybersecurity-related projects, including SIEM, SOAR, UEBA, DNS security, and other highly confidential government projects.</li>
                                            <li>Architected dynamic real-time telemetry dashboards and data visualizations with amCharts, Three.js, Highcharts, Sigma.js, and Chart.js.</li>
                                            <li>Enforced strict zero data-leakage standards, enterprise privacy boundaries, and confidential security protocols across all deliverables.</li>
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
        emptyEl.innerHTML = `<span class="text-accent font-semibold">guest@arjunr:~$</span>`;
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
    queryEl.innerHTML = `<span class="text-accent font-semibold">guest@arjunr:~$</span> <span>${escapeHtml(trimmedInput)}</span>`;
    bodyEl.appendChild(queryEl);

    let cmd = primaryCmd;
    if (['about', 'profile', 'bio', 'developer', 'who'].includes(cmd) || rawInput === 'whoami') cmd = 'about';
    else if (['skills', 'skill', 'matrix', 'stack', 'tech', 'metrics'].includes(cmd) || rawInput.includes('metrics') || rawInput.includes('matrix')) cmd = 'skills';
    else if (['experience', 'career', 'summary', 'logs', 'timeline', 'work', 'history'].includes(cmd) || rawInput.includes('logs')) cmd = 'experience';
    else if (['projects', 'output', 'outputs', 'portfolio', 'apps', 'highlight'].includes(cmd) || rawInput.includes('output')) cmd = 'projects';
    else if (['contact', 'handles', 'dispatch', 'email', 'socials', 'github', 'reach'].includes(cmd) || rawInput.includes('socials')) cmd = 'contact';
    else if (['cv', 'resume', 'pdf'].includes(cmd) || rawInput.includes('cv') || rawInput.includes('resume')) cmd = 'cv';
    else if (['theme', 'colors', 'color', 'styling'].includes(cmd) || rawInput.includes('styling')) cmd = 'theme';
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
<div class="mt-1 text-accent font-bold">=== ARJUN-TERMINAL COMMAND DIRECTORY ===</div>
<div class="mt-2 space-y-1.5 ml-1 font-mono text-xs md:text-sm">
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[about / whoami]</span><span class="text-slate-300">Developer profile & academic summary</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[skills / stack]</span><span class="text-slate-300">Technical matrix & framework proficiencies</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[experience]</span><span class="text-slate-300">Career journey & engineering roles</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[projects]</span><span class="text-slate-300">Digital architecture showreel & outputs</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[contact / email]</span><span class="text-slate-300">Direct email & social handles</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[cv / resume]</span><span class="text-slate-300">Open full Curriculum Vitae modal</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[ls / cat &lt;file&gt;]</span><span class="text-slate-300">List and view virtual file system</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[neofetch / specs]</span><span class="text-slate-300">Display system telemetry specs</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[theme &lt;col&gt;]</span><span class="text-slate-300">Set theme (cyan/green/amber/purple/steel)</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[clear / cls]</span><span class="text-slate-300">Clear CLI console window</span></div>
  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span class="text-accent font-bold w-36 shrink-0">[exit / quit]</span><span class="text-slate-300">Close terminal window</span></div>
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
  <div>3. <span class="text-accent font-semibold">Sadhnam Indo P2P</span> &mdash; React 19 & Supabase</div>
  <div>4. <span class="text-accent font-semibold">ThreatLens Cyber Console</span> &mdash; D3.js v7 OSINT</div>
  <div>5. <span class="text-accent font-semibold">ARION C4ISR Suite</span> &mdash; Real-Time Data & Voice AI</div>
  <div>6. <span class="text-accent font-semibold">Luxe3D Quantum One Showcase</span> &mdash; Three.js WebGL 3D</div>
  <div>7. <span class="text-accent font-semibold">SVG Convert</span> &mdash; Figma Plugin API</div>
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
                output = `<div class="mt-1">IndiaLens, Cyber Crimes & Threat Intelligence India, Sadhnam Indo, ThreatLens, ARION C4ISR, Luxe3D Quantum, SVG Convert</div>`;
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
  OS: CyberOS 4.5.0-generic x86_64<br>
  Host: Arjun R Portfolio V4<br>
  Kernel: WebAPI / HTML5 / JS ES2024<br>
  Uptime: 99.99% active<br>
  Shell: zsh / arjun-cyber-cli v4.5<br>
  Resolution: Responsive Fluid Layout<br>
  Terminal: HUD Overlay Component
</div>
            `;
            break;
        case 'sudo':
            output = `<div class="mt-1 text-red-400">[ACCESS DENIED] User 'guest' is not in the sudoers file. Incident reported to Arjun R.</div>`;
            break;
        case 'ping':
            output = `<div class="mt-1 text-emerald-400">PING api.arjunr.dev (127.0.0.1): 56 data bytes. 64 bytes: icmp_seq=0 ttl=64 time=0.42 ms</div>`;
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
        execTab.classList.remove('text-slate-300');
        
        atsTab.classList.add('active');
        atsTab.classList.remove('text-slate-400');

        execPane.classList.remove('active');
        atsPane.classList.add('active');

        if (subtitle) subtitle.textContent = 'Official Verification Document • ATS-Friendly Machine-Readable View';
        if (downloadBtn) {
            downloadBtn.href = 'assets/resume-ats.pdf';
            downloadBtn.download = 'Arjun_R_Resume_ATS.pdf';
            downloadBtn.className = 'px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer';
        }
        if (downloadLabel) downloadLabel.textContent = 'ATS PDF';
        if (fullscreenBtn) {
            fullscreenBtn.href = 'assets/resume-ats.html';
            fullscreenBtn.className = 'hidden sm:flex px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer';
        }
    } else {
        atsTab.classList.remove('active');
        atsTab.classList.add('text-slate-400');

        execTab.classList.add('active');
        execTab.classList.remove('text-slate-400');
        execTab.classList.add('text-slate-300');

        atsPane.classList.remove('active');
        execPane.classList.add('active');

        if (subtitle) subtitle.textContent = 'Official Verification Document • Executive View';
        if (downloadBtn) {
            downloadBtn.href = 'assets/resume.pdf';
            downloadBtn.download = 'Arjun_R_Resume.pdf';
            downloadBtn.className = 'px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer';
        }
        if (downloadLabel) downloadLabel.textContent = 'PDF';
        if (fullscreenBtn) {
            fullscreenBtn.href = 'assets/resume.html';
            fullscreenBtn.className = 'hidden sm:flex px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer';
        }
    }
};

window.copyPlainResumeText = function() {
    const plainText = `ARJUN R
Front-End Developer | UI Architect | Data Visualization Specialist
Alappuzha, Kerala, India | Email: ajuarjunr@gmail.com | Phone: +91 8921843248
Portfolio: https://arjun-portfolio-03.vercel.app | GitHub: https://github.com/Arjunrajan250

PROFESSIONAL SUMMARY
Front-End Developer & UI Architect with 2+ years of hands-on experience in modern JavaScript, Angular, and React architectures with rich data visualization (amCharts, Three.js, Highcharts, Sigma.js, Chart.js). Experienced in engineering enterprise cybersecurity suites (SIEM, SOAR, UEBA, NDR) and interactive telemetry dashboards. Expert in AI-integrated rapid development workflows with strict data integrity, zero data-leakage security posture, and fast adaptability to build full-lifecycle websites, apps, and software systems.

TECHNICAL SKILLS
• Front-End: JavaScript (ES6+), TypeScript, Angular, React.js, HTML5, CSS3, Tailwind CSS, Responsive Design
• Data Visualization: Three.js (WebGL), amCharts 5, Highcharts, Sigma.js, Chart.js, D3.js, Leaflet.js
• State & Architecture: RxJS, RESTful APIs, Component-Driven UI, UI Optimization, Micro-Frontend
• Domains: Cybersecurity Operations (SOC), SIEM, SOAR, UEBA, NDR Telemetry, Accessibility
• Tools: Git, GitHub, Webpack, Vite, Node.js, Express.js, Headless Browser Automation, Agile/Scrum

WORK EXPERIENCE

Front-End Developer | Innspark Solutions
June 2024 — Present | Kerala, India
• Front-End Developer working on mission-critical cybersecurity-related projects, including SIEM, SOAR, UEBA, DNS security, and other highly confidential government projects.
• Architected dynamic real-time telemetry dashboards and data visualizations with amCharts, Three.js, Highcharts, Sigma.js, and Chart.js.
• Enforced strict zero data-leakage standards, enterprise privacy boundaries, and confidential security protocols.
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
                <h4 class="font-label-caps text-xs text-cyan-400 mb-3 tracking-wider">TECHNOLOGY STACK &amp; HIGHLIGHTS</h4>
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
