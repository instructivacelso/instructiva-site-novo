/* Selo "Verificada por Reclame AQUI" (código oficial do painel do Reclame Aqui).
   Aparece uma vez por página, no lugar que mais passa confiança:
   - página de curso: logo abaixo do preço
   - home: na seção de garantia
   - demais páginas: no rodapé
   PRA TROCAR O SELO: mude só o DATA_ID (vem do painel do Reclame Aqui). */
(function () {
  var DATA_ID = 'TVg3R1NaREEyTGRtX182QzppbnN0cnVjdGl2YQ==';
  var MODEL = 'compact_1';

  if (document.getElementById('ra-verified-seal')) return;

  var spot, mode;
  if ((spot = document.querySelector('.price-panel'))) mode = 'after';
  else if ((spot = document.querySelector('.buy-card'))) mode = 'inside';
  else if ((spot = document.querySelector('.guarantee-text'))) mode = 'inside';
  else if ((spot = document.querySelector('footer .foot-bottom'))) mode = 'inside';
  else return;

  var box = document.createElement('div');
  box.className = 'ra-seal ra-seal--' + (mode === 'after' ? 'price' : spot.classList.contains('buy-card') ? 'card'
    : spot.classList.contains('foot-bottom') ? 'footer' : 'guarantee');
  box.innerHTML = '<span class="ra-seal-lbl">Empresa verificada</span>';

  var target = document.createElement('div');
  target.id = 'ra-verified-seal';
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.id = 'ra-embed-verified-seal';
  s.src = 'https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js';
  s.setAttribute('data-id', DATA_ID);
  s.setAttribute('data-target', 'ra-verified-seal');
  s.setAttribute('data-model', MODEL);
  target.appendChild(s);
  box.appendChild(target);

  if (mode === 'after') spot.parentNode.insertBefore(box, spot.nextSibling);
  else spot.appendChild(box);
})();
