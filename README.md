# FluxoLegal — Protótipo V3 estruturado

Protótipo estático organizado para GitHub Pages.

## Como abrir

Abra `index.html` no navegador ou publique a pasta em um servidor estático.

## Estrutura

- `index.html`: landing page
- `login.html`, `cadastro.html`, `onboarding.html`
- `dashboard.html`, `processos.html`, `processo.html`, `movimentacoes.html`, `api.html`, `conta.html`
- `planos.html`
- `termos.html`, `privacidade.html`
- `assets/css/styles.css`
- `assets/js/app.js`
- `assets/images/`

## Observação

Dados, nomes, números, depoimentos, preços e processos são demonstrativos para a prototipagem.

## Vídeo de entrada

Copie o arquivo `fluxolegal_video.mp4` para `assets/video/fluxolegal_video.mp4`. Ao clicar em Entrar, ele será exibido em loop com 20% de opacidade antes do dashboard.

## Integração processual (MVP)
Esta versão incorpora o motor de consulta por OAB/UF do protótipo fornecido. O cadastro grava o perfil profissional no navegador e as telas Dashboard, Processos, Processo e Movimentações consomem a consulta ao CNJ e renderizam os resultados no design existente.

### Importante sobre segurança
O controle por `localStorage` desta versão serve apenas ao protótipo estático/GitHub Pages. Em produção, OAB/UF, CPF, sessão, autorização por escritório (tenant) e chaves da API devem ser validados exclusivamente no backend. O frontend nunca deve poder escolher livremente outra OAB/CPF para ampliar seu escopo.
