No mundo dos testes automatizados, consistência é rei. Quando você está trabalhando em uma equipe, é fácil para diferentes estilos de codificação e pequenos erros se infiltrarem na base de código. Isso leva a código bagunçado, testes quebrados e revisões de código frustrantes. Mas e se você pudesse aplicar automaticamente padrões de qualidade antes que código ruim seja commitado?

Ao final deste tutorial, você terá um sistema totalmente automatizado que faz lint, formata e valida seu código toda vez que você tentar fazer commit.


## 🛠️O Time dos Sonhos: Nossas Ferramentas Explicadas
Vamos usar uma combinação poderosa de quatro ferramentas para criar nossa rede de segurança pré-commit. Aqui está um rápido resumo do que cada uma faz:

- **ESLint 🧐**: Uma ferramenta de análise estática que escaneia seu código para encontrar e relatar padrões, bugs potenciais e erros estilísticos com base em um conjunto configurável de regras.
- **Prettier ✨**: Um formatador de código opinativo. Ele impõe um estilo consistente analisando seu código e reimprimindo-o com suas próprias regras, economizando debates de formatação.
- **Husky 🐕‍🦺**: Uma ferramenta que torna incrivelmente simples trabalhar com Git hooks. Vamos usá-lo para configurar um hook "pre-commit", que é um script que roda logo antes de um commit ser finalizado.
- **lint-staged 🚫**: O parceiro perfeito para o Husky. Ele permite que você execute linters e formatadores apenas contra os arquivos que foram staged no Git, tornando o processo rápido e eficiente.

Agora, vamos integrá-los ao seu projeto Playwright.

## 🪜Guia de Implementação Passo a Passo
Siga estes passos cuidadosamente para construir suas verificações automatizadas.

### Etapa 1: 📦Instalar Suas Dependências
Primeiro, precisamos adicionar nossas novas ferramentas ao projeto. Abaixo está o comando que instalará todas as dependências para nosso caso:

```bash
npm install --save-dev @typescript-eslint/eslint-plugin@^8.34.1 @typescript-eslint/parser@^8.34.1 eslint@^9.29.0 eslint-config-prettier@^10.1.5 eslint-define-config@^2.1.0 eslint-plugin-playwright@^2.2.0 eslint-plugin-prettier@^5.5.0 husky@^9.1.7 jiti@^2.4.2 lint-staged@^16.1.2
```

Abra seu arquivo package.json e verifique os seguintes pacotes em suas devDependencies (provavelmente suas versões serão mais recentes):

```json
"devDependencies": {
        "@playwright/test": "^1.53.2",
        "@types/node": "^24.0.12",
        "@typescript-eslint/eslint-plugin": "^8.36.0",
        "@typescript-eslint/parser": "^8.36.0",
        "eslint": "^9.30.1",
        "eslint-config-prettier": "^10.1.5",
        "eslint-define-config": "^2.1.0",
        "eslint-plugin-playwright": "^2.2.0",
        "eslint-plugin-prettier": "^5.5.1",
        "husky": "^9.1.7",
        "jiti": "^2.4.2",
        "lint-staged": "^16.1.2"
    }
```

### Etapa 2: ✨Configurar Prettier para Formatação Consistente
**Instale a extensão Prettier no seu IDE:**
- Prettier

**Altere as opções "Default Formatter" e "Format On Save" no seu IDE:**
- Pressione `Ctrl + Shift + P` e digite "Preferences: Open Settings (UI)"
- Abra e na barra de pesquisa, digite "format:"
- Faça as alterações necessárias para habilitar formatação automática

Crie um novo arquivo no diretório raiz do seu projeto chamado `.prettierrc`. Este arquivo informa ao Prettier como você quer que seu código seja formatado.

```json
{
    "semi": true,
    "tabWidth": 4,
    "useTabs": false,
    "printWidth": 80,
    "singleQuote": true,
    "trailingComma": "es5",
    "bracketSpacing": true,
    "arrowParens": "always",
    "proseWrap": "preserve"
}
```

