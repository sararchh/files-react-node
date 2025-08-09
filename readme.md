# Files API - Backend

API REST para processamento e gerenciamento de arquivos com dados de pedidos e produtos.

## 🚀 Tecnologias Utilizadas

### Core
- **Node.js** (≥20.16.0 ≤22.13.1) - Runtime JavaScript
- **TypeScript** - Linguagem principal com tipagem estática
- **Express.js** - Framework web para Node.js
- **MySQL** - Banco de dados relacional

### ORM e Database
- **Sequelize** - ORM para Node.js
- **Sequelize-TypeScript** - Integração do Sequelize com TypeScript usando decorators
- **mysql2** - Driver MySQL para Node.js

### Validação e Middleware
- **Zod** - Schema validation e parsing de dados TypeScript-first
- **Multer** - Middleware para upload de arquivos
- **CORS** - Middleware para Cross-Origin Resource Sharing

### Documentação
- **Swagger** (swagger-jsdoc + swagger-ui-express) - Documentação interativa da API

### Testes
- **Jest** - Framework de testes
- **Supertest** - Biblioteca para testes de integração HTTP
- **ts-jest** - Preprocessor Jest para TypeScript

### Qualidade de Código
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formatador de código
- **Husky** - Git hooks
- **lint-staged** - Executa linters em arquivos staged
- **Commitlint** - Padronização de mensagens de commit

### Build e Deploy
- **tsup** - Bundler TypeScript rápido
- **tsx** - Runtime TypeScript para desenvolvimento
- **Docker** - Containerização

## 🏗️ Padrões Arquiteturais Aplicados

### Arquitetura Modular (Modular Architecture)
A aplicação foi estruturada utilizando uma **arquitetura modular** para facilitar manutenção e escalabilidade:

```
src/
├── modules/         # Módulos de domínio organizados por contexto
│   └── files/       # Módulo de arquivos (exemplo)
│       ├── files.controller.ts    # Camada de Apresentação
│       ├── files.service.ts       # Camada de Negócio
│       ├── files.repository.ts    # Camada de Dados
│       ├── files.types.ts         # Tipos específicos
│       ├── errors/                # Errors específicos do módulo
│       └── schemas/               # Validações específicas
├── entities/        # Modelos de domínio compartilhados
├── middlewares/     # Middlewares globais
├── routes/          # Definição de rotas por versão
├── config/          # Configurações da aplicação
└── utils/           # Utilitários compartilhados
```

**Vantagens da Arquitetura Modular:**
- **Escalabilidade**: Novos módulos podem ser adicionados facilmente
- **Manutenibilidade**: Cada módulo é independente e coeso
- **Testabilidade**: Testes isolados por módulo
- **Organização**: Código relacionado fica agrupado
- **Reutilização**: Componentes podem ser reutilizados entre módulos

### Repository Pattern
- Abstração da camada de acesso a dados
- Isolamento da lógica de negócio das especificidades do banco
- Facilita testes unitários com mocks

### Dependency Injection
- Injeção de dependências entre camadas
- Baixo acoplamento entre componentes
- Facilita testes e manutenibilidade

### Domain-Driven Design (DDD) - Elementos
- **Modules**: Organização por contextos de domínio (ex: `files`)
- **Entities**: Modelos de domínio compartilhados (`User`, `Order`, `Product`, `OrderProduct`)
- **Services**: Lógica de negócio específica dentro de cada módulo
- **Value Objects**: Utilizados através de validações Zod
- **Domain Errors**: Errors específicos por contexto/módulo

### Separation of Concerns
- Cada módulo tem responsabilidade única
- Controllers apenas gerenciam HTTP
- Services contêm lógica de negócio
- Repositories gerenciam persistência

### Error Handling Pattern
- Sistema centralizado de tratamento de erros
- Errors customizados por domínio
- Respostas HTTP padronizadas

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 20.16.0 a 22.13.1)
- MySQL 8.0+
- Yarn ou npm

