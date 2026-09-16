# Frankie

Aplicação web para acompanhar **jogos** e **livros** organizados por ano, usando o
Notion como banco de dados.

## Visão geral

Cada ano corresponde a uma tabela no Notion com o nome no padrão `ANO - Categoria`
(por exemplo, `2026 - Jogos` ou `2026 - Livros`). A aplicação descobre essas tabelas
automaticamente pela API — não há configuração por ano — e monta o seletor de anos a
partir do que existir na conta.

Funcionalidades:

- listagem por ano, com seletor dos anos disponíveis;
- criação de itens, com busca integrada no IGDB (jogos) ou preenchimento manual;
- edição na própria linha: nome, nota, lançamento, autor, gêneros e notas ou citação;
- situação "zerado/lido" com data automática e marcação de 100% (jogos);
- escrita permitida apenas no ano corrente; anos anteriores são somente leitura;
- autenticação por senha única, com sessão persistente.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Interface | React 19 + Tailwind CSS v4 |
| Linguagem | JavaScript, com formatos de dados documentados em JSDoc |
| Dados | Notion, via `@notionhq/client` |
| Busca de jogos | IGDB, autenticado por client credentials do Twitch |

## Requisitos

- Node.js 20 ou superior
- Integração do Notion com acesso às tabelas utilizadas
- Credenciais de aplicação Twitch, para a busca no IGDB

## Configuração

Criar o arquivo `.env.local` na raiz do projeto (ignorado pelo git):

```
NOTION_TOKEN=          # token da integração do Notion
TWITCH_CLIENT_ID=      # IGDB
TWITCH_CLIENT_SECRET=
APP_PASSWORD=          # senha de acesso ao painel
AUTH_SECRET=           # valor aleatório (32+ bytes) usado para assinar a sessão
# GATE=off             # desativa a autenticação (apenas em desenvolvimento)
```

## Execução

```bash
npm install
npm run dev     # modo desenvolvimento (usa --webpack; ver Notas)
npm run build
npm run lint
```

## Estrutura

```
app/
  layout.js              # fonte, tema e navegação
  page.js                # redireciona para /jogos
  jogos/page.js          # redireciona para o ano mais recente
  jogos/[ano]/page.js    # lista de jogos do ano (ISR de 5 min)
  livros/page.js         # equivalente, para livros
  livros/[ano]/page.js
  login/page.js          # tela de senha
  login/actions.js       # valida a senha e emite o cookie de sessão
  actions.js             # Server Actions de escrita
  api/games/search/      # Route Handler da busca no IGDB
  error.js               # boundary de erro da página
  globals.css            # paleta de cores e animações
proxy.js                 # autenticação (convenção "proxy" do Next 16)
components/
  Sidebar.js             # navegação lateral
  SectionHeader.js       # cabeçalho da seção, com seletor de ano
  MediaList.js           # contêiner da lista, com rolagem interna
  YearPicker.js          # seletor de ano
  GroupLabel.js          # divisor entre "em andamento" e "concluídos"
  AddGameForm.js         # criação de jogo (busca no IGDB ou formulário manual)
  AddBookForm.js         # criação de livro
  GameSearch.js          # busca no IGDB com debounce
  GameRow.js             # linha de jogo (leitura e edição)
  BookRow.js             # linha de livro (leitura e edição)
  Poster.js              # capa
  GenreTag.js            # etiqueta de gênero
lib/
  notion.js              # leitura e descoberta das tabelas (tipos em JSDoc)
  writes.js              # criação, atualização e arquivamento de itens
  igdb.js                # cliente do IGDB
  auth.js                # emissão e verificação do cookie de sessão
  notionColors.js        # nomes de cor do Notion para classes do Tailwind
  format.js              # formatação de datas e fuso horário
```

## Decisões de projeto

- **Descoberta das tabelas pela API.** `lib/notion.js` consulta as tabelas
  compartilhadas com a integração e interpreta o padrão `ANO - Categoria` do
  título. Uma tabela nova passa a aparecer sem alteração de código ou de
  configuração.
- **Uma página por ano** (`/jogos/2026`), com `generateStaticParams`: os anos
  existentes são gerados estaticamente no build e um ano novo é renderizado na
  primeira visita e passa a ser cacheado.
- **Revalidação a cada 5 minutos** (`revalidate = 300`). A página é servida de
  cache e ainda assim reflete edições feitas no Notion; toda escrita feita pela
  própria aplicação dispara `revalidatePath`.
- **Escrita por formulários nativos e Server Actions**, sem chamadas `fetch` para
  a própria API. A interface funciona sem JavaScript, com exceção da busca no
  IGDB. As ações podem ser verificadas por requisições `POST` multipart.
- **Edição na própria linha.** O modo de leitura não oferece ações além do botão
  de edição; nome, nota, lançamento, autor, gêneros, notas, situação e 100% são
  alterados em um formulário com "salvar" e "cancelar".
- **Escrita restrita ao ano corrente.** Anos anteriores são tratados como arquivo:
  a página não renderiza formulários e a regra é validada no servidor
  (`assertEditable`, em `app/actions.js`), não apenas na interface.
- **A data de conclusão só é reescrita quando a situação muda.** O formulário
  envia o estado anterior em campos ocultos, evitando que uma edição de nome
  redefina a data de um item já concluído.
- **Datas formatadas a partir da string** (`YYYY-MM-DD`), sem `new Date()`, e fuso
  horário fixo em `America/Sao_Paulo`. Em servidores com relógio em UTC, a
  conversão ingênua exibiria o dia anterior.
- **Capas sempre como URL externa.** Arquivos enviados ao Notion geram URLs
  assinadas com validade aproximada de uma hora; a URL externa mantém o cache
  das páginas consistente.
- **Paginação explícita.** A API do Notion devolve no máximo 100 registros por
  página; `queryAll()` percorre os cursores até o fim.
- **`<img>` em vez de `next/image`** nas capas: as URLs já são externas e
  estáveis, e o otimizador de imagens tem cota no plano gratuito de hospedagem.
- **Autenticação por senha única.** O cookie de sessão é `HttpOnly`, `Secure` e
  `SameSite=Lax`, com validade de 180 dias, e contém apenas um valor assinado por
  HMAC. A senha é comparada por digest, em tempo constante. Sem `APP_PASSWORD`
  configurada, a aplicação bloqueia o acesso em vez de liberá-lo.

## Notas

Armadilhas encontradas durante o desenvolvimento, registradas para consulta:

- No Next.js 16, a convenção `middleware.js` foi substituída por `proxy.js`.
- Server Actions exigem o cabeçalho `Origin` em requisições feitas por JavaScript;
  o próprio framework rejeita chamadas de origem cruzada.
- No App Router, pastas com prefixo `_` são privadas e não geram rota.
- A versão atual da API do Notion trabalha com *data sources*; `databases.query`
  não existe mais no cliente v5. O identificador usado nas consultas é o da fonte
  de dados, obtido em `databases.retrieve`.
- O IGDB descontinuou o campo `category` (substituído por `game_type`). Filtros
  pelo nome antigo não retornam erro, apenas resultado vazio.
- O Turbopack apresenta instabilidade em sessões longas de hot-reload no Windows,
  por isso o script de desenvolvimento usa `--webpack`.

## Roadmap

- [x] Leitura de jogos e livros, com seleção de ano
- [x] Escrita por Server Actions (criação, edição, situação, notas e gêneros)
- [x] Autenticação com sessão persistente
- [x] Busca de jogos no IGDB
- [ ] Publicação (deploy) e variáveis de ambiente em produção
- [ ] Proxy de imagem para capas hospedadas no Notion
