// Sarthak Sharma Portfolio - Interactive Experience Engine

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavigation();
  initMotionToggle();
  initBackdropCanvas();
  initSignalExplorer();
  initThinkingPath();
  initAccordions();
  initMediaFilters();
  initVideoModal();
  initCaseStudyDrawer();
});

/* -----------------------------------------------------------
   1. Scroll Progress Bar
----------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = window.scrollY / totalHeight;
      progressBar.style.transform = `scaleX(${progress})`;
    }
  }, { passive: true });
}

/* -----------------------------------------------------------
   2. Floating Glass Navigation & Section Spy
----------------------------------------------------------- */
function initNavigation() {
  const nav = document.querySelector('.glass-navigation');
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navDestinations = document.querySelectorAll('.nav-destination');

  if (!nav) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Auto-hide when scrolling down past 160px, reveal when scrolling up
    if (currentScrollY > 180 && currentScrollY > lastScrollY && !navLinks.classList.contains('is-open')) {
      nav.setAttribute('data-hidden', 'true');
    } else {
      nav.setAttribute('data-hidden', 'false');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  // Mobile Menu Toggle
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Intersection Observer for Active Navigation
  const sections = document.querySelectorAll('section[id], main > div[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navDestinations.forEach(dest => {
          const href = dest.getAttribute('href');
          if (href === `#${id}` || href === `/#${id}`) {
            dest.classList.add('active');
          } else {
            dest.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* -----------------------------------------------------------
   3. Motion Preference & Toggle
----------------------------------------------------------- */
function initMotionToggle() {
  const toggleBtn = document.querySelector('.motion-toggle');
  if (!toggleBtn) return;

  const currentMotion = localStorage.getItem('sarthak-motion') || 'on';
  if (currentMotion === 'off') {
    document.documentElement.setAttribute('data-motion', 'off');
    toggleBtn.setAttribute('aria-pressed', 'true');
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      <span>MOTION OFF</span>
    `;
  }

  toggleBtn.addEventListener('click', () => {
    const isMotionOff = document.documentElement.getAttribute('data-motion') === 'off';
    if (isMotionOff) {
      document.documentElement.removeAttribute('data-motion');
      localStorage.setItem('sarthak-motion', 'on');
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
        <span>MOTION ON</span>
      `;
    } else {
      document.documentElement.setAttribute('data-motion', 'off');
      localStorage.setItem('sarthak-motion', 'off');
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span>MOTION OFF</span>
      `;
    }
  });
}

/* -----------------------------------------------------------
   4. Ambient Backdrop Canvas (Geometric Wave Particles)
----------------------------------------------------------- */
function initBackdropCanvas() {
  const canvas = document.getElementById('backdrop-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationId;
  let time = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Subtle ambient floating rings
  function render() {
    if (document.documentElement.getAttribute('data-motion') === 'off') {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    time += 0.008;

    const centerX = width * 0.72;
    const centerY = height * 0.35;
    const baseRadius = Math.min(width, height) * 0.28;

    ctx.lineWidth = 1;

    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      const r = baseRadius + Math.sin(time + i * 1.2) * 20 + i * 40;
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 140, 89, ${0.035 - i * 0.007})`;
      ctx.stroke();
    }

    animationId = requestAnimationFrame(render);
  }

  render();
}

/* -----------------------------------------------------------
   5. Interactive Signal Explorer (Structure / Ripples / Constellation)
----------------------------------------------------------- */
function initSignalExplorer() {
  const containers = document.querySelectorAll('.signal-explorer');
  if (!containers.length) return;

  const perspectives = {
    build: {
      title: "Give an idea structure.",
      desc: "Products and interfaces that connect real needs to working software. Turning complex business logic into clean, intuitive architectures.",
      label: "STRUCTURE",
      linkText: "Explore the products ↗",
      linkUrl: "#work"
    },
    teach: {
      title: "50,000+ learners. One clear idea at a time.",
      desc: "Across classrooms and online courses, I help people move from following code to understanding what they can build.",
      label: "RIPPLES",
      linkText: "See the learning experiences ↗",
      linkUrl: "#content"
    },
    connect: {
      title: "Bridge the space between disciplines.",
      desc: "Connecting product builders, educators, and the communities that bring ideas forward into real-world impact.",
      label: "CONSTELLATION",
      linkText: "Read the story ↗",
      linkUrl: "#about"
    }
  };

  containers.forEach(container => {
    const canvas = container.querySelector('canvas');
    const labelSpan = container.querySelector('.signal-center-label .signal-text-live');
    const storyTitle = container.querySelector('.signal-story h3');
    const storyDesc = container.querySelector('.signal-story p');
    const storyLink = container.querySelector('.signal-story .text-link');
    const buttons = container.querySelectorAll('.signal-options button');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let mode = 'build';
    let time = 0;
    let animId;

    function resize() {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function draw() {
      if (document.documentElement.getAttribute('data-motion') === 'off') {
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 0.015;
      const cx = width / 2;
      const cy = height / 2;

      if (mode === 'build') {
        // Rotating concentric rounded wireframe squares
        ctx.strokeStyle = 'rgba(255, 140, 89, 0.4)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(time * 0.2 * (i % 2 === 0 ? 1 : -1) + i * 0.3);
          const size = i * 28 + Math.sin(time + i) * 8;
          ctx.strokeRect(-size / 2, -size / 2, size, size);
          ctx.restore();
        }
      } else if (mode === 'teach') {
        // Concentric harmonic ripples
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          const r = ((time * 30 + i * 35) % 180) + 10;
          const alpha = Math.max(0, 0.5 - (r / 200));
          ctx.strokeStyle = `rgba(255, 140, 89, ${alpha})`;
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (mode === 'connect') {
        // Connected orbiting nodes constellation
        const nodes = [];
        const count = 7;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + time * 0.4;
          const r = 70 + Math.sin(time * 2 + i) * 20;
          nodes.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
        }

        ctx.strokeStyle = 'rgba(255, 140, 89, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
          }
        }
        ctx.stroke();

        nodes.forEach(node => {
          ctx.fillStyle = '#ff8c59';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');

        const key = btn.dataset.mode || btn.textContent.toLowerCase().trim().replace(/[^a-z]/g, '');
        if (perspectives[key]) {
          mode = key;
          const data = perspectives[key];
          if (labelSpan) labelSpan.textContent = data.label;
          if (storyTitle) storyTitle.textContent = data.title;
          if (storyDesc) storyDesc.textContent = data.desc;
          if (storyLink) {
            storyLink.textContent = data.linkText;
            storyLink.setAttribute('href', data.linkUrl);
          }
        }
      });
    });
  });
}

/* -----------------------------------------------------------
   6. Thinking Path (Expertise Stepper)
----------------------------------------------------------- */
function initThinkingPath() {
  const steps = document.querySelectorAll('.thinking-path li');
  const details = [
    { title: "01 Understand the need", desc: "Identify true user requirements, constraints, and business intent before writing a single line of architecture." },
    { title: "02 Shape the experience", desc: "Craft modular, elegant design systems and interactions that make complex capabilities feel effortless." },
    { title: "03 Build the product", desc: "Engineer resilient, high-performance software with modern standards, thoughtful DX, and reliable delivery." }
  ];

  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });

  if (steps.length > 0) steps[0].classList.add('active');
}

