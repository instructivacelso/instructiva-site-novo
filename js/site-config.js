/* Aplica no site as configurações que a equipe edita no painel:
   - Faixa de aviso (banner) no topo
   - Modo campanha no hero (troca o hero normal pela campanha)
   Lê de /api/config (público). Se der erro, o site fica como está (seguro). */
(function () {
  function esc(s) { return (s == null ? '' : String(s)).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function renderBanner(b) {
    if (!b || !b.on || !b.text) return;
    var bar = document.createElement('div');
    bar.className = 'site-banner';
    bar.style.background = b.color || '#F97316';
    var btn = (b.buttonText && b.buttonLink)
      ? '<a class="site-banner-btn" href="' + esc(b.buttonLink) + '" target="_blank" rel="noopener">' + esc(b.buttonText) + '</a>'
      : '';
    bar.innerHTML = '<div class="site-banner-in"><span>' + esc(b.text) + '</span>' + btn + '</div>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function waLink(num, msg) {
    var n = (num || '').replace(/\D+/g, '');
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(msg || 'Olá! Vim pelo site da Escola Instructiva.');
  }

  function renderCampaign(c) {
    if (!c || !c.on) return;
    var hero = document.querySelector('.promo-mega-hero');
    if (!hero) return;

    var waIcon = '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#25D366"/><path fill="#fff" d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/></svg>';

    var title = esc(c.title || '');
    if (c.highlight) { title = title.replace(esc(c.highlight), '<span>' + esc(c.highlight) + '</span>'); }

    var timerHtml = c.countdownOn
      ? '<div class="campanha-timer"><span class="tlabel">Encerra em</span>' +
        '<div class="tnum"><b id="cdH">--</b><small>Horas</small></div><span class="tsep">:</span>' +
        '<div class="tnum"><b id="cdM">--</b><small>Min</small></div><span class="tsep">:</span>' +
        '<div class="tnum"><b id="cdS">--</b><small>Seg</small></div></div>'
      : '';

    var html =
      '<div class="campanha-topbar">⚡ ' + esc(c.topbar || '') + '</div>' +
      '<div class="wrap campanha-center">' +
        '<div class="campanha-pill"><span class="bolt">⚡</span> <strong>' + esc(c.badge || 'Oferta') + '</strong> <em>Escola Instructiva</em></div>' +
        '<h1 class="campanha-h1">' + title + '</h1>' +
        (c.lead ? '<p class="campanha-lead">' + esc(c.lead) + '</p>' : '') +
        '<div class="campanha-cards">' +
          '<div class="cc cc-pix"><div class="pct">' + esc(c.tier1 || '') + '</div><div class="cl">' + esc(c.tier1l || '') + '</div></div>' +
          '<div class="cc"><div class="pct">' + esc(c.tier2 || '') + '</div><div class="cl">' + esc(c.tier2l || '') + '</div></div>' +
          '<div class="cc"><div class="pct">' + esc(c.tier3 || '') + '</div><div class="cl">' + esc(c.tier3l || '') + '</div></div>' +
        '</div>' +
        timerHtml +
        '<a class="campanha-cta2" href="' + waLink(c.whatsapp, c.whatsappMsg) + '" target="_blank" rel="noopener">' + waIcon + ' ' + esc(c.ctaText || 'Falar no WhatsApp') + '</a>' +
        '<p class="campanha-note2">Fale com um especialista da Instructiva no WhatsApp</p>' +
      '</div>';

    hero.className = 'promo-mega-hero campanha-hero';
    hero.innerHTML = html;

    if (c.countdownOn) startCountdown(parseInt(c.endHour, 10) || 22);
  }

  function startCountdown(endHour) {
    var H = document.getElementById('cdH'), M = document.getElementById('cdM'), S = document.getElementById('cdS');
    if (!H) return;
    function p(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      var now = new Date();
      var t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, 0, 0, 0);
      var d = t - now;
      if (d <= 0) { H.textContent = '00'; M.textContent = '00'; S.textContent = '00'; return; }
      H.textContent = p(Math.floor(d / 3600000));
      M.textContent = p(Math.floor((d % 3600000) / 60000));
      S.textContent = p(Math.floor((d % 60000) / 1000));
    }
    tick(); setInterval(tick, 1000);
  }

  function apply(cfg) {
    try { renderBanner(cfg.banner); } catch (e) {}
    try { renderCampaign(cfg.campaign); } catch (e) {}
  }

  fetch('/api/config').then(function (r) { return r.json(); }).then(apply).catch(function () {});
})();
