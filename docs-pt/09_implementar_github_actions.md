# Implementar GitHub Actions CI/CD

## 🎯 Introdução

Integrar frameworks de teste em pipelines CI/CD incorpora uma abordagem transformadora para entrega de software, melhorando tanto a velocidade quanto a qualidade! 🌟 As práticas de Integração Contínua (CI) e Entrega Contínua (CD) facilitam a execução automática de testes em vários estágios do ciclo de vida de desenvolvimento, desde o commit inicial do código até a implantação em produção.

> 🎯 **Por que Integração CI/CD?** Testes automatizados em pipelines CI/CD garantem qualidade consistente, lançamentos mais rápidos e detecção precoce de bugs - é a base do DevOps moderno!

### 🌟 Principais Benefícios:

- 🔍 **Detecção Precoce de Bugs:** Testes automatizados dentro de CI/CD identificam problemas cedo, quando são mais fáceis e menos custosos de corrigir
- ✅ **Garantia de Qualidade:** Testes consistentes garantem que as mudanças de código atendam aos padrões de qualidade antes de serem mescladas ou lançadas
- ⚡ **Velocidade de Lançamento:** Automatizar o processo de teste elimina gargalos no pipeline de implantação, permitindo ciclos de lançamento mais rápidos
- 🛡️ **Confiabilidade e Confiança:** Testes automatizados e repetíveis garantem que os lançamentos de software sejam mais confiáveis, aumentando a confiança no processo de desenvolvimento e implantação

> 💡 **Desenvolvimento Moderno:** Incorporar um framework de teste em pipelines CI/CD não é apenas uma melhor prática; é uma pedra angular de processos modernos de desenvolvimento de software eficientes e confiáveis!

## ✅ Pré-requisitos

Este artigo é baseado diretamente nos conceitos dos artigos anteriores. Para aproveitá-lo ao máximo, você deve ter:

- Framework Playwright Inicializado
- User Snippets Criados
- Variáveis de Ambiente Configuradas
- Design Pattern Configurado
- POM como Fixture e Sessão de Autenticação de Usuário Implementados
- Testes de UI Implementados
- API Fixtures Implementados
- Testes de API Implementados

---

## 🔧 Implementando Fluxo de Trabalho do GitHub Actions

### 📋 Detalhes do Fluxo de Trabalho

Nosso pipeline CI/CD abrangente inclui múltiplos estágios e recursos avançados! 🎯

- 🔐 **Variáveis de Ambiente:** Todos os fluxos de trabalho usam variáveis de ambiente definidas em GitHub Secrets
- 🧪 **Estágios de Teste:** O Pipeline inclui estágios para setup e teste de fumaça, e estágio de teste (testes de sanidade, testes de API e testes de regressão)
- 📊 **Relatórios:** Relatórios de teste são enviados como artefatos para revisão
- 🔗 **Relatório Mesclado (Opcional):** Todos os relatórios enviados são baixados, mesclados em um, e o relatório mesclado é enviado como artefato
- 🏗️ **Relatório de Build (Opcional):** Relatório mesclado é baixado e páginas do github são geradas e enviadas como artefato
- 🌐 **Relatório de Deploy (Opcional):** Páginas do github enviadas são implantadas no GitHub Pages para o fluxo de trabalho

> ⚠️ **Nota Importante:** Devido à consideração do GitHub de que a URL consiste em secrets, a solução alternativa foi codificar a URL para as GitHub Pages, para que apareça logo abaixo do nome do job e seja facilmente acessível para todos.

> 📝 **A FAZER:** Se o job for implementado, a URL deve ser atualizada.

### 🧪 Adicionar Arquivo de Teste de Demonstração

Adicione o arquivo `failingTest.spec.ts` na pasta tests do projeto para fins de demonstração:

```typescript
import { test, expect } from '../../fixtures/pom/test-options';

test('Failing Sanity Test', { tag: '@Sanity' }, async ({ homePage }) => {
    await homePage.navigateToHomePageUser();
    expect(2).toEqual(3);
});

test('Failing API Test', { tag: '@Api' }, async ({ homePage }) => {
    await homePage.navigateToHomePageUser();
    expect(2).toEqual(3);
});

test('Failing Regression Test', { tag: '@Regressions' }, async ({ homePage }) => {
    await homePage.navigateToHomePageUser();
    expect(2).toEqual(3);
});
```

---