**Explicação de cada opção do Prettier:**

- **`semi`**: (true) Sempre adicione um ponto e vírgula no final de cada declaração.
- **`tabWidth`**: (4) Use 4 espaços por nível de indentação.
- **`useTabs`**: (false) Indente linhas com espaços em vez de tabs.
- **`printWidth`**: (80) Quebra linhas em 80 caracteres para melhor legibilidade.
- **`singleQuote`**: (true) Use aspas simples em vez de aspas duplas sempre que possível.
- **`trailingComma`**: ("es5") Adicione vírgulas finais onde for válido em ES5 (objetos, arrays, etc.).
- **`bracketSpacing`**: (true) Imprima espaços entre colchetes em objetos literais (por exemplo, `{ foo: bar }`).
- **`arrowParens`**: ("always") Sempre inclua parênteses ao redor de parâmetros de arrow function, mesmo se houver apenas um parâmetro.
- **`proseWrap`**: ("preserve") Não altere a quebra em texto markdown; respeite as quebras de linha da entrada.

### Etapa 3: 📝Configurar Seu TypeScript
Se você ainda não tem um, crie um arquivo `tsconfig.json` no seu diretório raiz. Este arquivo especifica os arquivos raiz e as opções de compilador necessárias para compilar um projeto TypeScript.

```json
{
    "compilerOptions": {
        "target": "ESNext",
        "module": "NodeNext",
        "lib": ["ESNext", "DOM"],
        "moduleResolution": "NodeNext",
        "esModuleInterop": true,
        "allowJs": true,
        "checkJs": false,
        "outDir": "./dist",
        "rootDir": ".",
        "strict": true,
        "noImplicitAny": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "types": ["node", "playwright"]
    },
    "include": [
        "*.ts",
        "*.mts",
        "tests/**/*.ts",
        "fixtures/**/*.ts",
        "pages/**/*.ts",
        "helpers/**/*.ts",
        "enums/**/*.ts"
    ],
    "exclude": ["node_modules", "dist", "playwright-report", "test-results"]
}
```

Os arrays `include` e `exclude` são cruciais aqui—eles dizem ao compilador TypeScript exatamente quais arquivos verificar e quais ignorar.

### Etapa 4: 📖Criar o Livro de Regras do ESLint
É aqui que a mágica acontece. Crie um arquivo chamado `eslint.config.mts` no seu diretório raiz. Este arquivo conterá todas as regras para garantir a qualidade do código.

```typescript
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import playwright from 'eslint-plugin-playwright';

const prettierConfig = {
    semi: true,
    tabWidth: 4,
    useTabs: false,
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    arrowParens: 'always',
    proseWrap: 'preserve',
};

const config = [
    {
        ignores: ['node_modules', 'dist', 'playwright-report', 'test-results'],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: ['./tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            prettier: prettierPlugin,
            playwright,
        },
        rules: {
            ...((tseslint.configs.recommended as any).rules ?? {}),
            ...((playwright.configs['flat/recommended'] as any).rules ?? {}),
            'prettier/prettier': ['error', prettierConfig],
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            'no-console': 'error',
            'prefer-const': 'error',
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            'playwright/missing-playwright-await': 'error',
            'playwright/no-page-pause': 'error',
            'playwright/no-useless-await': 'error',
            'playwright/no-skipped-test': 'error',
        },
    },
];

export default config;
```

**O que todas essas regras fazem?**

Sua configuração ESLint impõe um conjunto abrangente de melhores práticas e padrões de qualidade de código. Aqui está o que cada parte faz:

- **`...tseslint.configs.recommended`**: Este preset do `@typescript-eslint` habilita uma ampla gama de regras que detectam bugs comuns e más práticas em código TypeScript. Ele impõe coisas como evitar tipos `any` inseguros, prevenir variáveis não usadas, exigir uso adequado de promises e muito mais. Essas regras ajudam a garantir que seu código TypeScript seja robusto, mantível e menos propenso a erros.

