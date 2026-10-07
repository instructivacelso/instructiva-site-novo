/* Atendimento pelo WhatsApp: botão flutuante + janela "Como podemos te ajudar?".
   Fluxo: a pessoa escolhe o motivo.
   - Quero adquirir um treinamento → vai direto pra Dayane (comercial).
   - Problema de acesso → escolhe uma das atendentes do suporte.
   Nas páginas de curso, a mensagem pra Dayane já vai com o nome do curso. */
(function () {
  var overlay = document.getElementById('waPopupOverlay');
  var toggle = document.getElementById('waToggle');
  if (!overlay || !toggle) return;

  var steps = overlay.querySelectorAll('.wa2-step');
  var closeBtn = document.getElementById('waPopupClose');
  var lastFocus = null;

  function wa(phone, msg) {
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  }

  function go(name) {
    Array.prototype.forEach.call(steps, function (s) {
      s.hidden = s.getAttribute('data-step') !== name;
    });
  }

  function open(step) {
    lastFocus = document.activeElement;
    go(step || 'motivo');
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('wa-open');
    setTimeout(function () {
      var first = overlay.querySelector('.wa2-step:not([hidden]) .wa2-option');
      (first || closeBtn).focus();
    }, 60);
  }

  function close() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('wa-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  toggle.addEventListener('click', function () { open(); });
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) { close(); return; }
    var g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.getAttribute('data-go')); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('show')) close();
  });

  // ---------------------------------------------------------------- comercial (Dayane)
  var courseEl = document.querySelector('.course-infobar h2');
  var course = courseEl ? courseEl.textContent.trim() : '';
  var buy = overlay.querySelector('[data-cta="compra"]');
  if (buy) {
    buy.href = wa(buy.getAttribute('data-phone'), course
      ? 'Olá, Dayane! Vim pelo site da Escola Instructiva e tenho interesse no curso "' + course + '". Pode me ajudar com a matrícula?'
      : 'Olá, Dayane! Vim pelo site da Escola Instructiva e quero adquirir um treinamento. Pode me ajudar a escolher e finalizar minha matrícula?');
    buy.addEventListener('click', function () { setTimeout(close, 300); });
  }

  // ---------------------------------------------------------------- suporte (escolhe a atendente)
  var picks = overlay.querySelectorAll('.wa2-pick');
  var support = overlay.querySelector('[data-cta="acesso"]');
  Array.prototype.forEach.call(picks, function (p) {
    p.addEventListener('click', function () {
      Array.prototype.forEach.call(picks, function (o) {
        o.classList.remove('selected');
        o.setAttribute('aria-pressed', 'false');
      });
      p.classList.add('selected');
      p.setAttribute('aria-pressed', 'true');
      var name = p.getAttribute('data-name');
      support.href = wa(p.getAttribute('data-phone'), 'Oi, ' + name + '! Vim pelo site da Escola Instructiva e estou com problema de acesso à plataforma. Pode me ajudar?');
      support.classList.remove('is-disabled');
      support.removeAttribute('aria-disabled');
      var who = support.querySelector('.who');
      if (who) who.textContent = 'Falar com a ' + name;
    });
  });
  if (support) {
    support.addEventListener('click', function (e) {
      if (support.classList.contains('is-disabled')) { e.preventDefault(); return; }
      setTimeout(close, 300);
    });
  }

  // ---------------------------------------------------------------- status do atendimento (horário de Brasília)
  try {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    var wd = '', h = 0;
    parts.forEach(function (p) {
      if (p.type === 'weekday') wd = p.value;
      if (p.type === 'hour') h = parseInt(p.value, 10) % 24;
    });
    var on = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(wd) !== -1 && h >= 8 && h < 18;
    overlay.classList.toggle('is-online', on);
    var st = document.getElementById('waStatus');
    if (st) st.textContent = on ? 'Equipe online agora' : 'Fora do horário · respondemos no próximo atendimento';
  } catch (e) { /* mantém o texto padrão com o horário */ }
})();
