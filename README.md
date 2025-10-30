## Playwright POM Template (pt-BR)

Template opinativo para testes de UI e API com Playwright, seguindo Page Object Model, fixtures reutilizáveis, tipagem com TypeScript, lint/format automatizados e CI.

## Requisitos

- Node.js 18+
- npm 9+ (ou pnpm/yarn, se preferir adaptar)

## Instalação e uso rápido

1. Instale as dependências e binários do Playwright:
```
npm install
npx playwright install
```
2. Configure variáveis de ambiente:
   - Copie `.env.example` para `.env` e preencha conforme sua aplicação.
3. Ajuste autenticação no setup de testes:
   - Edite `tests/auth.setup.ts` de acordo com seu fluxo (login, tokens, cookies).
4. Rode os testes:
```
npm test
```

## Estrutura do projeto (resumo)

- `pages/`: Page Objects e componentes reutilizáveis.
- `fixtures/`: Fixtures de API, POM e opções de teste.
- `tests/`: Especificações de UI e API, e setup de autenticação.
- `docs-pt/`: Guias passo a passo de configuração e uso.
- `playwright.config.ts`: Configuração do Playwright.

## Configuração essencial

- Playwright: veja `playwright.config.ts` para baseURL, retries, reporter, etc.
- Autenticação: edite `tests/auth.setup.ts` e reutilize contexto em specs.
- Variáveis de ambiente: defina chaves de URL, credenciais e tokens no `.env`.

## Lint, format e pre-commit

- Configure ESLint, Prettier e Husky seguindo o guia: [10 - Implementar ESLint e Husky](docs-pt/10_implementar_eslint_husky.md)

## Integração Contínua (CI)

- Exemplo de pipeline: `azure-pipelines.yml`.
- Guia de GitHub Actions: [09 - Implementar GitHub Actions](docs-pt/09_implementar_github_actions.md)


## Documentação detalhada para criar um NOVO repositório (docs-pt)

- [01 - Setup inicial](docs-pt/01_setup_inicial.md)
- [02 - Criar snippets](docs-pt/02_criar_snippets.md)
- [03 - Configurar variáveis de ambiente](docs-pt/03_configurar_variaveis_ambiente.md)
- [04 - Setup Design Pattern](docs-pt/04_setup_design_pattern.md)
- [05 - Setup POM e Fixtures](docs-pt/05_setup_pom_e_fixtures.md)
- [06 - Implementar UI Tests](docs-pt/06_implementar_ui_tests.md)
- [07 - Implementar API Fixtures](docs-pt/07_implementar_api_fixtures.md)
- [08 - Implementar API Tests](docs-pt/08_implementar_api_tests.md)
- [09 - Implementar GitHub Actions](docs-pt/09_implementar_github_actions.md)
- [10 - Implementar ESLint e Husky](docs-pt/10_implementar_eslint_husky.md)
