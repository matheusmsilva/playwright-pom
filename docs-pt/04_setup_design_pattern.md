# Configuração de Design Pattern

## Pré-requisitos

Este artigo é baseado diretamente nos conceitos dos artigos anteriores. Para aproveitá-lo ao máximo, você deve ter:

- Framework Playwright Inicializado
- User Snippets Criados
- Variáveis de Ambiente Configuradas

---

## 🎯 Importância do Design Pattern

A importância de empregar padrões de design na automação de testes não pode ser subestimada! Ele serve como um blueprint para organizar a interação com os elementos da interface do usuário (UI) de páginas web de forma estruturada e reutilizável. 🎭

> 💡 **O que é um Design Pattern?** Uma solução comprovada para problemas comuns no design de software que fornece um template de como resolver problemas em várias situações

### 🚀 Por que Design Patterns São Importantes

Os padrões de design fornecem vários benefícios críticos:

- 🔧 **Manutenibilidade Aprimorada** - Gerenciamento centralizado de mudanças na UI
- 📖 **Legibilidade Melhorada** - Código mais limpo e eficiente
- 🔄 **Redução de Duplicação de Código** - Componentes reutilizáveis
- 🏗️ **Melhor Estrutura** - Arquitetura organizada e escalável
- 🛡️ **Robustez Aumentada** - Automação de testes mais confiável

Ao abstrair a estrutura da UI dos scripts de teste, os Design Patterns permitem que os testadores escrevam código mais limpo e eficiente. As mudanças na UI podem ser gerenciadas de forma centralizada, minimizando o impacto nos testes e melhorando a robustez da suíte de automação.

> ⚡ **Resultado:** Estratégias de automação de testes mais escaláveis, mantíveis e confiáveis que se alinham com as melhores práticas de desenvolvimento de software

---

## 🛠️ Configuração do POM

Como o POM Design Pattern é mais popular e escalável, vamos implementá-lo em nosso projeto. Existem várias implementações diferentes, mas vou mostrar as duas abordagens mais eficazes.

### Etapa 1: Criar Estrutura de Pastas

Crie uma estrutura de pastas lógica no diretório raiz do seu projeto:

```
project-root/
├── pages/
│   ├── ExamplePage.ts
│   └── HomePage.ts
├── tests/
└── playwright.config.ts
```

> 🏗️ **Por que Esta Estrutura?** Isso dá flexibilidade para estender com Painel de Administração ou outras seções da aplicação mais tarde

### Etapa 2: Criar Arquivos de Page Object

Crie e implemente page objects para as páginas da aplicação que serão usadas nos testes.

### Etapa 3: Criar Classes de Page Object

Vamos examinar um exemplo. Page como nosso exemplo principal:

```typescript
import { Page, Locator, expect } from '@playwright/test';

/**
 * Este é o objeto de página para a funcionalidade da Página de Artigo.
 * @export
 * @class ArticlePage
 * @typedef {ArticlePage}
 */
export class ArticlePage {
    constructor(private page: Page) {}

    get articleTitleInput(): Locator {
        return this.page.getByRole('textbox', {
            name: 'Article Title',
        });
    }
    
    get articleDescriptionInput(): Locator {
        return this.page.getByRole('textbox', {
            name: "What's this article about?",
        });
    }
    
    get articleBodyInput(): Locator {
        return this.page.getByRole('textbox', {
            name: 'Write your article (in',
        });
    }
    
    get articleTagInput(): Locator {
        return this.page.getByRole('textbox', {
            name: 'Enter tags',
        });
    }

    /**
     * Navega para a página de edição de artigo clicando no botão de editar.
     * Aguarda a página atingir um estado de rede idle após a navegação.
     * @returns {Promise<void>}
     */
    async navigateToEditArticlePage(): Promise<void> {
        await this.editArticleButton.click();

        await this.page.waitForResponse(
            (response) =>
                response.url().includes('/api/articles/') &&
                response.request().method() === 'GET'
        );
    }

    /**
     * Publica um artigo com os detalhes fornecidos.
     * @param {string} title - O título do artigo.
     * @param {string} description - Uma breve descrição do artigo.
     * @param {string} body - O conteúdo principal do artigo.
     * @param {string} [tags] - Tags opcionais para o artigo.
     * @returns {Promise<void>}
     */
    async publishArticle(
        title: string,
        description: string,
        body: string,
        tags?: string
    ): Promise<void> {
        await this.articleTitleInput.fill(title);
        await this.articleDescriptionInput.fill(description);
        await this.articleBodyInput.fill(body);

        if (tags) {
            await this.articleTagInput.fill(tags);
        }

        await this.publishArticleButton.click();

        await this.page.waitForResponse(
            (response) =>
                response.url().includes('/api/articles/') &&
                response.request().method() === 'GET'
        );

        await expect(
            this.page.getByRole('heading', { name: title })
        ).toBeVisible();
    }
}
```

É discutível se usar apenas métodos leva a uma implementação mais fácil. Minha opinião é aderir às funções get e usá-las nos métodos.

---

## 🎯 Próximos Passos?

No próximo artigo, vamos mergulhar na implementação do [**POM (Page Object Model) como Fixture**](05_setup_pom_e_fixtures.md) e criação de **Sessão de Autenticação de Usuário**.
