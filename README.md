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
NOTION_TOKEN=
NOTION_GAMES=     # tabela "2026 - Jogos"
NOTION_BOOKS=     # tabela "2025 - Livros"
TWITCH_CLIENT_ID=      # IGDB, pra busca de jogos (F3)
TWITCH_CLIENT_SECRET=
```

## Estrutura

```
app/
  layout.js          # fonte Kode Mono, tema, sidebar
  page.js            # redireciona pra /jogos
  jogos/page.js      # lista de jogos (ISR 5 min)
  livros/page.js     # lista de livros (ISR 5 min)
  error.js           # boundary: erro de Notion não derruba a página
  globals.css        # paleta + animações do app antigo
components/
  Sidebar.js         # a Nav antiga, agora com rotas reais
  SectionHeader.js   # barra colorida do topo (o ListHeader antigo)
  MediaList.js       # a coluna de 40rem (o ListWrapper antigo)
  GameRow.js         # linha de jogo
  BookRow.js         # linha de livro
  Poster.js          # capa 5rem×109px
  GenreTag.js        # chip de gênero (cor vem do Notion)
  DoneBadge.js       # ✔ zerado/lido + data
lib/
  notion.js          # leitura das tabelas (JSDoc: Game, Book)
  notionColors.js    # as 10 cores do Notion → classes do Tailwind
  format.js          # datas YYYY-MM-DD → DD/MM/AAAA (sem armadilha de fuso)
```

## Decisões que não são óbvias

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
- [ ] **F2** — escrita (Server Actions): criar item, rating, done + `done_date`,
      gêneros, notas/citação, `done_achievements`; `revalidatePath` depois
- [ ] **F3** — busca no IGDB (`/api/games/search` + debounce) pra adicionar jogo
- [ ] **F4** — deploy na Vercel + env vars
- [ ] **F5** — guitar (só depois; o vault `guitar-guide` + Guitar Paths cobrem melhor)
