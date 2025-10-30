# Implementar API Fixtures

## 🎯 Introdução

Testes de API (Interface de Programação de Aplicações) são um aspecto fundamental do processo de teste de software que se concentra em verificar se as APIs atendem às expectativas de funcionalidade, confiabilidade, desempenho e segurança! 🚀 Este tipo de teste é realizado na camada de mensagem e envolve enviar chamadas para a API, obter saídas e anotar a resposta do sistema.

> 🌐 **Por que Testes de API São Importantes:** APIs são a espinha dorsal das aplicações modernas - garantir que funcionem perfeitamente é crucial para experiências de usuário perfeitas!

### 🌟 Aspectos Principais dos Testes de API:

- 🔧 **Testes de Funcionalidade:** Garante que a API funcione corretamente e entregue resultados esperados em resposta a solicitações específicas
- 🛡️ **Testes de Confiabilidade:** Verifica que a API pode ser consistentemente chamada e entrega desempenho estável sob várias condições
- ⚡ **Testes de Desempenho:** Avalia a eficiência da API, focando em tempos de resposta, capacidade de carga e taxas de erro sob tráfego alto
- 🔒 **Testes de Segurança:** Avalia os mecanismos de defesa da API contra acesso não autorizado, violações de dados e vulnerabilidades
- 🔗 **Testes de Integração:** Garante que a API se integre perfeitamente com outros serviços, plataformas e dados, proporcionando uma experiência de usuário coesa

> 💡 **Insight Chave:** Os testes de API são cruciais devido à sua capacidade de identificar problemas precocemente no ciclo de desenvolvimento, oferecendo uma abordagem mais econômica e simplificada para garantir qualidade e segurança do software.

## ✅ Pré-requisitos

Este artigo é baseado diretamente nos conceitos dos artigos anteriores. Para aproveitá-lo ao máximo, você deve ter:

- Framework Playwright Inicializado
- User Snippets Criados
- Variáveis de Ambiente Configuradas
- Design Pattern Configurado
- POM como Fixture e Sessão de Autenticação de Usuário Implementados
- Testes de UI Implementados

---

## 🛠️ Implementar API Fixtures

### 📦 Instalar Pacote zod

Zod é uma biblioteca de declaração e validação de esquema com TypeScript em primeiro lugar que fornece uma maneira poderosa e elegante de garantir integridade de dados em toda a sua aplicação! 🎯 Ao contrário das bibliotecas de validação tradicionais que se concentram apenas na validação em tempo de execução, Zod se integra perfeitamente com TypeScript, oferecendo verificações em tempo de compilação e inferência de tipo.

> 🎭 **Por que Zod?** Combina a segurança em tempo de compilação do TypeScript com validação em tempo de execução - o melhor dos dois mundos!

```bash
npm install zod
```

### 📁 Criar Pasta 'api' no Diretório de Fixtures

Este será o hub central onde implementamos fixtures de API e validação de esquema! 🏗️

> 🗂️ **Dica de Organização:** Manter código relacionado à API em uma pasta dedicada melhora a manutenibilidade e organização do código.

### 🔧 Criar Arquivo 'plain-function.ts'

Neste arquivo, vamos encapsular o processo de solicitação de API, gerenciando todas as preparações necessárias antes da solicitação ser enviada e processando ações necessárias após a resposta ser obtida! ⚙️

> 💡 **Padrão de Design:** Esta função auxiliar abstrai a complexidade das solicitações de API, tornando seus testes mais limpos e mais mantíveis.

```typescript
import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Auxiliar simplificado para fazer solicitações de API e retornar o status e corpo JSON.
 * Este auxiliar executa automaticamente a solicitação com base no método, URL, corpo e headers fornecidos.
 */
export async function apiRequest({
    request,
    method,
    url,
    baseUrl,
    body = null,
    headers,
}: {
    request: APIRequestContext;
    method: 'POST' | 'GET' | 'PUT' | 'DELETE';
    url: string;
    baseUrl?: string;
    body?: Record<string, unknown> | null;
    token?: string;
}): Promise<{ status: number; body: unknown }> {
    let response: APIResponse;

    const options: {
        data?: Record<string, unknown> | null;
        headers?: Record<string, string>;
    } = {};
    
    if (body) options.data = body;
    
    if (token) {
        options.headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    } else {
        options.headers = {
            'Content-Type': 'application/json',
        };
    }

    const fullUrl = baseUrl ? `${baseUrl}${url}` : url;

    switch (method.toUpperCase()) {
        case 'POST':
            response = await request.post(fullUrl, options);
            break;
        case 'GET':
            response = await request.get(fullUrl, options);
            break;
        case 'PUT':
            response = await request.put(fullUrl, options);
            break;
        case 'DELETE':
            response = await request.delete(fullUrl, options);
            break;
        default:
            throw new Error(`Método HTTP não suportado: ${method}`);
    }

    const status = response.status();
    let bodyData: unknown = null;
    const contentType = response.headers()['content-type'] || '';

    try {
        if (contentType.includes('application/json')) {
            bodyData = await response.json();
        } else if (contentType.includes('text/')) {
            bodyData = await response.text();
        }
    } catch (err) {
        console.warn(
            `Falha ao analisar corpo da resposta para status ${status}: ${err}`
        );
    }

    return { status, body: bodyData };
}
```