- **`...playwright.configs['flat/recommended']`**: Este preset do `eslint-plugin-playwright` impõe melhores práticas para código de teste Playwright. Ele detecta erros como `await` ausente em ações do Playwright, uso de anotações de teste proibidas (como `.only` ou `.skip`), seletores inseguros e muito mais. Isso ajuda a manter seus testes confiáveis e consistentes.

- **`'prettier/prettier': ['error', prettierConfig]`**: Impõe formatação de código de acordo com suas configurações Prettier. Quaisquer problemas de formatação serão relatados como erros, garantindo um estilo de código consistente em todo o seu projeto.

- **`'@typescript-eslint/explicit-function-return-type': 'error'`**: Exige que todas as funções tenham um tipo de retorno explícito. Isso melhora a legibilidade do código e ajuda a detectar bugs onde uma função pode retornar um tipo inesperado.

- **`'@typescript-eslint/no-explicit-any': 'error'`**: Não permite o uso do tipo `any`. Isso garante que você use tipos mais precisos, tornando seu código mais seguro e fácil de manter.

- **`'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]`**: Previne variáveis não usadas e argumentos de função, exceto aqueles começando com um underscore (que geralmente são intencionalmente não usados). Isso ajuda a manter seu código limpo e livre de desordem.

- **`'no-console': 'error'`**: Não permite `console.log` e declarações similares. Isso previne logging acidental em código de produção, que pode ser não profissional ou vazar informações sensíveis.

- **`'prefer-const': 'error'`**: Exige que variáveis que nunca são reatribuídas após declaração sejam declaradas com `const`. Isso ajuda a prevenir reatribuição acidental e torna a intenção do código mais clara.

- **`'@typescript-eslint/no-inferrable-types': 'error'`**: Não permite declarações de tipo explícitas para variáveis ou parâmetros inicializados com um número, string ou booleano. Isso mantém o código mais limpo e aproveita a inferência de tipo do TypeScript.

- **`'@typescript-eslint/no-empty-function': 'error'`**: Não permite funções vazias. Funções vazias são frequentemente um sinal de código incompleto ou placeholder e devem ser evitadas.

- **`'@typescript-eslint/no-floating-promises': 'error'`**: Exige que Promises sejam tratadas adequadamente (com `await` ou `.then()`). Isso previne rejeições de promise não tratadas e garante que código assíncrono seja confiável.

- **`'playwright/missing-playwright-await': 'error'`**: Garante que todas as ações do Playwright (como `page.click()`) sejam adequadamente aguardadas. Await ausente é uma causa comum de testes instáveis.

- **`'playwright/no-page-pause': 'error'`**: Não permite o uso de `page.pause()`, que é destinado a depuração e não deve ser deixado em código de teste commitado.

- **`'playwright/no-useless-await': 'error'`**: Previne uso desnecessário de `await` em métodos síncronos do Playwright, mantendo seu código limpo e eficiente.

- **`'playwright/no-skipped-test': 'error'`**: Não permite pular testes usando `.skip`. Isso garante que todos os testes sejam executados e nada seja acidentalmente deixado de fora.

**Como essas regras ajudam?**

Regras definidas como `'error'` bloquearão um commit, forçando você a corrigir o problema antes que seu código possa ser mesclado. Ao combinar essas regras, seu projeto está protegido contra erros comuns, code smells e estilos inconsistentes—tornando sua base de código mais confiável, legível e profissional.

