/* Efeitos visuais do site: banner do lançamento, artes das páginas de curso,
   números que contam, luz nos cards e topo que encolhe ao rolar.
   Tudo é decorativo — se o JS falhar ou a pessoa preferir menos movimento,
   o site continua igual, só sem animação. */
(function () {
  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var finePointer = mq('(hover: hover) and (pointer: fine)');

  // ---------------------------------------------------------------- topo encolhe ao rolar
  var header = document.querySelector('header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------------------------------------------------------------- números que contam (faixa de números)
  var counters = document.querySelectorAll('[data-count]');
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
    // a arte termina de entrar ~1.5s depois: mede de novo pra mirar certo
    setTimeout(measure, 1700);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; update(); }).observe(host);
    }
    document.addEventListener('visibilitychange', update);
    update();
  }

  var launch = document.querySelector('.lancamento-hero');
  if (launch) {
    var lFrame = launch.querySelector('.art-frame');
    tilt(launch, lFrame);
    sparks(launch, lFrame, 7000);
  }
  var sales = document.querySelector('.sales-hero');
  if (sales) {
    var sFrame = sales.querySelector('.art-frame');
    tilt(sales, sFrame);
    sparks(sales, sFrame, 11000, true);
  }

  // ---------------------------------------------------------------- luz que segue o mouse nos cards
  if (finePointer) {
    var cards = document.querySelectorAll('.value-card, .flow-node, .error-card, .testi, .course-card, .compare-col, .offer-card, .course-list li');
    Array.prototype.forEach.call(cards, function (el) {
      el.classList.add('fx-spot');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }
})();