### 🔧 Execução Local

1. **Clone o repositório:**
```bash
git clone <https://github.com/sararchh/files-react-node.git>
cd back
```

2. **Instale as dependências:**
```bash
yarn install
# ou
npm install
```

3. **Configure as variáveis de ambiente:**

Crie os arquivos de ambiente baseados nos exemplos:
- `.env.development` para desenvolvimento
- `.env.production` para produção

Exemplo de configuração:
```env
NODE_ENV=development
PORT=2424
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_DATABASE=files_db
```

1. **Inicie o servidor de desenvolvimento:**
```bash
yarn dev
```

O servidor estará disponível em `http://localhost:2424`

### 🐳 Execução com Docker

1. **Configure o arquivo `.env`** na raiz do projeto com as variáveis necessárias.

2. **Execute com Docker Compose:**
```bash
docker-compose up -d
```

Isso irá:
- Criar e configurar um container MySQL
- Criar e executar o container da aplicação
- Configurar a rede entre os containers
- Expor a aplicação na porta configurada

3. **Para parar os containers:**
```bash
docker-compose down
```

4. **Para rebuild da aplicação:**
```bash
docker-compose up --build
```

### 📊 Executando Testes

#### Todos os testes:
```bash
yarn test
```

#### Testes com coverage:
```bash
yarn test:coverage
```

#### Testes em modo watch:
```bash
yarn test:watch
```

#### Apenas testes unitários:
```bash
yarn test:unit
```

#### Apenas testes de integração:
```bash
yarn test:integration
```

#### Testes para CI/CD:
```bash
yarn test:ci
```

## 📁 Estrutura do Projeto

```
src/
├── config/                 # Configurações da aplicação
│   ├── db-connection.config.ts
│   ├── environment.config.ts
│   ├── multer.config.ts
│   └── swagger.ts
├── entities/               # Modelos do banco de dados
│   ├── Order.ts
│   ├── OrderProduct.ts
│   ├── Product.ts
│   └── User.ts
├── middlewares/           # Middlewares customizados
│   ├── files-payload-exists.middleware.ts
│   └── validation-schema.middleware.ts
├── modules/               # Módulos da aplicação
│   └── files/
│       ├── files.controller.ts
│       ├── files.repository.ts
│       ├── files.service.ts
│       ├── files.types.ts
│       ├── errors/        # Errors específicos do módulo
│       └── schemas/       # Schemas de validação
├── routes/                # Definição de rotas
│   ├── index.ts
│   └── v1/
├── schemas/               # Schemas globais
├── utils/                 # Utilitários
└── main.ts               # Ponto de entrada da aplicação
```

## 📚 Documentação da API

A documentação interativa da API está disponível via Swagger UI:

- **Desenvolvimento**: `http://localhost:2424/api-docs`
- **Produção**: `https://your-domain.com/api-docs`

## 🔍 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `yarn dev` | Inicia servidor de desenvolvimento com hot reload |
| `yarn start` | Build e executa em produção |
| `yarn build` | Gera build de produção |
| `yarn test` | Executa todos os testes |
| `yarn test:coverage` | Executa testes com relatório de cobertura |
| `yarn lint:check` | Verifica problemas de linting |
| `yarn lint:fix` | Corrige problemas de linting automaticamente |
| `yarn format:check` | Verifica formatação do código |
| `yarn format:write` | Formata o código automaticamente |

## 🚦 Quality Gates

O projeto implementa várias camadas de qualidade:

1. **Pre-commit hooks** - Executa linting e formatação
2. **Commit linting** - Padronização de mensagens de commit
3. **Type checking** - Verificação de tipos TypeScript
4. **Unit tests** - Cobertura de testes unitários
5. **Integration tests** - Testes de fluxo completo
6. **Code coverage** - Relatórios de cobertura de código

**Autor**: sararchh  
**Licença**: ISC
