# Implementar Testes de UI

## ✅ Pré-requisitos

Este artigo é baseado diretamente nos conceitos dos artigos anteriores. Para aproveitá-lo ao máximo, você deve ter:

- Framework Playwright Inicializado
- User Snippets Criados
- Variáveis de Ambiente Configuradas
- Design Pattern Configurado
- POM como Fixture e Sessão de Autenticação de Usuário Implementados

---

## 🛠️ Criar Casos de Teste de UI

### 📦 Adicionar Scripts npm para Executar Testes

Adicione scripts no arquivo `package.json`:

> 🚀 **Dica Profissional:** Scripts npm bem organizados tornam seu fluxo de trabalho de testes eficiente e amigável para a equipe!

```json
{
  "scripts": {
      "test": "npx playwright test --project=chromium",
      "ci": "npx playwright test --project=chromium --workers=1",
      "flaky": "npx playwright test --project=chromium --repeat-each=20",
      "debug": "npx playwright test --project=chromium --debug",
      "ui": "npx playwright test --project=chromium --ui",
      "smoke": "npx playwright test --grep @Smoke --project=chromium",
      "sanity": "npx playwright test --grep @Sanity --project=chromium",
      "api": "npx playwright test --grep @Api --project=chromium",
      "regression": "npx playwright test --grep @Regression --project=chromium",
      "fullTest": "npx playwright test"
  }
}
```

---

## 📊 Criar Dados de Teste

Dados de Teste desempenham um papel crucial na automação de testes, servindo como a entrada que impulsiona a verificação de funcionalidades de software sob condições de teste! 📈 É a base sobre a qual os casos de teste são executados, determinando a precisão e confiabilidade dos testes automatizados. Dados de teste gerenciados adequadamente e utilizados estrategicamente podem aumentar significativamente a eficácia de uma estratégia de automação, cobrindo uma ampla gama de cenários de teste.

> 💡 **Dica Profissional:** Dados de teste de qualidade são a espinha dorsal de testes automatizados confiáveis - invista tempo na criação de conjuntos de dados abrangentes e realistas!

### 🎯 Aspectos Cruciais dos Dados de Teste na Automação de Testes:

- 🌈 **Variedade e Volume:** Incorporar um volume diverso e suficiente de dados de teste garante que as aplicações sejam testadas contra todas as entradas possíveis, incluindo casos extremos
- 💎 **Qualidade dos Dados:** Dados de teste de alta qualidade e realistas aumentam a confiabilidade dos resultados dos testes, oferecendo um reflexo verdadeiro do uso no mundo real
- 🗂️ **Gerenciamento:** Estratégias eficientes de gerenciamento de dados de teste, como usar pools de dados ou geradores, ajudam a manter a integridade e organização dos dados de teste, tornando-os facilmente acessíveis e reutilizáveis em casos de teste
- 🔒 **Segurança:** Ao lidar com informações sensíveis, proteger dados de teste é fundamental para evitar a exposição de dados confidenciais
- ⚡ **Geração Dinâmica de Dados:** Gerar dados de teste dinamicamente pode fornecer flexibilidade e eficiência, permitindo que os testes se adaptem a novas condições sem intervenção manual

> 🎯 **Insight Chave:** Aproveitar efetivamente os dados de teste em frameworks de automação é essencial para validar o comportamento do software, garantindo que as aplicações atendam às suas especificações e expectativas do usuário pretendidas.

### 🎲 Instalar faker.js para Geração Dinâmica de Dados

Instale a poderosa biblioteca Faker.js para gerar dados de teste realistas:

```bash
npm install --save-dev @faker-js/faker
```

> 🎭 **Por que Faker.js?** Gera dados falsos realistas para nomes, endereços, e-mails e muito mais - perfeito para cenários de teste abrangentes! Use quando precisar gerar dados aleatórios

---

## 🎭 Criar Testes de UI

### 📋 Estratégia de Organização de Testes

Como você descobrirá, eu separo testes em etapas de teste para melhorar a legibilidade do código e os relatórios gerados! 📊

> 💡 **Melhor Prática:** Dividir testes em etapas lógicas torna a depuração mais fácil e os relatórios mais informativos.

**Visualização de Etapas de Teste:**

```typescript
import { test, expect } from '../../fixtures/pom/test-options';
import { faker } from '@faker-js/faker';

test.describe('Verificar Publicar/Editar/Deletar um Artigo', () => {
    const randomArticleTitle = faker.lorem.words(3);
    const randomArticleDescription = faker.lorem.sentence();
    const randomArticleBody = faker.lorem.paragraphs(2);
    const randomArticleTag = faker.lorem.word();

    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePageUser();
    });

    test(
        'Verificar Publicar/Editar/Deletar um Artigo',
        { tag: '@Sanity' },
        async ({ navPage, articlePage }) => {
            await test.step('Verificar Publicar um Artigo', async () => {
                await navPage.newArticleButton.click();

                await articlePage.publishArticle(
                        randomArticleTitle,
                        randomArticleDescription,
                        randomArticleBody,
                        randomArticleTag
                    )
            });

            await test.step('Verificar Editar um Artigo', async () => {
                await articlePage.navigateToEditArticlePage();

                await expect(articlePage.articleTitleInput).toHaveValue(
                    randomArticleTitle
                );

                await articlePage.editArticle(
                    `Updated ${randomArticleTitle}`,
                    `Updated ${randomArticleDescription}`,
                    `Updated ${randomArticleBody}`
                );
            });

            await test.step('Verificar Deletar um Artigo', async () => {
                await articlePage.deleteArticle();
            });
        }
    );
});
```

---

## 🎯 Simular Respostas de API para Casos Extremos

Como na maioria das vezes não há como testar casos extremos específicos, simular respostas de API é uma solução conveniente! 🎭

> 💡 **Por que Simular APIs?** A simulação permite simular vários cenários, incluindo estados de erro, respostas lentas e casos extremos que são difíceis de reproduzir em ambientes reais.

```typescript
test(
    'Simular Resposta da API',
    { tag: '@Regression' },
    async ({ page, homePage }) => {
        await page.route(
            `${process.env.API_URL}api/articles?limit=10&offset=0`,
            async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        articles: [],
                        articlesCount: 0,
                    }),
                });
            }
        );

        await page.route(
            `${process.env.API_URL}api/tags`,
            async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        tags: articleData.create.article.tagList,
                    }),
                });
            }
        );

        await homePage.navigateToHomePageGuest();

        await expect(homePage.noArticlesMessage).toBeVisible();

        for (const tag of articleData.create.article.tagList) {
            await expect(
                page.locator('.tag-list').getByText(tag)
            ).toBeVisible();
        }
    }
);
```

---

## 🎯 Próximos Passos?

No próximo artigo, vamos implementar [**API Fixtures**](07_implementar_api_fixtures.md) - a base para capacidades robustas de testes de API! 🚀