---

## 📋 Criar Arquivo schemas.ts

Neste arquivo vamos definir todos os esquemas utilizando a poderosa biblioteca de validação de esquema Zod! 🎯

> 🛡️ **Benefícios do Esquema:** Esquemas garantem consistência de dados e detectam incompatibilidades de tipo cedo, prevenindo erros em tempo de execução.

```typescript
import { z } from 'zod';

export const UserSchema = z.object({
    user: z.object({
        email: z.string().email(),
        username: z.string(),
        bio: z.string().nullable(),
        image: z.string().nullable(),
        token: z.string(),
    }),
});

export const ErrorResponseSchema = z.object({
    errors: z.object({
        email: z.array(z.string()).optional(),
        username: z.array(z.string()).optional(),
        password: z.array(z.string()).optional(),
    }),
});

export const ArticleResponseSchema = z.object({
    article: z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        body: z.string(),
        tagList: z.array(z.string()),
        createdAt: z.string(),
        updatedAt: z.string(),
        favorited: z.boolean(),
        favoritesCount: z.number(),
        author: z.object({
            username: z.string(),
            bio: z.string().nullable(),
            image: z.string(),
            following: z.boolean(),
        }),
    }),
});
```

---

## 🔍 Criar Arquivo types-guards.ts

Neste arquivo, estamos especificando os tipos essenciais para API Fixtures, bem como os tipos correspondentes a várias respostas de API que antecipamos encontrar durante os testes! 📊 Estamos usando padrões avançados como Zod, `z.infer` e `typeof`

> 🎯 **Poder do TypeScript:** Tipagem forte ajuda a detectar erros em tempo de compilação e fornece excelente suporte de IDE com autocompletar.

```typescript
import { z } from 'zod';
import type {
    UserSchema,
    ErrorResponseSchema,
    ArticleResponseSchema,
} from './schemas';

/**
 * Parâmetros para fazer uma solicitação de API.
 */
export type ApiRequestParams = {
    method: 'POST' | 'GET' | 'PUT' | 'DELETE';
    url: string;
    baseUrl?: string;
    body?: Record<string, unknown> | null;
    headers?: string;
};

/**
 * Resposta de uma solicitação de API.
 */
export type ApiRequestResponse<T = unknown> = {
    status: number;
    body: T;
};

// Definir a assinatura da função como um tipo
export type ApiRequestFn = <T = unknown>(
    params: ApiRequestParams
) => Promise<ApiRequestResponse<T>>;

// Agrupando todos juntos
export type ApiRequestMethods = {
    apiRequest: ApiRequestFn;
};

export type User = z.infer<typeof UserSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;
```

---

## 🎭 Criar Arquivo api-request-fixtures.ts

Neste arquivo estendemos a fixture de teste do Playwright para implementar nossa fixture de API personalizada! 🚀 Contamos com Genéricos para torná-lo reutilizável.

> 🔧 **Padrão de Fixture:** Fixtures personalizadas permitem que você injete dependências e código de configuração em seus testes de forma limpa e reutilizável.

```typescript
import { test as base } from '@playwright/test';
import { apiRequest as apiRequestOriginal } from './plain-function';
import {
    ApiRequestFn,
    ApiRequestMethods,
    ApiRequestParams,
    ApiRequestResponse,
} from './types-guards';

export const test = base.extend<ApiRequestMethods>({
    /**
     * Fornece uma função para fazer solicitações de API.
     */
    apiRequest: async ({ request }, use) => {
        const apiRequestFn: ApiRequestFn = async <T = unknown>({
            method,
            url,
            baseUrl,
            body = null,
            headers,
        }: ApiRequestParams): Promise<ApiRequestResponse<T>> => {
            const response = await apiRequestOriginal({
                request,
                method,
                url,
                baseUrl,
                body,
                headers,
            });

            return {
                status: response.status,
                body: response.body as T,
            };
        };

        await use(apiRequestFn);
    },
});
```

---

## 🔄 Atualizar Arquivo test-options.ts

Precisamos adicionar as fixtures de API ao arquivo, para que possamos usá-las em nossos casos de teste! 🎯

> 🔗 **Integração:** Mesclar fixtures permite que você use tanto page objects quanto utilitários de API no mesmo teste perfeitamente.

```typescript
import { test as base, mergeTests, request } from '@playwright/test';
import { test as pageObjectFixture } from './page-object-fixture';
import { test as apiRequestFixture } from '../api/api-request-fixture';

const test = mergeTests(pageObjectFixture, apiRequestFixture);

const expect = base.expect;
export { test, expect, request };
```

---

## 🎯 Próximos Passos?

No próximo artigo, vamos implementar [**Testes de API**](08_implementar_api_tests.md) - colocando nossas fixtures para trabalhar com cenários de teste reais! 🚀
