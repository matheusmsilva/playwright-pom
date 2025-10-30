# Implementar Testes de API

## Pré-requisitos

- Framework Playwright Inicializado
- User Snippets Criados
- Variáveis de Ambiente Configuradas
- Design Pattern Configurado
- POM como Fixture e Sessão de Autenticação de Usuário Implementados
- Testes de UI Implementados
- API Fixtures Implementados

---

## 🛠️ Implementar Testes de API

### 🔐 Estender Arquivo auth.setup.ts

Incorporar autenticação de API e configurar a variável de ambiente `ACCESS_TOKEN` garante que possuímos um token de autenticação válido! 🔑 Este token pode então ser consistentemente anexado aos headers de todas as solicitações necessárias, simplificando o processo de autenticação em nossas interações de API.

> 💡 **Estratégia de Autenticação:** Usar configuração de autenticação baseada em API é mais rápido e mais confiável do que fluxos de login baseados em navegador.

```typescript
import { test as setup, expect } from '../fixtures/pom/test-options';
import { User } from '../fixtures/api/types-guards';
import { UserSchema } from '../fixtures/api/schemas';

setup('auth user', async ({ apiRequest, homePage, navPage, page }) => {
    await setup.step('auth for user by API', async () => {
        const { status, body } = await apiRequest<User>({
            method: 'POST',
            url: 'api/users/login',
            baseUrl: process.env.API_URL,
            body: {
                user: {
                    email: process.env.EMAIL,
                    password: process.env.PASSWORD,
                },
            },
        });

        expect(status).toBe(200);
        expect(UserSchema.parse(body)).toBeTruthy();

        process.env['ACCESS_TOKEN'] = body.user.token;
    });

    await setup.step('create logged in user session', async () => {
        await homePage.navigateToHomePageGuest();

        await navPage.logIn(process.env.EMAIL!, process.env.PASSWORD!);

        await page.context().storageState({ path: '.auth/userSession.json' });
    });
});
```

---

## 📊 Criar Dados de Teste para Credenciais Inválidas

Permite testes completos de autenticação, autorização e criptografia de dados! 🔒

> 🛡️ **Testes de Segurança:** Testar com dados inválidos garante que sua API lida adequadamente com solicitações maliciosas ou mal formadas.

```json
{
    "invalidEmails": [
        "plainaddress",
        "@missingusername.com",
        "username@.com",
        "username@domain..com",
        "username@domain,com",
        "username@domain@domain.com",
        "username@domain"
    ],
    "invalidPasswords": [
        "123",
        "7charac",
        "verylongpassword21cha",
        "",
        "     "
    ],
    "invalidUsernames": ["", "us", "verylongpassword21cha"]
}
```

---

## 🔍 Criar Arquivo 'authentication.spec.ts'

Casos de teste negativos visam verificar que a Aplicação sob Teste (AUT) processa e lida corretamente com entradas de dados inválidas, garantindo tratamento robusto de erros e estabilidade do sistema! ⚠️

