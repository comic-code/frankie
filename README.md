# Frankie

Painel pessoal — **jogos** e **livros** — que lê e escreve direto nas tabelas do Notion.
Substitui o par `frankie-web` (CRA) + `frankie-server` (Express), que vivia em
`C:\Github\Fun\frankie` e está congelado como histórico.

## Stack

- **Next.js 16** (App Router, Server Components) + React 19
- **JavaScript** (sem TS por enquanto — shapes documentados via JSDoc em `lib/notion.js`)
- **Tailwind v4** — paleta do app antigo, 1:1, em `app/globals.css` (`@theme`)
- **Notion** como banco (`@notionhq/client`), fonte de verdade das duas tabelas

## Rodar

```bash
npm install
npm run dev          # usa --webpack (Turbopack corrompe em hot-reload longo no Windows)
```

`.env.local` (não versionado — `.env*` está no `.gitignore`):

```
NOTION_TOKEN=          # só isso basta: as tabelas são descobertas pela API
TWITCH_CLIENT_ID=      # IGDB, pra busca de jogos (F3)
TWITCH_CLIENT_SECRET=
APP_PASSWORD=          # senha do painel (gate de login)
AUTH_SECRET=           # aleatório, 32+ bytes: assina o cookie de sessão
# GATE=off             # desliga o login (só pra teste local)
```

## Estrutura

```
app/
  layout.js          # fonte Kode Mono, tema, sidebar
  page.js            # redireciona pra /jogos
  jogos/page.js      # redireciona pro ano mais recente de jogos
  jogos/[ano]/page.js    # lista de jogos daquele ano (ISR 5 min)
  livros/page.js     # idem, pra livros
  livros/[ano]/page.js
  login/page.js      # tela de senha
  login/actions.js   # confere a senha e seta o cookie de sessão
  actions.js         # Server Actions de escrita (criar, nota, zerado, etc)
  error.js           # boundary: erro de Notion não derruba a página
  globals.css        # paleta + animações do app antigo
proxy.js             # gate de login (Next 16: era middleware.js)
components/
  Sidebar.js         # a Nav antiga, agora com rotas reais
  SectionHeader.js   # barra colorida do topo (o ListHeader antigo)
  MediaList.js       # a coluna de 40rem (o ListWrapper antigo)
  YearPicker.js      # seletor de ano (só links: cada ano é uma página)
  GroupLabel.js      # divisor "zerados" / "lidos"
  AddGameForm.js     # formulário de criação (jogo)
  AddBookForm.js     # formulário de criação (livro)
  RowActions.js      # nota, zerado, troféu e notas/citação de cada linha
  AutoSubmitSelect.js # select que salva sozinho (única ilha de JS)
  GameRow.js         # linha de jogo
  BookRow.js         # linha de livro
  Poster.js          # capa 5rem×109px
  GenreTag.js        # chip de gênero (cor vem do Notion)
lib/
  notion.js          # leitura das tabelas (JSDoc: Game, Book) + descoberta por ano
  writes.js          # escrita: criar/atualizar/arquivar + opções de rating/gênero
  auth.js            # token do cookie de sessão (Web Crypto: vale no Edge e no Node)
  notionColors.js    # as 10 cores do Notion → classes do Tailwind
  format.js          # datas YYYY-MM-DD → DD/MM/AAAA (sem armadilha de fuso)
```

## Decisões que não são óbvias

- **Gate de login em `proxy.js`** (Next 16 renomeou `middleware.js`): cookie
  `HttpOnly` + `Secure` + `SameSite=Lax` com `expiraEm.assinatura HMAC`, validade
  de 180 dias. Senha comparada por digest em tempo constante. Falha fechada: sem
  `APP_PASSWORD` configurada, bloqueia tudo (em vez de abrir por esquecimento).
- **Escrita por formulários nativos + Server Actions**, não por fetch/JSON: o
  painel funciona sem JavaScript (a única ilha de JS é o select que salva
  sozinho). Ganho colateral: dá pra testar cada ação com um POST multipart.
- **`done_date` no fuso de Brasília**: no server da Vercel o relógio é UTC, e
  "zerado hoje" às 22h viraria o dia seguinte.
- **Capa sempre como URL externa** (`external`, nunca `file`): arquivo enviado
  pro Notion gera URL assinada que expira em ~1h. Por isso o `revalidate = 300`
  também serve pra manter as capas vivas.
- **Descobrir as tabelas pela API**, não por env var: `lib/notion.js` faz `search` e
  lê o padrão `ANO - Categoria` do título. Criou `2027 - Jogos` no Notion? Aparece
  sozinho, sem deploy. (As env `NOTION_GAMES`/`NOTION_BOOKS` viraram história.)
- **Cada ano é uma página** (`/jogos/2026`) com `generateStaticParams`: os anos que
  existem viram HTML estático no build, e um ano novo é renderizado na primeira
  visita e cacheado.
- **`<img>` em vez de `next/image`** nas capas: as URLs já são externas e estáveis
  (IGDB/Amazon) e o otimizador da Vercel tem cota no plano free.
- **`revalidate = 300`**: a página é cacheada e ainda pega o que você editar no
  Notion pelo celular. Sem isso, cada visita pagaria a latência do Notion
  (437ms–1s medidos).
- **Datas formatadas da string**, não via `new Date()`: no server da Vercel o
  relógio é UTC e `new Date("2024-01-15")` mostraria 14/01.
- **`cover()` aceita os dois tipos de arquivo** (`external` e `file`): o controller
  antigo só lia `external.url` e quebrava com TypeError se a capa fosse upload do Notion.
- **Paginação**: a API do Notion devolve 100 por página; o código antigo lia só a
  primeira e perdia o resto em silêncio. `queryAll()` percorre os cursores.

## Roadmap

- [x] **F1** — leitura de jogos e livros, tema e rotas
- [x] **F1.2** — seletor de ano (descobre as tabelas `ANO - Categoria` sozinho)
- [x] **F2** — escrita (Server Actions): criar item, rating, done + `done_date`,
      gêneros, notas/citação, `done_achievements`; `revalidatePath` depois
- [x] **F2.5** — gate de login (senha + cookie de 180 dias)
- [ ] **F2.6** — proxy de capa `/api/capa/[id]` (cobre arquivo hospedado no Notion,
      que hoje depende do ISR revalidar antes da URL vencer)
- [ ] **F3** — busca no IGDB (`/api/games/search` + debounce) pra adicionar jogo
- [ ] **F4** — deploy na Vercel + env vars
- [ ] **F5** — guitar (só depois; o vault `guitar-guide` + Guitar Paths cobrem melhor)
