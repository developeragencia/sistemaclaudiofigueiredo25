# Secure Bridge Connect

Uma aplicação moderna e segura para gerenciamento de transações e créditos fiscais.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Router DOM
- React Query
- Prisma
- Vitest

## Requisitos

- Node.js 18+
- npm 9+

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/secure-bridge-connect.git
cd secure-bridge-connect
```

2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env`

5. Execute as migrações do Prisma:
```bash
npm run prisma:migrate
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código
- `npm test` - Executa os testes
- `npm run coverage` - Gera o relatório de cobertura de testes
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:push` - Atualiza o banco de dados
- `npm run prisma:studio` - Abre o Prisma Studio
- `npm run prisma:migrate` - Executa as migrações
- `npm run prisma:reset` - Reseta o banco de dados

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React
  ├── lib/           # Utilitários e funções auxiliares
  ├── pages/         # Páginas da aplicação
  ├── styles/        # Estilos globais
  ├── types/         # Definições de tipos TypeScript
  └── App.tsx        # Componente principal
```

## Contribuindo

1. Crie uma branch para sua feature:
```bash
git checkout -b feature/nome-da-feature
```

2. Faça commit das suas alterações:
```bash
git commit -m 'feat: adiciona nova feature'
```

3. Envie para a branch:
```bash
git push origin feature/nome-da-feature
```

4. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