```typescript
import { ErrorResponseSchema } from '../../fixtures/api/schemas';
import { ErrorResponse } from '../../fixtures/api/types-guards';
import { test, expect } from '../../fixtures/pom/test-options';
import invalidCredentials from '../../test-data/invalidCredentials.json';

test.describe('Verificar Validação de API para Log In / Sign Up', () => {
    test(
        'Verificar Validação de API para Log In',
        { tag: '@Api' },
        async ({ apiRequest }) => {
            const { status, body } = await apiRequest<ErrorResponse>({
                method: 'POST',
                url: 'api/users/login',
                baseUrl: process.env.API_URL,
                body: {
                    user: {
                        email: invalidCredentials.invalidEmails[0],
                        password: invalidCredentials.invalidPasswords[0],
                    },
                },
            });

            expect(status).toBe(403);
            expect(ErrorResponseSchema.parse(body)).toBeTruthy();
        }
    );

    test(
        'Verificar Validação de API para Sign Up',
        { tag: '@Api' },
        async ({ apiRequest }) => {
            await test.step('Verificar Validação de API para Email Inválido', async () => {
                for (const invalidEmail of invalidCredentials.invalidEmails) {
                    const { status, body } = await apiRequest<ErrorResponse>({
                        method: 'POST',
                        url: 'api/users',
                        baseUrl: process.env.API_URL,
                        body: {
                            user: {
                                email: invalidEmail,
                                password: '8charact',
                                username: 'testuser',
                            },
                        },
                    });

                    expect(status).toBe(422);
                    expect(ErrorResponseSchema.parse(body)).toBeTruthy();
                }
            });

            await test.step('Verificar Validação de API para Senha Inválida', async () => {
                for (const invalidPassword of invalidCredentials.invalidPasswords) {
                    const { status, body } = await apiRequest<ErrorResponse>({
                        method: 'POST',
                        url: 'api/users',
                        baseUrl: process.env.API_URL,
                        body: {
                            user: {
                                email: 'validEmail@test.com',
                                password: invalidPassword,
                                username: 'testuser',
                            },
                        },
                    });

                    expect(status).toBe(422);
                    expect(ErrorResponseSchema.parse(body)).toBeTruthy();
                }
            });

            await test.step('Verificar Validação de API para Username Inválido', async () => {
                for (const invalidUsername of invalidCredentials.invalidUsernames) {
                    const { status, body } = await apiRequest<ErrorResponse>({
                        method: 'POST',
                        url: 'api/users',
                        baseUrl: process.env.API_URL,
                        body: {
                            user: {
                                email: 'validEmail@test.com',
                                password: '8charact',
                                username: invalidUsername,
                            },
                        },
                    });

                    expect(status).toBe(422);
                    expect(ErrorResponseSchema.parse(body)).toBeTruthy();
                }
            });
        }
    );
});
```

---

## 📝 Criar Arquivo 'article.spec.ts'

O propósito deste caso de teste é validar a funcionalidade CRUD (Create, Read, Update, Delete), garantindo que o sistema gerencie eficientemente as operações de dados! 🔄

> 🏗️ **Testes CRUD:** Testes CRUD abrangentes garantem que sua API possa lidar com o ciclo de vida completo das operações de dados.

```typescript
import { ArticleResponseSchema } from '../../fixtures/api/schemas';
import { ArticleResponse } from '../../fixtures/api/types-guards';
import { test, expect } from '../../fixtures/pom/test-options';
import articleData from '../../test-data/articleData.json';

test.describe('Verificar CRUD para Artigo', () => {
    test(
        'Verificar Criar/Ler/Atualizar/Deletar um Artigo',
        { tag: '@Api' },
        async ({ apiRequest }) => {
            let articleId: string;

            await test.step('Verificar Criar um Artigo', async () => {
                const { status, body } = await apiRequest<ArticleResponse>({
                    method: 'POST',
                    url: 'api/articles/',
                    baseUrl: process.env.API_URL,
                    body: articleData.create,
                    headers: process.env.ACCESS_TOKEN,
                });
                expect(status).toBe(201);
                expect(ArticleResponseSchema.parse(body)).toBeTruthy();
                articleId = body.article.slug;
            });

            await test.step('Verificar Ler um Artigo', async () => {
                const { status, body } = await apiRequest<ArticleResponse>({
                    method: 'GET',
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env.API_URL,
                });

                expect(status).toBe(200);
                expect(ArticleResponseSchema.parse(body)).toBeTruthy();
            });

            await test.step('Verificar Atualizar um Artigo', async () => {
                const { status, body } = await apiRequest<ArticleResponse>({
                    method: 'PUT',
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env.API_URL,
                    body: articleData.update,
                    headers: process.env.ACCESS_TOKEN,
                });

                expect(status).toBe(200);
                expect(ArticleResponseSchema.parse(body)).toBeTruthy();
                expect(body.article.title).toBe(
                    articleData.update.article.title
                );
                articleId = body.article.slug;
            });

            await test.step('Verificar Ler um Artigo Atualizado', async () => {
                const { status, body } = await apiRequest<ArticleResponse>({
                    method: 'GET',
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env.API_URL,
                });

                expect(status).toBe(200);
                expect(ArticleResponseSchema.parse(body)).toBeTruthy();
                expect(body.article.title).toBe(
                    articleData.update.article.title
                );
            });

            await test.step('Verificar Deletar um Artigo', async () => {
                const { status } = await apiRequest({
                    method: 'DELETE',
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env.API_URL,
                    headers: process.env.ACCESS_TOKEN,
                });

                expect(status).toBe(204);
            });

            await test.step('Verificar que o Artigo foi deletado', async () => {
                const { status } = await apiRequest({
                    method: 'GET',
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env.API_URL,
                });

                expect(status).toBe(404);
            });
        }
    );
});
```