## 🔧 Criar Actions Personalizadas

### Estrutura de Diretórios

Crie a pasta `.github/actions` no diretório raiz do projeto e adicione os seguintes arquivos:

```
.github/
└── actions/
    ├── playwright-report/
    │   └── action.yml
    └── playwright-setup/
        └── action.yml
```

### Playwright Report Action

**Arquivo: `.github/actions/playwright-report/action.yml`**

```yaml
name: 'Playwright Report'
description: 'Upload Playwright Report'
inputs:
    test-step-outcome:
        description: 'Resultado da etapa de teste (success ou failure)'
        required: true
    blob-report-upload:
        description: 'Se deve sempre fazer upload do relatório blob como artefato ou apenas em falha'
        required: false
        default: 'false'
    blob-report-retention-days:
        description: 'Dias de retenção para relatório blob'
        required: false
        default: '3'
    blob-report-path:
        description: 'Caminho para relatório blob'
        required: false
        default: 'blob-report'
runs:
    using: 'composite'
    steps:
        - name: Upload BLOB Report
          uses: actions/upload-artifact@v4
          if: ${{ inputs.blob-report-upload == 'true' || inputs.test-step-outcome == 'failure' }}
          with:
              name: blob-report-${{ github.job }}
              path: ${{ inputs.blob-report-path }}
              retention-days: ${{ inputs.blob-report-retention-days }}
```

### Playwright Setup Action

**Arquivo: `.github/actions/playwright-setup/action.yml`**

```yaml
name: 'Playwright Setup no Runner'
description: 'Configurar Playwright no Runner obtendo o código, configurando o Node, obtendo e cacheando dependências e obtendo e cacheando Navegadores do Playwright'
inputs:
    caching-dependencies:
        description: 'Se deve cachear dependências ou não'
        required: false
        default: 'true'
    caching-browsers:
        description: 'Se deve cachear navegadores ou não'
        required: false
        default: 'true'
runs:
    using: 'composite'
    steps:
        - name: Setup Node
          uses: actions/setup-node@v4
          with:
              node-version: lts/*

        - name: Cache Dependencies
          if: inputs.caching-dependencies == 'true'
          id: cache-dependencies
          uses: actions/cache@v4
          with:
              path: node_modules
              key: deps-node-modules-${{ hashFiles('**/package-lock.json') }}

        - name: Install dependencies
          if: steps.cache-dependencies.outputs.cache-hit != 'true' || inputs.caching-dependencies != 'true'
          run: npm ci
          shell: bash

        - name: Cache Playwright Browsers
          if: inputs.caching-browsers == 'true'
          id: cache-browsers
          uses: actions/cache@v4
          with:
              path: ~/.cache/ms-playwright
              key: playwright-browsers-${{ runner.os }}

        - name: Install Playwright Browsers
          if: steps.cache-browsers.outputs.cache-hit != 'true' || inputs.caching-browsers != 'true'
          run: npx playwright install --with-deps chromium
          shell: bash
```

---

## 🔧 Criar Workflow Principal

**Arquivo: `.github/workflows/playwright-custom-runner.yml`**

