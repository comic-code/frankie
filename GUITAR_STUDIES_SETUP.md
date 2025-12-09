# Configuração do Sistema de Estudos de Guitarra

## Visão Geral

Este sistema permite gerenciar estudos de guitarra com funcionalidades como:
- Cadastro de estudos com título, dificuldade, gêneros e técnicas
- Controle de status (Para Praticar, Em Progresso, Concluído)
- Registro de tempo de prática
- Anotações personalizadas
- Filtros por status

## Configuração do Backend

### 1. Variáveis de Ambiente

Adicione no arquivo `.env` do backend (`frankie-server/.env`):

```env
NOTION_TOKEN=seu_token_do_notion
NOTION_GUITAR_STUDIES=id_do_database_guitar_studies
```

### 2. Configuração do Database no Notion

Crie um novo database no Notion com as seguintes propriedades:

#### Propriedades Obrigatórias:
- **Title** (Title) - Nome do estudo
- **Difficulty** (Select) - Opções: Beginner, Intermediate, Advanced, Expert
- **Genre** (Multi-select) - Gêneros musicais (Rock, Blues, Jazz, etc.)
- **Technique** (Multi-select) - Técnicas (Bending, Hammer-on, Pull-off, etc.)
- **Status** (Select) - Opções: To Practice, In Progress, Completed
- **Practice Time** (Number) - Tempo de prática em minutos
- **Notes** (Rich text) - Anotações sobre o estudo
- **Created Date** (Date) - Data de criação

#### Exemplo de configuração:
```
Title: "Solo de Sweet Child O' Mine"
Difficulty: Intermediate
Genre: Rock, Hard Rock
Technique: Bending, Hammer-on, Pull-off
Status: To Practice
Practice Time: 0
Notes: "Focar na parte do bend na nota E"
Created Date: 2024-01-15
```

### 3. Instalação e Execução

```bash
cd frankie-server
npm install
npm start
```

O servidor estará rodando em `http://localhost:4000`

## Configuração do Frontend

### 1. Instalação e Execução

```bash
cd frankie-web
npm install
npm start
```

O frontend estará rodando em `http://localhost:3000`

## Funcionalidades Implementadas

### Backend (Express + Notion API)
- ✅ GET `/guitar-studies` - Listar todos os estudos
- ✅ POST `/guitar-studies` - Criar novo estudo
- ✅ PATCH `/guitar-studies` - Atualizar estudo
- ✅ DELETE `/guitar-studies/:id` - Excluir estudo

### Frontend (React)
- ✅ Listagem de estudos em cards
- ✅ Formulário para criar/editar estudos
- ✅ Filtros por status
- ✅ Controle de tempo de prática
- ✅ Tags para gêneros e técnicas
- ✅ Anotações personalizadas
- ✅ Interface responsiva

## Estrutura de Arquivos

```
frankie-server/
├── src/
│   ├── controllers/
│   │   └── GuitarStudiesController.js  # Controller principal
│   └── routes.js                       # Rotas adicionadas

frankie-web/
├── src/
│   ├── components/
│   │   └── GuitarStudies/
│   │       ├── index.js                # Componente principal
│   │       ├── GuitarStudyForm.js      # Formulário
│   │       ├── GuitarStudyCard.js      # Card individual
│   │       └── styles.js               # Estilos
│   ├── services/
│   │   └── frankieNotion.js            # APIs adicionadas
│   ├── RenderController.js             # Roteamento
│   └── GlobalContext.js                # Contexto global
```

## Como Usar

1. **Acessar**: Clique no ícone 🎸 na navegação
2. **Criar Estudo**: Clique em "+ Novo Estudo"
3. **Preencher**: Título, dificuldade, gêneros, técnicas e notas
4. **Gerenciar**: Use os filtros e controles nos cards
5. **Praticar**: Registre o tempo de prática diretamente nos cards

## Próximas Melhorias Sugeridas

- [ ] Upload de arquivos de áudio/vídeo
- [ ] Metronome integrado
- [ ] Progresso visual com gráficos
- [ ] Lembretes de prática
- [ ] Compartilhamento de estudos
- [ ] Integração com YouTube/Vimeo
- [ ] Sistema de avaliação de progresso
- [ ] Backup automático

## Troubleshooting

### Erro de CORS
Certifique-se de que o backend está rodando na porta 4000 e o frontend na 3000.

### Erro de Notion API
Verifique se o token e database ID estão corretos no `.env`.

### Erro de Database
Certifique-se de que todas as propriedades estão configuradas corretamente no Notion. 