/* -----------------------------------------------------------
   7. Accordions (Expertise Items)
----------------------------------------------------------- */
function initAccordions() {
  const accordionButtons = document.querySelectorAll('.expertise-item h3 button');

  accordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.expertise-item');
      const isExpanded = parent.classList.contains('expanded');

      // Toggle current
      if (isExpanded) {
        parent.classList.remove('expanded');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('svg').innerHTML = '<path d="M5 12h14"></path><path d="M12 5v14"></path>';
      } else {
        parent.classList.add('expanded');
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('svg').innerHTML = '<path d="M5 12h14"></path>';
      }
    });
  });
}

/* -----------------------------------------------------------
   8. Media / Video Filtering
----------------------------------------------------------- */
function initMediaFilters() {
  const filterButtons = document.querySelectorAll('.media-filters button');
  const filmCards = document.querySelectorAll('.film-grid article');
  const countLabel = document.querySelector('.media-controls .eyebrow');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter || 'all';
      let visibleCount = 0;

      filmCards.forEach(card => {
        const channel = card.dataset.channel || 'all';
        if (filter === 'all' || channel === filter) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countLabel) {
        countLabel.textContent = `0${visibleCount} SELECTED FILMS`;
      }
    });
  });
}

/* -----------------------------------------------------------
   9. Interactive Video Modal
----------------------------------------------------------- */
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-modal-iframe');
  const closeBtn = document.getElementById('video-modal-close');
  const playButtons = document.querySelectorAll('.film-play, [data-video-id]');

  if (!modal || !iframe) return;

  function openVideo(videoId) {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    iframe.src = '';
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = btn.dataset.videoId;
      if (videoId) {
        openVideo(videoId);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeVideo);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideo();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeVideo();
    }
  });
}

