ESCOLA INSTRUCTIVA — SITE V3 (IDENTIDADE PRETO + LARANJA + POPUP DE SAIDA)
============================================================================

Novidade desta versao: POPUP DE SAIDA (captura de leads)
- Aparece quando o visitante move o mouse pra sair da pagina (desktop) ou
  troca de aba / minimiza o app (celular)
- So aparece 1 vez por sessao (nao fica incomodando)
- So arma depois de 6 segundos na pagina (nao dispara sem querer)
- Pede: nome, email, telefone e se a pessoa ja e tecnico ou esta comecando
- Os dados sao salvos de verdade no servidor, num arquivo leads.json
  (mesmo esquema de banco JSON que voces ja usam nos outros projetos)

Como ver os leads capturados:
- Acesse SEU-SITE.up.railway.app/api/leads?senha=SUA_SENHA no navegador
- Isso mostra a lista de leads em JSON
- IMPORTANTE: troque a senha padrao antes de usar de verdade! No Railway,
  va em Settings -> Variables -> New Variable, crie uma chamada LEADS_SECRET
  e coloque a senha que quiser. Sem isso, a senha padrao e "troque-esta-senha"
  (ou seja, qualquer um que souber disso consegue ver os leads).

O que mudou da v2:
- Visual totalmente reformulado pra bater com a identidade visual real da marca:
  preto e laranja, tipografia grossa em caixa alta, rotulos estilo "// LABEL"
- Cards de curso agora sao "posteres": capa grande escura com o nome do curso
  em destaque, numeracao e categoria, ao inves de card branco pequeno
- Mantém tudo que ja funcionava da v2: preco + parcelamento + garantia +
  botao fixo de compra + filtro e busca no catalogo

O que ainda falta plugar:
1. Botao "Comprar agora" ainda nao tem link real de checkout da Hotmart
2. Foto de verdade do Prof. Celso (hoje so um circulo com as iniciais "CM")
3. Depoimentos reais de alunos (os de agora sao exemplo)
4. Os posteres dos cursos sao so tipografia (sem foto)
5. Revisar os precos (herdados do catalogo anterior)
6. Colocar senha no /api/leads antes de divulgar o site (ver aviso acima)
7. Integrar os leads capturados com a IA SDR / WhatsApp (combinado pra depois)

Como publicar (Railway):
1. Substitua TODOS os arquivos do seu repositorio GitHub por estes
2. Commit e push
3. O Railway detecta a mudanca sozinho e atualiza o site em menos de 1 minuto

