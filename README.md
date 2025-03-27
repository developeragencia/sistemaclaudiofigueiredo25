# Secure Bridge Connect

Sistema de gerenciamento de clientes e contratos com autenticação segura e painel administrativo.

## Tecnologias

- React
- TypeScript
- Tailwind CSS
- Shadcn/ui
- React Router DOM
- Axios
- React Query
- Zod
- Sonner

## Funcionalidades

- ✅ Autenticação segura
- ✅ Painel administrativo
- ✅ Gerenciamento de clientes
- ✅ Controle de acesso baseado em funções (RBAC)
- ✅ Tema claro/escuro
- ✅ Interface responsiva
- ✅ Componentes reutilizáveis
- ✅ Validação de formulários
- ✅ Feedback visual para o usuário

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/secure-bridge-connect.git
cd secure-bridge-connect
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/       # Contextos React
  ├── hooks/         # Hooks personalizados
  ├── lib/           # Utilitários e configurações
  ├── pages/         # Páginas da aplicação
  ├── styles/        # Estilos globais
  └── types/         # Definições de tipos TypeScript
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes

## Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
