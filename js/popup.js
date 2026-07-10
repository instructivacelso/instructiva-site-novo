(function () {
  var STORAGE_KEY = 'instructiva_exit_popup_shown';
  var ARM_DELAY_MS = 6000;
  var armed = false;
  var shown = false;

  function alreadyShownThisSession() {
    try { return sessionStorage.getItem(STORAGE_KEY) === '1'; }
    catch (e) { return false; }
  }
  function markShown() {
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
  }

  function buildPopup() {
    var overlay = document.createElement('div');
    overlay.className = 'exit-popup-overlay';
    overlay.id = 'exitPopupOverlay';
    overlay.innerHTML =
      '<div class="exit-popup" role="dialog" aria-modal="true" aria-labelledby="exitPopupTitle">' +
        '<button class="exit-popup-close" id="exitPopupClose" aria-label="Fechar">&times;</button>' +
        '<div class="form-body" id="exitPopupForm">' +
          '<div class="eyebrow2">Antes de você ir</div>' +
          '<h3 id="exitPopupTitle">Fale com a gente</h3>' +
          '<p class="sub">Deixa seu contato que um consultor te ajuda a escolher o curso certo pra você.</p>' +
          '<div class="field">' +
            '<label for="epName">Nome</label>' +
            '<input type="text" id="epName" autocomplete="name">' +
          '</div>' +
          '<div class="field">' +
            '<label for="epEmail">Email</label>' +
            '<input type="email" id="epEmail" autocomplete="email">' +
          '</div>' +
          '<div class="field">' +
            '<label for="epPhone">Telefone / WhatsApp</label>' +
            '<input type="tel" id="epPhone" autocomplete="tel" placeholder="(11) 99999-9999">' +
          '</div>' +
          '<div class="field">' +
            '<label>Você já é técnico?</label>' +
            '<div class="radio-row" id="epTechRow">' +
              '<label class="radio-opt" data-value="sim"><input type="radio" name="epTech" value="sim">Já sou técnico</label>' +
              '<label class="radio-opt" data-value="nao"><input type="radio" name="epTech" value="nao">Estou começando</label>' +
            '</div>' +
          '</div>' +
          '<p class="error-msg" id="epError"></p>' +
          '<button class="submit-btn" id="epSubmit">Quero falar com um consultor</button>' +
          '<p class="fine-print">Seus dados estão seguros e não serão compartilhados.</p>' +
        '</div>' +
        '<div class="success-state" id="exitPopupSuccess">' +
          '<div class="icon">&#10003;</div>' +
          '<h3>Recebemos seus dados</h3>' +
          '<p>Em breve um consultor da Instructiva entra em contato por WhatsApp ou email.</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function setupPopup(overlay) {
    var closeBtn = overlay.querySelector('#exitPopupClose');
    var techRow = overlay.querySelector('#epTechRow');
    var submitBtn = overlay.querySelector('#epSubmit');
    var errorMsg = overlay.querySelector('#epError');
    var formBody = overlay.querySelector('#exitPopupForm');
    var successState = overlay.querySelector('#exitPopupSuccess');
    var selectedTech = null;

    function hidePopup() {
      overlay.classList.remove('show');
    }

    closeBtn.addEventListener('click', hidePopup);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hidePopup();
    });

    techRow.querySelectorAll('.radio-opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        techRow.querySelectorAll('.radio-opt').forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        opt.querySelector('input').checked = true;
        selectedTech = opt.dataset.value;
      });
    });

    function showError(msg) {
      errorMsg.textContent = msg;
      errorMsg.classList.add('show');
    }
    function clearError() {
      errorMsg.classList.remove('show');
    }

    submitBtn.addEventListener('click', function () {
      clearError();
      var name = overlay.querySelector('#epName').value.trim();
      var email = overlay.querySelector('#epEmail').value.trim();
      var phone = overlay.querySelector('#epPhone').value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name) { showError('Preenche seu nome.'); return; }
      if (!emailOk) { showError('Preenche um email válido.'); return; }
      if (!phone) { showError('Preenche seu telefone.'); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name, email: email, phone: phone,
          isTechnician: selectedTech || 'nao_informado',
          source: 'popup_saida_' + window.location.pathname,
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function () {
          formBody.classList.add('hide');
          successState.classList.add('show');
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Quero falar com um consultor';
          showError('Não deu pra enviar agora. Tenta de novo em instantes.');
        });
    });
  }

  function triggerPopup(overlay) {
    if (shown || alreadyShownThisSession()) return;
    shown = true;
    markShown();
    overlay.classList.add('show');
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
    // a aparecer na hora, ignorando o timer e a trava de "uma vez por sessao".
    // Serve pra voce conferir se a versao nova esta no ar de verdade.
    var forceShow = /[?&]popup=teste(\b|&|$)/.test(window.location.search);

    if (!forceShow && alreadyShownThisSession()) return;
    var overlay = buildPopup();
    setupPopup(overlay);

    if (forceShow) {
      overlay.classList.add('show');
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
  });
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
    '.aluno-overlay{position:fixed;inset:0;z-index:210;background:rgba(11,11,11,.82);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .2s ease;}' +
    '.aluno-overlay.show{opacity:1;pointer-events:auto;}' +
    '.aluno-box{background:#FAFAF8;width:100%;max-width:420px;border-radius:6px;position:relative;padding:32px 28px 24px;border-top:4px solid #F97316;transform:translateY(10px) scale(.98);transition:transform .2s ease;box-shadow:0 30px 60px -20px rgba(0,0,0,.5);}' +
    '.aluno-overlay.show .aluno-box{transform:translateY(0) scale(1);}' +
    '.aluno-close{position:absolute;top:12px;right:12px;width:32px;height:32px;border:none;background:transparent;cursor:pointer;font-size:22px;color:#6B6B66;line-height:1;display:flex;align-items:center;justify-content:center;border-radius:6px;}' +
    '.aluno-close:hover{background:rgba(0,0,0,.06);color:#0B0B0B;}' +
    '.aluno-eyebrow{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#F97316;margin-bottom:6px;}' +
    '.aluno-title{font-family:"Manrope",sans-serif;font-weight:800;font-size:21px;color:#0B0B0B;margin:0 0 4px;letter-spacing:-.01em;}' +
    '.aluno-sub{font-family:"Inter",sans-serif;font-size:13.5px;color:#6B6B66;margin:0 0 20px;}' +
    '.aluno-list{display:flex;flex-direction:column;gap:10px;}' +
    '.aluno-item{display:flex;align-items:center;justify-content:center;width:100%;text-align:center;text-decoration:none;background:#fff;border:1px solid #E6E6E1;border-radius:8px;padding:18px 16px;cursor:pointer;transition:.15s;font-family:"Manrope",sans-serif;font-weight:700;font-size:17px;color:#0B0B0B;letter-spacing:-.01em;}' +
    '.aluno-item:hover{border-color:#F97316;background:#FFF7F1;color:#C24E08;transform:translateY(-1px);}';

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
      return '<a class="aluno-item" href="' + p.url + '" target="_blank" rel="noopener">' + p.nome + '</a>';
    }).join('');

    overlay.innerHTML =
      '<div class="aluno-box" role="dialog" aria-modal="true" aria-label="Área do aluno">' +
        '<button class="aluno-close" id="alunoClose" aria-label="Fechar">&times;</button>' +
        '<div class="aluno-eyebrow">Área do aluno</div>' +
        '<h3 class="aluno-title">Escolha sua plataforma</h3>' +
        '<p class="aluno-sub">Entre pela plataforma onde você comprou seu curso.</p>' +
        '<div class="aluno-list">' + itemsHtml + '</div>' +
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

    // intercepta qualquer link "Área do aluno" (topo e rodapé) em todas as paginas
    var anchors = Array.prototype.slice.call(document.querySelectorAll('a'));
    anchors.forEach(function (a) {
      // nao intercepta os links de dentro do proprio menu (senao a Cademi so reabriria o menu)
      if (a.closest('.aluno-overlay')) return;
      var txt = (a.textContent || '').trim().toLowerCase();
      var href = a.getAttribute('href') || '';
      if (txt === 'área do aluno' || href.indexOf('cademi.com.br') !== -1) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          openModal(overlay);
        });
      }
    });
  });
})();
