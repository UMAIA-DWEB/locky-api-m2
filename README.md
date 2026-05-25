# LockyAPI

Backend REST de gestão de cacifos inteligentes inspirado nos cacifos Locky Portugal.

> M1 - DWEB II (UMAIA, 2025/2026)

> Grupo `inf25dw2g02`; Membros: Ricardo Dias (A047068@umaia.pt)

A ideia é replicar a parte de servidor de um sistema de cacifos públicos. Quem usa pode consultar estações, ver os cacifos de cada uma, e fazer reservas associadas à sua conta GitHub.

## Documentação

- [C1 - Description](./doc/c1.md) - tema, objetivos, grupo
- [C2 - Resources](./doc/c2.md) - modelo de dados e endpoints
- [C3 - Product](./doc/c3.md) - desenvolvimento, instalação, detalhes
- [C4 - Presentation](./doc/c4.md) - vídeo de apresentação

## Pôr a correr

É preciso Docker Desktop aberto e uma OAuth App registada no GitHub. O passo a passo está no [c3](./doc/c3.md#32-instalação).

1. Clonar este repositório;
2. Criar um ficheiro `.env` na raíz com esta estrutura:
```bash
DB_HOST=db
DB_PORT=3306
DB_NAME=lockyapi
DB_USER=locky
DB_PASSWORD=lockypass
DB_ROOT_PASSWORD=rootpass

PORT=3000
NODE_ENV=development

SESSION_SECRET=top-secret-session-key

GITHUB_CLIENT_ID=[ir ao github buscar]
GITHUB_CLIENT_SECRET=[ir ao github buscar]
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback
```

3. Editar o Client ID e Client Secret com os nossos valores (Github -> OAuth Apps)
4. Executar:

```bash
docker compose up --build
```

A app arranca em `http://localhost:3001`.

Num segundo terminal, para popular a BD:

```bash
docker compose exec app npm run seed
```

Isto cria 30 estações reais, 90 cacifos, 30 utilizadores e 30 reservas.

## Pontos de entrada

| URL | O que é |
| --- | --- |
| `/api/docs` | Documentação Swagger UI |
| `/auth/github` | Iniciar login (abrir no browser) |
| `/api/stations` | Lista de estações (endpoint público) |

A collection Postman está em [`postman/LockyAPI.postman_collection.json`](./postman/LockyAPI.postman_collection.json), pronta a importar.

## Tecnologias

Node.js 20, Express 5, Sequelize 6, MySQL 8, Passport com `passport-github2`, `express-session`, `swagger-jsdoc`, `swagger-ui-express`, Docker Compose.
