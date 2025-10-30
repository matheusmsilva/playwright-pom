# Como Criar User Snippets

## ✅ Pré-requisitos

Este artigo é baseado diretamente nos conceitos do primeiro artigo. Para aproveitá-lo ao máximo, você deve ter:

- Framework Playwright Inicializado

---

## 🛠️ Como Criar User Snippets

### Etapa 1: Acessar Configuração de Snippets

> 📝 **Nota:** As instruções funcionam tanto para VS Code quanto para Windsurf

1. **Abra a Paleta de Comandos:** `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (Mac)
2. **Pesquise por:** `Preferences: Configure User Snippets`
3. **Selecione:** `New Global Snippets file...`
4. **Nomeie seu arquivo:** `playwright-snippets.json`

### Etapa 2: Entendendo a Estrutura dos Snippets

Cada snippet segue esta estrutura JSON:

```json
{
  "Nome do Snippet": {
    "scope": "typescript",
    "prefix": "palavra-gatilho",
    "body": [
      "linha 1 de código",
      "linha 2 de código",
      "$1 // posição do cursor"
    ],
    "description": "O que este snippet faz"
  }
}
```

#### 🔍 Componentes Principais:

- **scope:** Linguagem onde o snippet funciona (typescript, javascript, etc.)
- **prefix:** O que você digita para acionar o snippet
- **body:** O template de código real (array de strings)
- **description:** Descrição útil para o snippet

---

## 🎯 Snippets Essenciais do Playwright

```json
{
    "Print to Console": {
        "scope": "javascript,typescript",
        "prefix": "cl",
        "body": [
            "console.log(${1});",
        ],
        "description": "Registrar saída no console"
    },
    "Playwright Describe": {
        "scope": "javascript,typescript",
        "prefix": "pwd",
        "body": [
            "test.describe('${1}', () => {${2}});",
        ],
        "description": "Gerar uma função describe do Playwright"
    },
    "Playwright Test": {
        "scope": "javascript,typescript",
        "prefix": "pwt",
        "body": [
            "test('${1}',{tag:'@${2}'}, async ({ ${3} }) => {${4}});",
        ],
        "description": "Gerar uma função de teste do Playwright"
    },
    "Playwright Test Step": {
        "scope": "javascript,typescript",
        "prefix": "pwts",
        "body": [
            "await test.step('${1}', async () => {${2}});",
        ],
        "description": "Gerar uma função de etapa de teste do Playwright"
    },
    "Expect toBeVisible": {
        "scope": "javascript,typescript",
        "prefix": "exv",
        "body": [
            "await expect(${1}).toBeVisible();",
        ],
        "description": "Gerar código expect locator to be visible"
    },
    "Expect toEqual": {
        "scope": "javascript,typescript",
        "prefix": "exe",
        "body": [
            "await expect(${1}).toEqual(${2});",
        ],
        "description": "Gerar expect value recebido para ser igual ao valor predefinido"
    },
    "Expect toHaveText": {
        "scope": "javascript,typescript",
        "prefix": "ext",
        "body": [
            "await expect(${1}).toHaveText(${2});",
        ],
        "description": "Gerar expect locator to have text predefinido"
    },
    "API Request": {
        "scope": "javascript,typescript",
        "prefix": "req",
        "body": [
            "const { status, body } = await apiRequest<${1}>({method:'${2}',url: '${3}', baseUrl: ${4}, body: ${5}, headers: ${6}}); expect(status).toBe(${7});",
        ],
        "description": "Gerar requisição de API"
    },
    "API Route": {
        "scope": "javascript,typescript",
        "prefix": "rou",
        "body": [
            "await page.route(`${1}`, async (route) => {await route.fulfill({status: 200, contentType: 'application/json',body: JSON.stringify(${2})});});"],
        "description": "Gerar rota de API"
    },
    "Environment Variable": {
        "scope": "javascript,typescript",
        "prefix": "pr",
        "body": [
            "process.env.${1}",
        ],
        "description": "Gerar variável de ambiente"
    },
    "Intercept API Response":{
        "scope": "javascript,typescript",
        "prefix": "int",
        "body": [
            "const interceptedResponse = await page.waitForResponse(`${${1}}${2}`); const interceptedResponseBody = await interceptedResponse.json(); const ${3} = interceptedResponseBody.${4};",
        ],
        "description": "Interceptar resposta da API"
    },
    "Class for Page Object Model":{
        "scope": "javascript,typescript",
        "prefix": "pom",
        "body": [
            "import { Page, Locator, expect } from '@playwright/test';",
            "/**",
            " * Este é o objeto de página para a Home Page.",
            " * @export",
            " * @class ${1}",
            " * @typedef {${1}}",
            " */",
            "export class ${1}{",
            "    constructor(private page: Page) {}",
            "",
            "    get ${2} (): Locator {return ${3}};",
            "}",
        ],
        "description": "Classe para Page Object Model"
    },
    "Getter for Class": {
        "scope": "javascript,typescript",
        "prefix": "ge",
        "body": [
            "get ${1}(): Locator {return this.page.${2};}",
        ],
        "description": "obter locator"
    }
}
```

---

## 💡 Dicas Profissionais para Snippets Eficazes

### ⚡ Impulsionadores de Produtividade:

#### 🎯 Use Prefixos Descritivos

Encontre os que funcionam melhor para você:

- `pwt` para testes Playwright
- `req` para requisição de API
- `exv` Asserção para ser visível

#### 📍 Posicionamento Estratégico do Cursor

Use `${1}`, `${2}`, `${3}` etc. para definir pontos de tabulação onde você irá inserir valores específicos:

```json
"body": [
  "test('${1}',{tag:'@${2}'}, async ({ ${3} }) => {${4}});"
  "});"
]
```

#### 🔄 Inclua Padrões Comuns

Crie snippets para:

- 🎭 **Código boilerplate** (blocos describe, test e test step)
- ✅ **Asserções** (expect)
- 🔍 **Requisição/Interceptação de API**

---

## 🚀 Benefícios dos User Snippets

User snippets são uma ferramenta poderosa para desenvolvedores que desejam:

- ⚡ **Aumentar a produtividade** - Reduzir digitação repetitiva
- 🎯 **Manter consistência** - Garantir alinhamento com padrões de codificação
- 📈 **Melhorar a qualidade do código** - Seguir as melhores práticas automaticamente
- 🚀 **Economizar tempo** - Inserir templates de código complexos instantaneamente

---

## 🎯 Próximos Passos?

No próximo artigo, vamos mergulhar em [**Variáveis de Ambiente**](03_configurar_variaveis_ambiente) - gerenciando configuração como um profissional!