---

## 🧹 Implementar Processo de Tear Down

Tear down no contexto de um caso de teste refere-se ao processo de limpar e restaurar o ambiente de teste ao seu estado original após a conclusão de uma execução de teste! 🧽 Esta etapa é crucial para garantir que cada caso de teste comece com um ambiente consistente, prevenindo efeitos colaterais de testes anteriores de influenciar o resultado dos subsequentes.

> 🎯 **Melhor Prática:** Limpeza adequada garante isolamento de teste e previne testes instáveis causados por dados de teste residuais.

### O processo de tear down pode envolver:

- 🔌 **Fechar conexões**
- 🗑️ **Deletar dados de teste**
- ⚙️ **Redefinir configurações do sistema**

Implementar efetivamente a fase de tear down ajuda a manter a integridade da suíte de testes, permitindo resultados de teste precisos e confiáveis! ✨

> 💡 **Abordagem à Prova de Falhas:** O teste que cobre a funcionalidade do artigo inclui uma etapa de tear down para deletar o artigo criado durante o teste. No entanto, caso qualquer etapa após a criação do artigo falhe, também implementamos uma solicitação de API para garantir que o artigo seja deletado, mantendo a integridade do ambiente de teste.

```typescript
import { test, expect } from '../../fixtures/pom/test-options';
import { faker } from '@faker-js/faker';

test.describe('Verificar Publicar/Editar/Deletar um Artigo', () => {
    const randomArticleTitle = faker.lorem.words(3);
    const randomArticleDescription = faker.lorem.sentence();
    const randomArticleBody = faker.lorem.paragraphs(2);
    const randomArticleTag = faker.lorem.word();
    let articleId: string;

    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePageUser();
    });
    
    // Teardown
    test.afterAll(async ({ apiRequest }) => {
        await apiRequest({
            method: 'DELETE',
            url: `api/articles/${articleId}`,
            baseUrl: process.env.API_URL,
            headers: process.env.ACCESS_TOKEN,
        });
    });

    test(
        'Verificar Publicar/Editar/Deletar um Artigo',
        { tag: '@Sanity' },
        async ({ navPage, articlePage, page }) => {
            await test.step('Verificar Publicar um Artigo', async () => {
                await navPage.newArticleButton.click();

                const response = await Promise.all([
                    articlePage.publishArticle(
                        randomArticleTitle,
                        randomArticleDescription,
                        randomArticleBody,
                        randomArticleTag
                    ),
                    page.waitForResponse(
                        (res) =>
                            res.url() ===
                                `${process.env.API_URL}api/articles/` &&
                            res.request().method() === 'POST'
                    ),
                ]);

                const responseBody = await response[1].json();
                articleId = responseBody.article.slug;
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

## 🎯 Próximos Passos?

No próximo artigo, vamos implementar [**Integração CI/CD**](09_implementar_github_actions.md) - automatizando nosso pipeline de execução de testes! 🚀
