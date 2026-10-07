/* Efeitos visuais do site: menu do celular, barra de leitura, banner do
   lançamento, artes das páginas de curso, números que contam, linha do tempo,
   títulos que surgem palavra por palavra e luz nos cards.
   Tudo é decorativo — se o JS falhar ou a pessoa preferir menos movimento,
   o site continua funcionando igual, só sem animação. */
(function () {
  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var finePointer = mq('(hover: hover) and (pointer: fine)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------------------------------------------------------------- topo encolhe ao rolar + barra de leitura
  var header = $('header');
  var bar = $('.scroll-progress span');
  if (!bar) {
    var wrapBar = document.createElement('div');
    wrapBar.className = 'scroll-progress';
    wrapBar.setAttribute('aria-hidden', 'true');
    wrapBar.innerHTML = '<span></span>';
    document.body.insertBefore(wrapBar, document.body.firstChild);
    bar = wrapBar.firstChild;
  }
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    updateTimeline();
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  // ---------------------------------------------------------------- menu do celular
  var nav = $('header nav');
  if (nav) {
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span>';
    var actions = $('.nav-actions', nav);
    (actions || nav).appendChild(toggle);

    var menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Menu');
    var html = '';
    $$('.nav-links a', nav).forEach(function (a) {
      html += '<a class="mm-link" href="' + a.getAttribute('href') + '">' + a.textContent + '</a>';
    });
    html += '<div class="mm-actions">';
    $$('.nav-actions a', nav).forEach(function (a) {
      var ext = a.getAttribute('target') === '_blank' ? ' target="_blank" rel="noopener"' : '';
      var cls = a.classList.contains('btn-cta') ? 'btn btn-cta' : 'btn btn-ghost-light';
      html += '<a class="' + cls + '" href="' + a.getAttribute('href') + '"' + ext + '>' + a.textContent + '</a>';
    });
    html += '</div>';
    menu.innerHTML = html;
    document.body.appendChild(menu);

    var setOpen = function (open) {
      document.documentElement.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    toggle.addEventListener('click', function () { setOpen(!document.documentElement.classList.contains('menu-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  // ---------------------------------------------------------------- botões que abrem o atendimento no WhatsApp
  $$('.js-open-wa').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var t = document.getElementById('waToggle');
      if (t) { e.preventDefault(); t.click(); }
    });
  });

  // ---------------------------------------------------------------- linha do tempo (Como funciona)
  var timeline = $('.timeline');
  var tlNodes = timeline ? $$('.flow-node', timeline) : [];
  function updateTimeline() {
    if (!timeline) return;
    var r = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.8 - r.top) / (r.height + vh * 0.3);
    p = Math.max(0, Math.min(1, p));
    timeline.style.setProperty('--tl', reduce ? 1 : p.toFixed(3));
    tlNodes.forEach(function (n, i) {
      n.classList.toggle('on', reduce || p >= (i / Math.max(1, tlNodes.length - 1)) * 0.92);
    });
  }

  onScroll();

  // ---------------------------------------------------------------- números que contam
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countIo.unobserve(e.target);
        var el = e.target, end = parseInt(el.getAttribute('data-count'), 10) || 0, t0 = null;
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 1400);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        el.textContent = '0';
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIo.observe(el); });
  }

  if (reduce) return;

  // ---------------------------------------------------------------- títulos surgem palavra por palavra
  $$('.sec-head h2').forEach(function (h) {
    var i = 0;
    Array.prototype.slice.call(h.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement('span');
          s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = part;
          frag.appendChild(s);
        });
        h.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        node.classList.add('w'); node.style.setProperty('--i', i++);
      }
    });
  });

  // depois que um bloco termina de aparecer, devolve o movimento normal dele (hover etc.)
  document.addEventListener('transitionend', function (e) {
    var el = e.target;
    if (e.propertyName !== 'opacity' || !el.classList || !el.classList.contains('reveal') || !el.classList.contains('in')) return;
    if (el.classList.contains('sec-head')) return;
    el.classList.remove('reveal', 'in');
    el.style.transitionDelay = '';
  });

  // ---------------------------------------------------------------- arte inclina seguindo o mouse
  function tilt(area, frame) {
    if (!finePointer || !area || !frame) return;
    var clamp = function (v) { return Math.max(-1, Math.min(1, v)); };
    area.addEventListener('mousemove', function (e) {
      var r = frame.getBoundingClientRect();
      var x = clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 1.2));
      var y = clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 1.2));
      frame.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
      frame.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
      frame.style.setProperty('--tx', (x * 10).toFixed(1) + 'px');
      frame.style.setProperty('--ty', (y * 8).toFixed(1) + 'px');
    });
    area.addEventListener('mouseleave', function () {
      frame.style.setProperty('--ry', '0deg');
      frame.style.setProperty('--rx', '0deg');
      frame.style.setProperty('--tx', '0px');
      frame.style.setProperty('--ty', '0px');
    });
  }

  // ---------------------------------------------------------------- faíscas de energia subindo
  function sparks(host, focusEl, density, onTop) {
    if (!host || !window.requestAnimationFrame) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'fx-particles';
    canvas.setAttribute('aria-hidden', 'true');
    if (onTop) { canvas.classList.add('fx-top'); host.appendChild(canvas); }
    else { host.insertBefore(canvas, host.querySelector(':scope > .wrap')); }
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var W = 0, H = 0, dpr = 1, zone = null, parts = [], running = false, visible = true;
    var COLORS = ['255,150,60', '255,184,108', '255,120,30', '255,226,190'];

    function measure() {
      var hr = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hr.width; H = hr.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (focusEl) {
        var fr = focusEl.getBoundingClientRect();
        zone = { x: fr.left - hr.left, y: fr.top - hr.top, w: fr.width, h: fr.height };
      } else {
        zone = { x: 0, y: 0, w: W, h: H };
      }
      var target = Math.min(70, Math.round((zone.w * zone.h) / (density || 9000)));
      while (parts.length < target) parts.push(spawn(true));
      parts.length = target;
    }

    function spawn(anywhere) {
      return {
        x: zone.x + zone.w * (0.1 + Math.random() * 0.8),
        y: anywhere ? zone.y + Math.random() * zone.h : zone.y + zone.h * (0.75 + Math.random() * 0.3),
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.25 + Math.random() * 0.75),
        r: 0.6 + Math.random() * 1.8,
        life: 0,
        max: 160 + Math.random() * 260,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        flick: Math.random() * Math.PI * 2
      };
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.life++;
        p.x += p.vx + Math.sin((p.life + p.flick * 40) / 38) * 0.18;
        p.y += p.vy;
        var t = p.life / p.max;
        if (t >= 1 || p.y < zone.y - 40) { parts[i] = spawn(false); continue; }
        var a = Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.sin(p.life / 6 + p.flick));
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + p.c + ',' + (a * 0.16).toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + p.c + ',' + (a * 0.95).toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    function update() {
      var should = visible && !document.hidden;
      if (should && !running) { running = true; requestAnimationFrame(frame); }
      if (!should) running = false;
    }

    measure();
    var resizeT;
    window.addEventListener('resize', function () { clearTimeout(resizeT); resizeT = setTimeout(measure, 150); });
    setTimeout(measure, 1700); // a arte termina de entrar ~1.5s depois
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; update(); }).observe(host);
    }
    document.addEventListener('visibilitychange', update);
    update();
  }

  var launch = $('.lancamento-hero');
  if (launch) {
    var lFrame = $('.art-frame', launch);
    tilt(launch, lFrame);
    sparks(launch, lFrame, 7000);
  }
  var sales = $('.sales-hero');
  if (sales) {
    var sFrame = $('.art-frame', sales);
    tilt(sales, sFrame);
    sparks(sales, sFrame, 11000, true);
  }
  var feature = $('.feature-card');
  if (feature) tilt(feature, $('.art-frame', feature));
  var finalCard = $('.final-card');
  if (finalCard) tilt(finalCard, $('.art-frame', finalCard));

  // ---------------------------------------------------------------- luz que segue o mouse nos cards
  if (finePointer) {
    $$('.bento-card, .error-card, .testi, .course-card, .compare-col, .course-list li, .prof-fact, .faq-item, .guarantee-banner').forEach(function (el) {
      el.classList.add('fx-spot');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }
})();