```yaml
name: Playwright Tests on Custom Runner Extended

on:
    push:
        branches: [main, master]
    pull_request:
        branches: [main, master]
    workflow_dispatch:

env:
    URL: ${{ secrets.URL }}
    API_URL: ${{ secrets.API_URL }}
    USER_NAME: ${{ secrets.USER_NAME }}
    EMAIL: ${{ secrets.EMAIL }}
    PASSWORD: ${{ secrets.PASSWORD }}

permissions:
    contents: read
    pages: write
    id-token: write

concurrency:
    group: 'pages'
    cancel-in-progress: false

jobs:
    setup-and-smoke-test:
        name: Setup and Smoke Test
        timeout-minutes: 60
        runs-on: ubuntu-latest
        outputs:
            smoke_outcome: ${{ steps.smoke.outcome }}
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Playwright Setup on Runner
              uses: ./.github/actions/playwright-setup

            - name: Run Smoke tests
              id: smoke
              run: npm run smoke

            - name: Upload Playwright Report
              if: always()
              uses: ./.github/actions/playwright-report
              with:
                  test-step-outcome: ${{ steps.smoke.outcome }}

    sanity-test:
        name: Sanity Test
        needs: setup-and-smoke-test
        timeout-minutes: 60
        runs-on: ubuntu-latest
        outputs:
            sanity_outcome: ${{ steps.sanity.outcome }}
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Playwright Setup on Runner
              uses: ./.github/actions/playwright-setup

            - name: Run Sanity tests
              id: sanity
              run: npm run sanity

            - name: Upload Playwright Report
              if: always()
              uses: ./.github/actions/playwright-report
              with:
                  test-step-outcome: ${{ steps.sanity.outcome }}

    api-test:
        name: API Test
        needs: setup-and-smoke-test
        timeout-minutes: 60
        runs-on: ubuntu-latest
        outputs:
            api_outcome: ${{ steps.api.outcome }}
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Playwright Setup on Runner
              uses: ./.github/actions/playwright-setup

            - name: Run API tests
              id: api
              run: npm run api

            - name: Upload Playwright Report
              if: always()
              uses: ./.github/actions/playwright-report
              with:
                  test-step-outcome: ${{ steps.api.outcome }}

    regression-test:
        name: Regression Test
        needs: setup-and-smoke-test
        timeout-minutes: 60
        runs-on: ubuntu-latest
        outputs:
            regression_outcome: ${{ steps.regression.outcome }}
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Playwright Setup on Runner
              uses: ./.github/actions/playwright-setup

            - name: Run Regression tests
              id: regression
              run: npm run regression

            - name: Upload Playwright Report
              if: always()
              uses: ./.github/actions/playwright-report
              with:
                  test-step-outcome: ${{ steps.regression.outcome }}

    merge-report:
        name: Merge Report
        if: always()
        needs: [setup-and-smoke-test, sanity-test, api-test, regression-test]
        timeout-minutes: 60
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: lts/*

            - name: Install Dependencies
              run: npm ci

            - name: Download blob reports from GitHub Actions Artifacts
              uses: actions/download-artifact@v4
              with:
                  path: all-blob-reports
                  pattern: blob-report-*
                  merge-multiple: true

            - name: Merge into HTML Report
              run: npx playwright merge-reports --reporter html ./all-blob-reports

            - name: Upload HTML report
              uses: actions/upload-artifact@v4
              with:
                  name: Merged HTML Reports
                  path: playwright-report
                  retention-days: 3

    build-report:
        name: Build Report
        if: always()
        needs: merge-report
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Download Merged HTML Reports
              uses: actions/download-artifact@v4
              with:
                  name: Merged HTML Reports
                  path: ./_site

            - name: Upload artifact
              uses: actions/upload-pages-artifact@v3
              with:
                  path: ./_site

    deploy-report:
        name: Deploy Report
        if: always()
        needs: build-report
        environment:
            name: github-pages
            url: 'https://idavidov13.github.io/Playwright-Framework/'
        runs-on: ubuntu-latest
        steps:
            - name: Deploy to GitHub Pages
              id: deployment
              uses: actions/deploy-pages@v4
```

---

## 🔐 Configurar Secrets do GitHub Actions

Configuração segura é essencial para proteger informações sensíveis! 🛡️

> 🔒 **Melhor Prática de Segurança:** Nunca codifique informações sensíveis em seus fluxos de trabalho - sempre use GitHub Secrets para credenciais e URLs.

### Passos para configurar secrets:

1. 📂 Navegue até as configurações do repositório no GitHub
2. 🔐 Vá para **Secrets and variables**
3. ⚙️ Vá para **Actions**
4. ➕ Clique em **New repository secret**
5. 📝 Adicione os seguintes secrets:
   - `URL` - URL da sua aplicação
   - `API_URL` - URL base da sua API
   - `USER_NAME` - Nome de usuário de teste
   - `EMAIL` - E-mail de usuário de teste
   - `PASSWORD` - Senha de usuário de teste

---

## 🌐 Habilitar GitHub Pages

A implantação do GitHub Pages fornece fácil acesso aos seus relatórios de teste! 📊

> 🎯 **Acessibilidade Pública:** GitHub Pages torna seus relatórios de teste acessíveis para toda a equipe sem exigir acesso ao repositório.

### Passos de configuração:

1. 📂 Navegue até as configurações do repositório no GitHub
2. 📄 Vá para **Pages**
3. ⚙️ Selecione fonte de **Build and deployment** como **GitHub Actions**

---

## 🎯 Próximos Passos?

[Implementar ESlint e Husky](10_implementar_eslint_husky.md)
