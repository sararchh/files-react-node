# Files API

## Instalação e Execução

### Pré-requisitos
- Node.js >= 20.16.0
- Yarn
- MySQL/MariaDB

### Instalação
```bash
# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env.development
```

### Execução
```bash
# Desenvolvimento
yarn dev

# Produção
yarn start
```

### Database
```bash
# Executar migrações
yarn db:migrate

# Executar seeds (opcional)
yarn db:seed
```

## Testes

O projeto possui **Jest** e **Supertest** configurados com **alta cobertura** (>80%).

### Comandos de Teste
```bash
# Executar todos os testes
yarn test

# Testes com coverage
yarn test:coverage

# Testes em modo watch
yarn test:watch

# Apenas testes unitários
yarn test:unit

# Apenas testes de integração
yarn test:integration
```

### Tipos de Teste
- **Unitários**: Services, Middlewares, Utilitários
- **Integração**: APIs completas com Supertest
- **Coverage**: Mínimo de 80% em branches, functions, lines e statements

### Estrutura de Testes
```
tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração (API)
└── helpers/        # Utilitários para testes
```

## API

### Endpoints
- `POST /api/v1/upload` - Upload de arquivo .txt
- `GET /api/v1/orders` - Consulta de pedidos

### Documentação
- Swagger UI disponível em `/api-docs` quando executando
