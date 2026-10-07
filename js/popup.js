/* =======================================================================
   POPUP DE CAPTURA ("Não sabe qual curso escolher?")
   Aparece uma vez por sessão: depois de 30s na página, quando o mouse sai
   pelo topo (computador) ou quando a pessoa troca de aba (celular).
   Os textos, o número do WhatsApp e o liga/desliga vêm do painel (/api/config).
   Teste: abra qualquer página com ?popup=teste no fim do endereço.
   ======================================================================= */
(function () {
  var STORAGE_KEY = 'instructiva_exit_popup_shown';
  var ARM_DELAY_MS = 6000;
  var armed = false;
  var shown = false;
  var POPUP_CFG = null;

  // caminho das imagens funciona tanto na raiz quanto em /cursos/
  var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
  function asset(p) {
    try { return new URL('../' + p, SCRIPT_SRC).href; } catch (e) { return p; }
  }

  function alreadyShownThisSession() {
    try { return sessionStorage.getItem(STORAGE_KEY) === '1'; }
    catch (e) { return false; }
  }
  function markShown() {
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
  }
  function esc(s) {
    return (s == null ? '' : String(s)).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function isOnline() {
    try {
      var wd = '', h = 0;
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (p) {
          if (p.type === 'weekday') wd = p.value;
          if (p.type === 'hour') h = parseInt(p.value, 10) % 24;
        });
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(wd) !== -1 && h >= 8 && h < 18;
    } catch (e) { return false; }
  }

  var WA_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.06L2 22l5.06-1.35A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>';
  var ICON_USER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>';
  var ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18h2"/></svg>';
  var ICON_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  function buildPopup() {
    var cfg = POPUP_CFG || {};
    var badge = cfg.badge || 'Atendimento no WhatsApp · grátis';
    var titleRaw = cfg.title || 'Não sabe qual curso escolher?';
    var hl = cfg.highlight || '';
    var titleHtml = esc(titleRaw);
    if (hl && titleRaw.indexOf(hl) !== -1) titleHtml = titleHtml.replace(esc(hl), '<span>' + esc(hl) + '</span>');
    var sub = cfg.sub || 'Deixe seu WhatsApp que um especialista da Instructiva te ajuda a escolher o curso certo pra você — sem compromisso.';
    var ctaText = cfg.ctaText || 'Falar com um especialista';
    var online = isOnline();

    var overlay = document.createElement('div');
    overlay.className = 'exit-popup-overlay' + (online ? ' is-online' : '');
    overlay.id = 'exitPopupOverlay';
    overlay.innerHTML =
      '<div class="exit-popup ep2" role="dialog" aria-modal="true" aria-labelledby="exitPopupTitle">' +
        '<button class="exit-popup-close" id="exitPopupClose" aria-label="Fechar">&times;</button>' +
        '<aside class="ep2-side" aria-hidden="true">' +
          '<div class="ep2-agent">' +
            '<span class="ep2-avatar"><img src="' + asset('assets/img/team/dayane.jpg') + '" alt="" width="56" height="56"><i></i></span>' +
            '<div><strong>Dayane</strong><span>' + (online ? 'Online agora' : 'Escola Instructiva') + '</span></div>' +
          '</div>' +
          '<div class="ep2-chat">' +
            '<div class="ep2-typing"><span></span><span></span><span></span></div>' +
            '<div class="ep2-bubble b1">Oi! Tá em dúvida sobre qual curso fazer?</div>' +
            '<div class="ep2-bubble b2">Me deixa seu WhatsApp que eu te ajudo a escolher o certo pro seu nível.</div>' +
          '</div>' +
          '<ul class="ep2-perks">' +
            '<li>Indicação do curso certo pra você</li>' +
            '<li>Sem compromisso</li>' +
            '<li>Seg a sex, das 8h às 18h</li>' +
          '</ul>' +
        '</aside>' +
        '<div class="ep2-main">' +
          '<div class="form-body" id="exitPopupForm">' +
            '<div class="ep-badge">' + esc(badge) + '</div>' +
            '<h3 id="exitPopupTitle">' + titleHtml + '</h3>' +
            '<p class="sub">' + esc(sub) + '</p>' +
            '<label class="ep2-field"><span class="ep2-ico">' + ICON_USER + '</span>' +
              '<input type="text" id="epName" autocomplete="name" placeholder=" "><span class="ep2-float">Seu nome</span></label>' +
            '<label class="ep2-field"><span class="ep2-ico">' + ICON_PHONE + '</span>' +
              '<input type="tel" id="epPhone" autocomplete="tel" inputmode="numeric" placeholder=" " maxlength="16"><span class="ep2-float">WhatsApp com DDD</span></label>' +
            '<div class="ep-quick">' +
              '<span class="ep-quick-label">Você já é técnico?</span>' +
              '<div class="ep2-seg" id="epTechRow" role="radiogroup">' +
                '<button type="button" class="radio-opt" role="radio" aria-checked="false" data-value="sim">Já sou</button>' +
                '<button type="button" class="radio-opt" role="radio" aria-checked="false" data-value="nao">Tô começando</button>' +
              '</div>' +
            '</div>' +
            '<p class="error-msg" id="epError" role="alert"></p>' +
            '<button class="submit-btn" id="epSubmit">' + WA_ICON + '<span>' + esc(ctaText) + '</span></button>' +
            '<p class="fine-print">' + ICON_LOCK + 'Seus dados ficam protegidos · sem spam</p>' +
          '</div>' +
          '<div class="success-state" id="exitPopupSuccess">' +
            '<div class="ep2-check"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27.5l7 7 15-16"/></svg></div>' +
            '<h3>Recebemos seu contato!</h3>' +
            '<p>Toque no botão pra falar agora com a nossa equipe no WhatsApp.</p>' +
            '<a class="ep-wa-btn" id="epWaBtn" href="#" target="_blank" rel="noopener">' + WA_ICON + 'Abrir meu WhatsApp</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  // confete laranja ao concluir (decorativo)
  function confetti(host) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = document.createElement('canvas');
    c.className = 'ep2-confetti';
    host.appendChild(c);
    var r = host.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = r.width * dpr; c.height = r.height * dpr;
    var ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    var colors = ['#FF7A18', '#FFB774', '#F97316', '#25D366', '#FFFFFF'];
    var ps = [];
    for (var i = 0; i < 90; i++) {
      ps.push({ x: r.width / 2, y: r.height * 0.32, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 9 - 3,
        s: 4 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[i % colors.length] });
    }
    var t = 0;
    (function frame() {
      t++;
      ctx.clearRect(0, 0, r.width, r.height);
      ps.forEach(function (p) {
        p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - t / 110);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (t < 110) requestAnimationFrame(frame); else c.remove();
    })();
  }

  function setupPopup(overlay) {
    var closeBtn = overlay.querySelector('#exitPopupClose');
    var techRow = overlay.querySelector('#epTechRow');
    var submitBtn = overlay.querySelector('#epSubmit');
    var errorMsg = overlay.querySelector('#epError');
    var formBody = overlay.querySelector('#exitPopupForm');
    var successState = overlay.querySelector('#exitPopupSuccess');
    var waBtn = overlay.querySelector('#epWaBtn');
    var phoneInput = overlay.querySelector('#epPhone');
    var submitLabel = submitBtn.innerHTML;
    var selectedTech = null;

    function hidePopup() {
      overlay.classList.remove('show');
      document.documentElement.classList.remove('ep-open');
    }
    closeBtn.addEventListener('click', hidePopup);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) hidePopup(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('show')) hidePopup(); });

    techRow.querySelectorAll('.radio-opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        techRow.querySelectorAll('.radio-opt').forEach(function (o) {
          o.classList.remove('selected'); o.setAttribute('aria-checked', 'false');
        });
        opt.classList.add('selected');
        opt.setAttribute('aria-checked', 'true');
        selectedTech = opt.dataset.value;
      });
    });

    // máscara do WhatsApp: (44) 99999-9999
    phoneInput.addEventListener('input', function () {
      var d = phoneInput.value.replace(/\D+/g, '').slice(0, 11);
      var out = d;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(d.length - 4);
      phoneInput.value = out;
    });

    function showError(msg) { errorMsg.textContent = msg; errorMsg.classList.add('show'); }
    function clearError() { errorMsg.classList.remove('show'); }

    submitBtn.addEventListener('click', function () {
      clearError();
      var name = overlay.querySelector('#epName').value.trim();
      var phone = phoneInput.value.trim();
      var digits = phone.replace(/\D+/g, '');

      if (!name) { showError('Escreve seu nome pra gente te chamar direito.'); return; }
      if (digits.length < 10) { showError('Coloca seu WhatsApp com DDD.'); return; }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="ep2-spin"></span><span>Enviando...</span>';

      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name, email: '', phone: phone,
          isTechnician: selectedTech || 'nao_informado',
          source: 'popup_saida_' + window.location.pathname,
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok === false) { throw new Error(res.error || 'falha'); }
          var msg = 'Olá! Me chamo ' + name + ' e vim pelo site da Escola Instructiva. Queria uma ajuda pra escolher o curso certo pra mim.';
          var waNum = (POPUP_CFG && POPUP_CFG.whatsapp) || '5544920066945';
          waBtn.href = 'https://wa.me/' + String(waNum).replace(/\D+/g, '') + '?text=' + encodeURIComponent(msg);
          formBody.classList.add('hide');
          successState.classList.add('show');
          confetti(overlay.querySelector('.ep2-main'));
          try { window.dispatchEvent(new CustomEvent('instructiva:lead', { detail: { source: 'popup' } })); } catch (e) {}
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitLabel;
          showError('Não deu pra enviar agora. Tenta de novo em instantes.');
        });
    });
  }

  function openOverlay(overlay) {
    overlay.classList.add('show');
    document.documentElement.classList.add('ep-open');
    setTimeout(function () { var n = overlay.querySelector('#epName'); if (n && window.innerWidth > 700) n.focus(); }, 450);
  }

  function triggerPopup(overlay) {
    if (shown || alreadyShownThisSession()) return;
    // não aparece por cima da janela de atendimento ou do menu aberto
    var de = document.documentElement;
    if (de.classList.contains('wa-open') || de.classList.contains('menu-open')) return;
    shown = true;
    markShown();
    openOverlay(overlay);
    // registra que o popup foi exibido (fire-and-forget, pra taxa de conversao)
    try {
      fetch('/api/popup-view', { method: 'POST', keepalive: true }).catch(function () {});
    } catch (e) {}
  }

  // conta a visita uma unica vez por sessao, assim que a pagina carrega,
  // independente do popup aparecer ou nao (mede visitantes reais do site)
  var VISIT_KEY = 'instructiva_visit_counted';
  function countVisitOnce() {
    try {
      if (sessionStorage.getItem(VISIT_KEY) === '1') return;
      sessionStorage.setItem(VISIT_KEY, '1');
    } catch (e) {}
    try {
      fetch('/api/visit', { method: 'POST', keepalive: true }).catch(function () {});
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    countVisitOnce();

    // MODO DE TESTE: acessar a pagina com ?popup=teste na URL forca o popup
    var forceShow = /[?&]popup=teste(\b|&|$)/.test(window.location.search);

    // busca a config (liga/desliga + textos + numero). Se falhar, usa padrao.
    fetch('/api/config')
      .then(function (r) { return r.json(); })
      .then(function (cfg) { POPUP_CFG = (cfg && cfg.popup) || {}; })
      .catch(function () { POPUP_CFG = {}; })
      .then(function () { initPopup(forceShow); });
  });

  function initPopup(forceShow) {
    // se a equipe desligou o popup no painel, nao mostra (a menos que seja teste)
    if (!forceShow && POPUP_CFG && POPUP_CFG.on === false) return;
    if (!forceShow && alreadyShownThisSession()) return;

    var overlay = buildPopup();
    setupPopup(overlay);

    if (forceShow) {
      openOverlay(overlay);
      return; // nao arma timer nem exit-intent; e so pra teste
    }

    setTimeout(function () { armed = true; }, ARM_DELAY_MS);

    // tempo na pagina: mostra sozinho depois de 30s (se ja nao apareceu por outro gatilho)
    setTimeout(function () { triggerPopup(overlay); }, 30000);

    // desktop: intencao de sair pelo topo da tela
    document.addEventListener('mouseleave', function (e) {
      if (!armed || e.clientY > 0) return;
      triggerPopup(overlay);
    });

    // mobile / fallback: troca de aba ou minimiza o app
    document.addEventListener('visibilitychange', function () {
      if (!armed) return;
      if (document.visibilityState === 'hidden') {
        triggerPopup(overlay);
      }
    });
  }
})();