/* -----------------------------------------------------------
   10. Case Study Drawer Engine
----------------------------------------------------------- */
function initCaseStudyDrawer() {
  const drawer = document.getElementById('case-drawer');
  const closeBtn = document.getElementById('case-drawer-close');
  const drawerContent = document.getElementById('case-drawer-content');
  const triggers = document.querySelectorAll('[data-case-study]');

  if (!drawer || !drawerContent) return;

  const caseStudies = {
    'sheryians-lms': {
      eyebrow: "01 / PRODUCT & ENGINEERING",
      title: "Sheryians Learning Management System",
      lead: "From discovering a course to building capability. Connecting the student journey across learning, progress tracking, and community in one unified platform.",
      role: "Lead Frontend Engineer & Product Contributor",
      timeline: "2021 — Present",
      metrics: "50,000+ Students · Multimillion-dollar Platform Scale",
      body: `
        <h3>The Challenge</h3>
        <p>In 2021, Sheryians needed an end-to-end learning management system capable of handling high-volume online cohort traffic, video streaming with resume-playback, assignments, and automated certification while keeping the UI razor-sharp and intuitive for young engineering students.</p>
        
        <h3>The Solution</h3>
        <p>We designed and engineered a custom platform built around the student's workflow: frictionless checkout, personalized curriculum roadmaps, real-time code sandboxes, and responsive video player environments optimized for both broadband and low-connectivity mobile networks.</p>
        
        <h3>Key Technical Decisions</h3>
        <p>• <strong>Resilient Frontend Architecture:</strong> Modular component design using modern JavaScript, optimized asset delivery, and minimal re-render footprints.<br>
        • <strong>Performance Optimization:</strong> Strategic preload priority, responsive WebP image pipelines, and client-side route caching.<br>
        • <strong>User Centric Design:</strong> Distraction-free lecture theatre layout with timestamped bookmarking and direct mentor chat channels.</p>
      `
    },
    'kodr': {
      eyebrow: "02 / EDUCATION & LEADERSHIP",
      title: "KODR Coding Bootcamp",
      lead: "An intensive immersion program bringing instructors, mentors, and aspiring developers together to convert academic theory into industry capability.",
      role: "Program Lead & Technical Instructor",
      timeline: "2023 — Present",
      metrics: "Hundreds of Career Transitions · 90%+ Placement Rate",
      body: `
        <h3>Bridging the Graduate Skill Gap</h3>
        <p>Traditional university degrees in computer science often leave students unprepared for modern web engineering. KODR was conceived as an intensive, hands-on bootcamp designed to simulate real agile development environments.</p>

        <h3>Curriculum & Delivery</h3>
        <p>Led curriculum design across full-stack JavaScript, React, Node.js, databases, and DevOps practices. Mentored developers through live coding drills, code reviews, and capstone team builds.</p>

        <h3>Impact</h3>
        <p>Contributed to 2.5X offline revenue expansion at Sheryians through high satisfaction rates, peer referrals, and alumni placed at leading tech organizations across India.</p>
      `
    },
    'javascript-god-mode': {
      eyebrow: "03 / TECHNICAL EDUCATION",
      title: "JavaScript: God Mode",
      lead: "An independent YouTube series breaking down the unseen internals of JavaScript into visual, intuitive models.",
      role: "Creator, Scriptwriter, Instructor & Producer",
      timeline: "2023 — Present",
      metrics: "Hundreds of thousands of views · High engagement community",
      body: `
        <h3>Demystifying the Engine</h3>
        <p>Most tutorials teach syntax. 'God Mode' was built to explain the execution context, call stack, closures, prototypal inheritance, and event loop through rigorous visual clarity.</p>

        <h3>Production Philosophy</h3>
        <p>Every diagram is hand-timed; every concept is paired with real production debugging scenarios. The series empowers developers to build intuition rather than memorize solutions.</p>
      `
    },
    'about-story': {
      eyebrow: "THE PERSON BEHIND THE WORK",
      title: "More Than One Lens",
      lead: "An engineer's understanding. An educator's clarity. A builder's sense of ownership.",
      role: "Software Engineer · Technical Educator · Product Leader",
      timeline: "Bhopal, India · 2021 — Today",
      metrics: "50,000+ Students · 50+ Freelance Clients · Multimillion-dollar EdTech",
      body: `
        <h3>My Journey</h3>
        <p>I started working with Sheryians Coding School in October 2021, while pursuing my engineering degree at SIRT Bhopal (affiliated with RGPV). What started with software development and teaching rapidly evolved into product leadership and business growth.</p>

        <h3>The Convergence</h3>
        <p>What sets my perspective apart is the intersection of three disciplines: the technical rigor to architect software, the empathy to teach developers effectively, and the commercial awareness to drive business milestones (such as Sheryians' landmark backing agreement with PhysicsWallah in late 2024).</p>
      `
    }
  };

  function openDrawer(caseId) {
    const data = caseStudies[caseId];
    if (!data) return;

    drawerContent.innerHTML = `
      <button class="drawer-close" id="drawer-close-btn" aria-label="Close drawer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <span class="drawer-eyebrow">${data.eyebrow}</span>
      <h2 class="drawer-title">${data.title}</h2>
      <p class="drawer-lead" style="color: #dedad4; font-size: 17px; line-height: 1.6; margin-bottom: 24px;">${data.lead}</p>
      
      <div class="drawer-meta-grid">
        <div class="drawer-meta-item">
          <span>ROLE / INVOLVEMENT</span>
          <strong>${data.role}</strong>
        </div>
        <div class="drawer-meta-item">
          <span>TIMELINE</span>
          <strong>${data.timeline}</strong>
        </div>
        <div class="drawer-meta-item" style="grid-column: 1 / -1;">
          <span>IMPACT HIGHLIGHT</span>
          <strong style="color: var(--blue);">${data.metrics}</strong>
        </div>
      </div>

      <div class="drawer-body">
        ${data.body}
      </div>

      <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--line); display: flex; gap: 20px;">
        <a href="#contact" class="pill-link" onclick="document.getElementById('case-drawer').classList.remove('is-active'); document.body.style.overflow = '';">
          Start a conversation ↗
        </a>
      </div>
    `;

    drawer.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    document.getElementById('drawer-close-btn').addEventListener('click', closeDrawer);
  }

  function closeDrawer() {
    drawer.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const caseId = trigger.dataset.caseStudy;
      if (caseId) openDrawer(caseId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
      closeDrawer();
    }
  });
}
