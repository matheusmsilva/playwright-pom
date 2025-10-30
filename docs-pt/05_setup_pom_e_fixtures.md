# Implementar POM como Fixture e Sessão de Autenticação

## 🎯 Introdução

Fixtures no Playwright fornecem um mecanismo poderoso para configurar o ambiente para seus testes, gerenciar recursos e compartilhar objetos ou contextos comuns entre vários testes! 🚀 Esses componentes reutilizáveis permitem que você defina procedimentos personalizados de configuração e limpeza que automatizam os processos de preparação e limpeza, garantindo um ambiente de teste consistente e otimizando seus fluxos de trabalho.

> 💡 **O que são Fixtures?** Pense em fixtures como seu kit de ferramentas de teste - eles fornecem a base e as ferramentas de que seus testes precisam para funcionar de forma consistente e eficiente.

## ✅ Pré-requisitos

Este artigo é baseado diretamente nos conceitos dos artigos anteriores. Para aproveitá-lo ao máximo, você deve ter:

- Framework Playwright Inicializado
- User Snippets Criados
- Variáveis de Ambiente Configuradas
- Design Pattern Configurado

---

## 🛠️ Implementar POM (Page Object Model) como Fixture

### 📁 Criar Pasta de Fixtures

Crie pastas `fixtures/pom` no diretório raiz do projeto.

```
project-root/
├── fixtures/
│   └── pom/
│       ├── page-object-fixture.ts
│       └── test-options.ts
├── tests/
└── playwright.config.ts
```

### 🎭 Criar Arquivos de Fixtures

Crie e implemente fixtures para o site cliente para todas as páginas da aplicação.

#### 🔧 Page Object Fixture

**page-object-fixture.ts:** Este arquivo é usado para estender a fixture de teste do `@playwright/test`

```typescript
import { test as base } from '@playwright/test';
import { HomePage } from '../../pages/clientSite/homePage';
import { ArticlePage } from '../../pages/clientSite/articlePage';

export type FrameworkFixtures = {
    homePage: HomePage;
    articlePage: ArticlePage;
};

export const test = base.extend<FrameworkFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    articlePage: async ({ page }, use) => {
        await use(new ArticlePage(page));
    },
});

export { expect } from '@playwright/test';
```

#### ⚙️ Configuração de Opções de Teste

**test-options.ts:** Este arquivo é usado para mesclar todas as fixtures de teste estendidas

```typescript
import { test as base, mergeTests } from '@playwright/test';
import { test as pageObjectFixture } from './page-object-fixture';

const test = mergeTests(pageObjectFixture);

const expect = base.expect;
export { test, expect };
```

---

## 🔐 Implementar Sessão de Autenticação de Usuário

> 🎯 **Vantagem Estratégica:** Aproveitar sessões de usuário autenticadas no Playwright é uma abordagem estratégica para otimizar o teste de aplicações protegidas por senha!

Este método envolve pré-criar e reutilizar tokens de autenticação ou informações de sessão, permitindo que testes automatizados ignorem a UI de login. Isso reduz significativamente o tempo e os recursos necessários para testes que precisam de um contexto de usuário autenticado, melhorando a eficiência e confiabilidade dos testes.

### 🌟 Vantagens de Usar Sessões de Usuário Autenticadas no Playwright:

- ⚡ **Velocidade:** Usar sessões autenticadas diretamente elimina a sobrecarga de navegar por telas de login para cada teste, acelerando o processo de execução de testes
- 🛡️ **Estabilidade:** Os testes tornam-se menos propensos a falhas relacionadas a mudanças na UI no fluxo de autenticação, aumentando sua confiabilidade
- 🎯 **Foco:** Permite que os testes se concentrem nas funcionalidades principais que requerem autenticação, em vez do processo de login em si, tornando-os mais direcionados e concisos

### 📝 Criar Arquivo de Script de Auth

Crie o arquivo `auth.setup.ts` no diretório de testes do projeto.

```typescript
import { test as setup } from '../fixtures/pom/test-options';

setup('auth user', async ({ homePage, navPage, page }) => {
    await setup.step('create logged in user session', async () => {
        await homePage.navigateToHomePageGuest();

        await navPage.logIn(process.env.EMAIL!, process.env.PASSWORD!);

        await page.context().storageState({ path: '.auth/userSession.json' });
    });
});
```

### ⚙️ Atualizar Arquivo de Configuração

Adicione a seguinte configuração ao seu `playwright.config.ts`:

```typescript
projects: [
        {
            name: 'setup',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1366, height: 768 },
            },
            testMatch: /.*\.setup\.ts/,
        },

        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: '.auth/userSession.json',
                viewport: { width: 1366, height: 768 },
            },
            dependencies: ['setup'],
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
```

### 🔒 Adicionar Arquivo ao .gitignore

> ⚠️ **Melhor Prática de Segurança:** Adicione o arquivo `userSession.json` ao arquivo `.gitignore` no diretório raiz do projeto.

```gitignore
# Arquivo de Autenticação de Usuário
userSession.json
```

### 🏃‍♂️ Criar Sessão de Autenticação de Usuário

Execute o arquivo `auth.setup.ts` para criar a sessão de autenticação de usuário:

```bash
npx playwright test auth.setup.ts
```

### 👤 Criar Sessão de Usuário Convidado

Crie o arquivo `guestSession.json` no diretório `.auth` do projeto e adicione `{}` a ele.

> 💡 **Sessões de Convidado:** Objeto JSON vazio representa um estado não autenticado para testes que requerem acesso de convidado.

---

## 🎯 Próximos Passos?

No próximo artigo, vamos implementar [**Testes de UI**](06_implementar_ui_tests.md) - dando vida ao seu framework com testes abrangentes de interface de usuário!