/* =======================================================================
   ÁREA DO ALUNO — seletor de plataforma
   Ao clicar em "Área do aluno", abre uma janelinha com as plataformas.
   PARA ADICIONAR/EDITAR UMA PLATAFORMA: mexa só na lista PLATAFORMAS abaixo.
   ======================================================================= */
(function () {
  // >>> LISTA DE PLATAFORMAS (nome que aparece + link de acesso do aluno) <<<
  var PLATAFORMAS = [
    { nome: 'Cademi',  desc: 'Cursos e livros digitais',        url: 'https://instructiva.cademi.com.br/auth/login?redirect=%2Foffice%2Fusuario%2Fperfil%2Fcompras%2F21549397' },
    { nome: 'Hotmart', desc: 'Cursos comprados na Hotmart',     url: 'https://sso.hotmart.com/login' },
    { nome: 'Nutror',  desc: 'Área de alunos Nutror',           url: 'https://my.nutror.com/alunos' }
  ];

  var CSS =
    '.aluno-overlay{position:fixed;inset:0;z-index:230;background:rgba(5,5,7,.62);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .25s ease;}' +
    '.aluno-overlay.show{opacity:1;pointer-events:auto;}' +
    '.aluno-box{background:#fff;width:100%;max-width:420px;border-radius:26px;position:relative;overflow:hidden;transform:translateY(18px) scale(.97);transition:transform .4s cubic-bezier(.2,.7,.2,1);box-shadow:0 50px 120px -40px rgba(0,0,0,.75);}' +
    '.aluno-overlay.show .aluno-box{transform:none;}' +
    '.aluno-head{position:relative;padding:26px 26px 22px;color:#fff;background:radial-gradient(420px 240px at 100% 0%,rgba(249,115,22,.4),transparent 70%),linear-gradient(160deg,#1A120C 0%,#0B0B0D 70%);}' +
    '.aluno-close{position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);cursor:pointer;font-size:22px;color:#fff;line-height:1;display:flex;align-items:center;justify-content:center;transition:background .2s,transform .2s;}' +
    '.aluno-close:hover{background:rgba(255,255,255,.18);transform:rotate(90deg);}' +
    '.aluno-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:"Inter",sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#FFB27A;margin-bottom:10px;}' +
    '.aluno-eyebrow:before{content:"";width:18px;height:2px;border-radius:2px;background:#F97316;}' +
    '.aluno-title{font-family:"Manrope",sans-serif;font-weight:800;font-size:24px;color:#fff;margin:0 0 6px;letter-spacing:-.03em;}' +
    '.aluno-sub{font-family:"Inter",sans-serif;font-size:14px;color:#BDBDC5;margin:0;}' +
    '.aluno-list{display:flex;flex-direction:column;gap:10px;padding:18px;}' +
    '.aluno-item{display:flex;align-items:center;gap:14px;text-decoration:none;background:#fff;border:1px solid #E9E4DD;border-radius:18px;padding:14px 16px;transition:transform .25s cubic-bezier(.2,.7,.2,1),border-color .2s,box-shadow .25s;}' +
    '.aluno-item:hover{transform:translateY(-2px);border-color:rgba(249,115,22,.5);box-shadow:0 16px 30px -20px rgba(249,115,22,.7);}' +
    '.aluno-logo{flex:0 0 auto;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font-family:"Manrope",sans-serif;font-weight:800;font-size:19px;color:#fff;background:linear-gradient(180deg,#FF8A3D,#EA620C);}' +
    '.aluno-txt{flex:1;min-width:0;}' +
    '.aluno-txt strong{display:block;font-family:"Manrope",sans-serif;font-weight:800;font-size:16.5px;color:#141417;letter-spacing:-.01em;}' +
    '.aluno-txt small{display:block;font-family:"Inter",sans-serif;font-size:13px;color:#5D5D66;margin-top:2px;}' +
    '.aluno-arrow{flex:0 0 auto;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:#FFF1E6;color:#C2410C;font-weight:800;transition:transform .25s,background .2s,color .2s;}' +
    '.aluno-item:hover .aluno-arrow{transform:translateX(3px);background:#F97316;color:#fff;}' +
    '.aluno-foot{font-family:"Inter",sans-serif;font-size:12.5px;color:#8B8B93;text-align:center;margin:0;padding:0 22px 18px;}' +
    '@media (max-width:560px){.aluno-overlay{align-items:flex-end;padding:0;}.aluno-box{max-width:none;border-radius:26px 26px 0 0;transform:translateY(100%);}.aluno-list{padding:16px 16px calc(16px + env(safe-area-inset-bottom));}}';

  function injectCss() {
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'aluno-overlay';
    overlay.id = 'alunoOverlay';

    var itemsHtml = PLATAFORMAS.map(function (p) {
      return '<a class="aluno-item" href="' + p.url + '" target="_blank" rel="noopener">' +
        '<span class="aluno-logo">' + p.nome.charAt(0) + '</span>' +
        '<span class="aluno-txt"><strong>' + p.nome + '</strong><small>' + (p.desc || '') + '</small></span>' +
        '<span class="aluno-arrow" aria-hidden="true">→</span></a>';
    }).join('');

    overlay.innerHTML =
      '<div class="aluno-box" role="dialog" aria-modal="true" aria-label="Área do aluno">' +
        '<div class="aluno-head">' +
          '<button class="aluno-close" id="alunoClose" aria-label="Fechar">&times;</button>' +
          '<div class="aluno-eyebrow">Área do aluno</div>' +
          '<h3 class="aluno-title">Escolha sua plataforma</h3>' +
          '<p class="aluno-sub">Entre pela plataforma onde você comprou seu curso.</p>' +
        '</div>' +
        '<div class="aluno-list">' + itemsHtml + '</div>' +
        '<p class="aluno-foot">Não lembra onde comprou? Procure o e-mail de confirmação da compra.</p>' +
      '</div>';

    document.body.appendChild(overlay);

    function hide() { overlay.classList.remove('show'); }
    overlay.querySelector('#alunoClose').addEventListener('click', hide);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });

    return overlay;
  }

  function openModal(overlay) { overlay.classList.add('show'); }

  document.addEventListener('DOMContentLoaded', function () {
    injectCss();
    var overlay = buildModal();

    // intercepta qualquer link "Área do aluno" (topo, menu do celular e rodapé) em todas as paginas
    var anchors = Array.prototype.slice.call(document.querySelectorAll('a'));
    anchors.forEach(function (a) {
      // nao intercepta os links de dentro do proprio menu (senao a Cademi so reabriria o menu)
      if (a.closest('.aluno-overlay')) return;
      var txt = (a.textContent || '').trim().toLowerCase();
      var href = a.getAttribute('href') || '';
      if (txt === 'área do aluno' || href.indexOf('cademi.com.br') !== -1) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          document.documentElement.classList.remove('menu-open');
          openModal(overlay);
        });
      }
    });
  });
})();
