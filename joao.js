
```javascript
/* ==========================================================================
   JOÃO HENRIQUE — PORTFÓLIO · script.js
   JavaScript puro (ES6+), sem dependências.
   --------------------------------------------------------------------------
   01. Helpers
   02. Preloader
   03. Cursor personalizado
   04. Progresso de scroll + header + botão topo
   05. Barra de navegação mobile
   06. Reveal ao rolar (IntersectionObserver)
   07. Contadores
   08. Efeito de digitação (hero)
   09. Barras de habilidade
   10. Filtro de projetos
   11. Inclinação 3D (tilt) + brilho nos cards
   12. Parallax leve do orbe
   13. Partículas em canvas
   14. Formulário de contato (validação)
   15. Ano do rodapé
   ========================================================================== */

(() => {
  'use strict';

  /* ========================================================================
     01. HELPERS
     ======================================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /* ========================================================================
     02. PRELOADER
     ======================================================================== */
  const initPreloader = () => {
    const preloader = $('#preloader');
    const bar = $('#preloaderBar');
    if (!preloader) return;

    let progress = 0;
    const tick = window.setInterval(() => {
      progress = Math.min(progress + Math.random() * 22 + 8, 100);
      if (bar) bar.style.width = `${progress}%`;
      if (progress >= 100) window.clearInterval(tick);
    }, 140);

    const finish = () => {
      if (bar) bar.style.width = '100%';
      window.setTimeout(() => {
        preloader.classList.add('is-hidden');
        document.body.classList.remove('is-locked');
        revealInitial();
      }, 320);
    };

    document.body.classList.add('is-locked');
    window.addEventListener('load', () => window.setTimeout(finish, 380), { once: true });
    // Segurança: nunca travar a página
    window.setTimeout(finish, 3200);
  };

  /* ========================================================================
     03. CURSOR PERSONALIZADO
     ======================================================================== */
  const initCursor = () => {
    const ring = $('#cursor');
    const dot = $('#cursorDot');
    if (!ring || !dot || isTouch) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      ring.classList.add('is-hidden');
      dot.classList.add('is-hidden');
    });
    document.addEventListener('mouseenter', () => {
      ring.classList.remove('is-hidden');
      dot.classList.remove('is-hidden');
    });

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    // Cresce sobre elementos interativos
    const interactive = 'a, button, .filter, input, textarea, .tilt, .card';
    $$(interactive).forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  };

  /* ========================================================================
     04. SCROLL: progresso, header e botão topo
     ======================================================================== */
  const initScrollUI = () => {
    const progress = $('#scrollProgress');
    const header = $('#header');
    const toTop = $('#toTop');

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (progress) progress.style.width = `${ratio}%`;
      if (header) header.classList.toggle('is-scrolled', scrollTop > 24);
      if (toTop) toTop.classList.toggle('is-visible', scrollTop > 520);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
      });
    }
  };

  /* ========================================================================
     05. NAVEGAÇÃO MOBILE + LINK ATIVO
     ======================================================================== */
  const initNav = () => {
    const burger = $('#burger');
    const nav = $('#nav');
    const links = $$('.nav__link');

    const closeNav = () => {
      if (!nav || !burger) return;
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
    };

    if (burger && nav) {
      burger.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('is-locked', open);
      });

      links.forEach((l) => l.addEventListener('click', closeNav));

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 860) closeNav();
      });
    }

    // Link ativo conforme a seção visível
    const sections = $$('section[id]');
    if (!sections.length) return;

    const setActive = (id) => {
      links.forEach((l) => l.classList.toggle('is-active', l.dataset.nav === id));
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((s) => observer.observe(s));
  };

  /* ========================================================================
     06. REVEAL AO ROLAR
     ======================================================================== */
  let revealObserver = null;

  const initReveal = () => {
    const items = $$('.reveal');
    if (!items.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach((el) => revealObserver.observe(el));
  };

  // Revela o que já está na tela assim que o preloader sai
  const revealInitial = () => {
    $$('.hero .reveal').forEach((el) => el.classList.add('is-visible'));
  };

  /* ========================================================================
     07. CONTADORES
     ======================================================================== */
  const initCounters = () => {
    const counters = $$('.counter');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.target || '0', 10);
      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const p = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (prefersReduced || !('IntersectionObserver' in window)) {
      counters.forEach((c) => { c.textContent = c.dataset.target; });
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((c) => obs.observe(c));
  };

  /* ========================================================================
     08. EFEITO DE DIGITAÇÃO
     ======================================================================== */
  const initTyping = () => {
    const el = $('#typing');
    if (!el) return;

    const roles = [
      'Estudante de Desenvolvimento Back-End',
      '2º B · Técnico em TI',
      'Apaixonado por lógica e dados',
      'Construindo o futuro, linha por linha'
    ];

    if (prefersReduced) {
      el.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const loop = () => {
      const current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          window.setTimeout(loop, 1800);
          return;
        }
        window.setTimeout(loop, 62);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          window.setTimeout(loop, 380);
          return;
        }
        window.setTimeout(loop, 28);
      }
    };

    window.setTimeout(loop, 600);
  };

  /* ========================================================================
     09. BARRAS DE HABILIDADE
     ======================================================================== */
  const initSkillBars = () => {
    const fills = $$('.skill__fill');
    if (!fills.length) return;

    const fill = (el) => {
      el.style.width = `${clamp(parseInt(el.dataset.level || '0', 10), 0, 100)}%`;
    };

    if (!('IntersectionObserver' in window)) {
      fills.forEach(fill);
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fill(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    fills.forEach((f) => obs.observe(f));
  };

  /* ========================================================================
     10. FILTRO DE PROJETOS
     ======================================================================== */
  const initFilters = () => {
    const buttons = $$('.filter');
    const projects = $$('.project');
    const empty = $('#projectsEmpty');
    if (!buttons.length || !projects.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', String(active));
        });

        let visible = 0;
        projects.forEach((project) => {
          const match = filter === 'all' || project.dataset.category === filter;
          project.classList.toggle('is-filtered', !match);
          if (match) {
            visible++;
            // reinicia a animação de entrada
            project.classList.remove('is-visible');
            requestAnimationFrame(() => project.classList.add('is-visible'));
          }
        });

        if (empty) empty.hidden = visible > 0;
      });
    });
  };

  /* ========================================================================
     11. TILT 3D + BRILHO NOS CARDS
     ======================================================================== */
  const initTilt = () => {
    if (isTouch || prefersReduced) return;

    $$('.tilt').forEach((card) => {
      const max = 7;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        const rotY = (px - 0.5) * max * 2;
        const rotX = (0.5 - py) * max * 2;

        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-3px)`;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Brilho que segue o mouse nos cards de tecnologia
    $$('.tech-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  };

  /* ========================================================================
     12. PARALLAX LEVE DO ORBE
     ======================================================================== */
  const initParallax = () => {
    if (isTouch || prefersReduced) return;
    const targets = $$('[data-parallax]');
    if (!targets.length) return;

    let raf = null;
    window.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        targets.forEach((el) => {
          const strength = parseFloat(el.dataset.parallax || '0.03');
          const dx = (e.clientX - cx) * strength;
          const dy = (e.clientY - cy) * strength;
          el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        });
        raf = null;
      });
    }, { passive: true });
  };

  /* ========================================================================
     13. PARTÍCULAS EM CANVAS
     ======================================================================== */
  const initParticles = () => {
    const canvas = $('#particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationId = null;
    const pointer = { x: -9999, y: -9999 };
    const LINK_DIST = 132;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const build = () => {
      const isSmall = width < 720;
      const count = isSmall ? 26 : Math.min(Math.round((width * height) / 16000), 88);

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.7 + 0.7,
        cyan: Math.random() > 0.32
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Linhas de conexão
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.26;
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Conexão com o ponteiro
        const pdx = a.x - pointer.x;
        const pdy = a.y - pointer.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist < 168) {
          const alpha = (1 - pdist / 168) * 0.42;
          ctx.strokeStyle = `rgba(123, 47, 255, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      // Partículas
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan ? 'rgba(0, 229, 255, 0.85)' : 'rgba(123, 47, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.cyan ? 'rgba(0, 229, 255, 0.8)' : 'rgba(123, 47, 255, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (animationId === null) draw();
    };
    const stop = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseout', () => {
      pointer.x = -9999;
      pointer.y = -9999;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    resize();

    if (prefersReduced) {
      // Desenha apenas um frame estático
      draw();
      stop();
    } else {
      start();
    }
  };

  /* ========================================================================
     14. FORMULÁRIO DE CONTATO
     ======================================================================== */
  const initForm = () => {
    const form = $('#contactForm');
    if (!form) return;

    const status = $('#formStatus');
    const submit = $('#submitBtn');
    const fields = {
      name: { el: $('#name'), min: 2, message: 'Digite seu nome (mín. 2 caracteres).' },
      email: { el: $('#email'), message: 'Informe um e-mail válido.' },
      subject: { el: $('#subject'), min: 3, message: 'Digite um assunto (mín. 3 caracteres).' },
      message: { el: $('#message'), min: 10, message: 'Escreva uma mensagem com pelo menos 10 caracteres.' }
    };

    const emailRe = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    const setError = (key, message) => {
      const field = fields[key].el;
      if (!field) return;
      const wrapper = field.closest('.field');
      const errorEl = wrapper ? $('[data-error-for]', wrapper) : null;

      if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
    };

    const validateField = (key) => {
      const cfg = fields[key];
      if (!cfg || !cfg.el) return true;
      const value = cfg.el.value.trim();

      if (!value) {
        setError(key, 'Este campo é obrigatório.');
        return false;
      }
      if (key === 'email' && !emailRe.test(value)) {
        setError(key, cfg.message);
        return false;
      }
      if (cfg.min && value.length < cfg.min) {
        setError(key, cfg.message);
        return false;
      }
      setError(key, '');
      return true;
    };

    const showStatus = (text, isError = false) => {
      if (!status) return;
      status.textContent = text;
      status.classList.add('is-visible');
      status.classList.toggle('is-error', isError);
    };

    // Validação em tempo real após o primeiro erro
    Object.keys(fields).forEach((key) => {
      const el = fields[key].el;
      if (!el) return;
      el.addEventListener('blur', () => validateField(key));
      el.addEventListener('input', () => {
        const wrapper = el.closest('.field');
        if (wrapper && wrapper.classList.contains('has-error')) validateField(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const results = Object.keys(fields).map(validateField);
      const valid = results.every(Boolean);

      if (!valid) {
        showStatus('Verifique os campos destacados antes de enviar.', true);
        const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Envio simulado (front-end puro) — conecte a um serviço real se desejar
      if (submit) {
        submit.classList.add('is-loading');
        const label = $('.btn__label', submit);
        if (label) label.textContent = 'Enviando...';
      }
      showStatus('Estabelecendo conexão...', false);

      window.setTimeout(() => {
        if (submit) {
          submit.classList.remove('is-loading');
          const label = $('.btn__label', submit);
          if (label) label.textContent = 'Enviar mensagem';
        }
        showStatus(`Mensagem recebida, ${form.name.value.trim().split(' ')[0]}! Retorno em breve.`, false);
        form.reset();
        Object.keys(fields).forEach((key) => setError(key, ''));
        window.setTimeout(() => status && status.classList.remove('is-visible'), 6000);
      }, 1300);
    });
  };

  /* ========================================================================
     15. ANO DO RODAPÉ
     ======================================================================== */
  const initYear = () => {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  };

  /* ========================================================================
     BOOT
     ======================================================================== */
  const boot = () => {
    initPreloader();
    initCursor();
    initScrollUI();
    initNav();
    initReveal();
    initCounters();
    initTyping();
    initSkillBars();
    initFilters();
    initTilt();
    initParallax();
    initParticles();
    initForm();
    initYear();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
```