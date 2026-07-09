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
    if (alreadyShownThisSession()) return;
    var overlay = buildPopup();
    setupPopup(overlay);

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