### Etapa 5: 🔗Conectar as Ferramentas com lint-staged
Agora, vamos dizer ao `lint-staged` o que fazer. Adicione o seguinte bloco ao seu `package.json` no nível raiz (logo após as `devDependencies`):

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": [
    "npx eslint --fix",
    "npx prettier --write"
  ]
}
```

Esta configuração diz ao `lint-staged`: "Para qualquer arquivo TypeScript ou JavaScript staged, primeiro execute o ESLint para corrigir automaticamente o que puder, e então execute o Prettier para formatar o código."

### Etapa 6: 🐕‍🦺Automatizar o Gatilho com Husky
Finalmente, vamos fazer tudo isso rodar automaticamente antes de cada commit usando Husky.

Primeiro, inicialize o Husky:

```bash
npx husky init
```

Este comando cria um diretório `.husky` no seu projeto.

⚠️ Em seguida, remova todos os arquivos, exceto `_/pre-commit` e adicione o seguinte script a ele. Este é o hook que o Git executará.

Atualize o conteúdo do `_/pre-commit` para:

```bash
#!/bin/sh
npx lint-staged
```

Este pequeno script diz ao Git para executar `lint-staged` antes de cada commit. E é isso! Sua configuração está completa. 🎯

## 🚀Veja em Ação: 🤯Vamos Quebrar Algumas Regras

A melhor maneira de apreciar nossa nova rede de segurança é vê-la em ação. Vamos tentar fazer commit de algum código "ruim".

Crie um novo arquivo de teste chamado `tests/bad-test-example.spec.ts`. Cole o seguinte código, que viola intencionalmente várias de nossas regras:

```typescript
// tests/bad-test-example.spec.ts
import { test, expect } from '@playwright/test';

// Violação de regra: Sem tipo de retorno explícito
function addNumbers(a: number, b: number) {
    //Violação de regra: Sem tipo de retorno explícito
    const unusedVar = 'I do nothing'; // Violação de regra: Variável não usada
    return a + b;
}

test('bad example test', async ({ page }) => {
    console.log('This should not be here!'); // Violação de regra: no-console

    await page.goto('https://playwright.dev/');

    page.getByRole('button', { name: 'Get Started' }).click(); //Violação de regra: 'await' ausente para uma ação Playwright

    // Violação de regra: 'await' ausente para uma ação Playwright
    page.getByLabel('Search').click();

    await page.getByPlaceholder('Search docs').fill('assertions');

    // Violação de regra: Usando page.pause()
    await page.pause();

    await expect(page.getByText('Writing assertions')).toBeVisible(); //Violação de regra: 'await' ausente

    let result;
    await test.step('test', async () => {
        result = addNumbers(1, 2); //Violação de regra: no-explicit-any
    });
    console.log(result); //Violação de regra: no-console
});
```

Agora, tente fazer commit deste arquivo:

```bash
git add .
git commit -m "feat: add broken test file"
```

O que acontece? **Seu commit será REJEITADO!** 🛑

Você verá uma saída no seu terminal do ESLint, listando todos os erros que ele encontrou:

- 🚫 O erro `no-console`
- 🏷️ O tipo de retorno de função ausente
- ⏳ O `await` ausente em `page.getByRole('button', { name: 'Get Started' }).click();` e `page.getByLabel('Search').click();`
- ⏸️ O uso de `page.pause()`
- 🗑️ A variável não usada

✨ `lint-staged` impedirá que o commit seja concluído até que você corrija esses erros. O Prettier também pode ter corrigido alguns problemas de formatação automaticamente.

## O Retorno: Código Melhor, Equipes Mais Felizes
Você acabou de implementar um sistema poderoso e automatizado que age como um guardião para sua base de código. Esta pequena configuração fornece enormes benefícios a longo prazo:

- 🧹 **Melhor Qualidade de Código**: O código é mais limpo, mais legível e livre de erros comuns.
- 👥 **Aderir às Regras da Equipe**: Todos na equipe são automaticamente mantidos aos mesmos padrões de codificação, garantindo consistência em todo o projeto.
- ⚡ **Revisões de Código Mais Rápidas**: Os revisores podem se concentrar na lógica do código, não em problemas triviais de formatação ou estilo.

Ao aplicar esses padrões automaticamente, você libera energia mental para se concentrar no que realmente importa: escrever testes ótimos e confiáveis. 🧠

## 🏁Conclusão
Parabéns! 🎊 Você acabou de construir uma poderosa rede de segurança para seu projeto Playwright. Esta configuração garante que sua base de código permaneça limpa, legível e livre de erros comuns.