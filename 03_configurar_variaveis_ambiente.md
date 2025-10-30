# Configuração de Variáveis de Ambiente

## ✅ Pré-requisitos

Este artigo é baseado diretamente nos conceitos dos artigos anteriores. Para aproveitá-lo ao máximo, você deve ter:

- Framework Playwright Inicializado
- User Snippets Criados

---

## 📦 Instalando dotenv

Primeiro, vamos instalar o pacote dotenv para gerenciar nossas variáveis de ambiente:

```bash
npm install dotenv
npm install --save-dev @types/dotenv
```

> 💡 **Dica Profissional:** O pacote `@types/dotenv` fornece suporte TypeScript para uma melhor experiência de desenvolvimento

---

## 📁 Criar Estrutura de Arquivos de Ambiente

### Etapa 1: Criar Pasta de Ambiente

No diretório raiz do seu projeto, crie uma pasta `env` e arquivos `.env.environmentName` separados:

```
project-root/
├── env/
│   ├── .env.dev
│   ├── .env.staging  
│   ├── .env.prod
│   └── .env.example
├── tests/
└── playwright.config.ts
```

### Etapa 2: Definir Variáveis de Ambiente

Crie seus arquivos específicos de ambiente com a seguinte estrutura:

#### 📄 .env.dev

```env
URL=https://conduit.bondaracademy.com/
API_URL=https://conduit-api.bondaracademy.com/
USER_NAME=yourDevName
EMAIL=dev@example.com
PASSWORD=yourDevPassword
```

#### 📄 .env.staging

```env
URL=https://staging.conduit.bondaracademy.com/
API_URL=https://staging-api.conduit.bondaracademy.com/
USER_NAME=yourStagingName
EMAIL=staging@example.com
PASSWORD=yourStagingPassword
```

#### 📄 .env.example (Arquivo modelo)

```env
URL=
API_URL=
USER_NAME=
EMAIL=
PASSWORD=
```

> ⚠️ **Importante:** Mantenha valores diferentes para cada ambiente para garantir o isolamento adequado. Apenas a URL dev está funcionando, arquivos para outros ambientes são apenas para fins de demonstração.

---

## 🔒 Excluir Arquivos de Ambiente do Controle de Versão

### Etapa 1: Atualizar .gitignore

Adicione as seguintes linhas ao seu arquivo `.gitignore`:

```gitignore
# Arquivos de ambiente
.env.*
!.env.example
```

> 🛡️ **Melhor Prática de Segurança:** Nunca faça commit de arquivos de ambiente reais no controle de versão. Apenas faça commit do template `.env.example`

---

## ⚙️ Configurar Utilização de Ambiente

### Etapa 1: Importar dotenv em playwright.config.ts

Adicione a importação no topo do seu arquivo `playwright.config.ts`:

```typescript
import dotenv from 'dotenv';
```

### Etapa 2: Configurar Carregamento de Ambiente

Adicione esta lógica de configuração ao seu `playwright.config.ts`:

```typescript
// Determinar qual arquivo de ambiente carregar
const environmentPath = process.env.ENVIRONMENT 
    ? `./env/.env.${process.env.ENVIRONMENT}`
    : `./env/.env.dev`; // Padrão para ambiente dev

// Carregar as variáveis de ambiente
dotenv.config({
    path: environmentPath,
});
```

#### 💡 Como funciona:

- Se `ENVIRONMENT` estiver definido, carrega `.env.{ENVIRONMENT}`
- Se não estiver definido, usa por padrão `.env.dev`

---

## 🎮 Usando Variáveis de Ambiente

### Etapa 1: Definir Ambiente (Opcional)

Para usar um ambiente específico, defina a variável de ambiente antes de executar os testes:

**Windows (PowerShell):**

```powershell
$env:ENVIRONMENT='staging'
```

**macOS/Linux:**

```bash
export ENVIRONMENT=staging
```

### Etapa 2: Verificar Configuração de Ambiente

Verifique qual ambiente está ativo:

**Windows:**

```powershell
echo $env:ENVIRONMENT
```

**macOS/Linux:**

```bash
echo $ENVIRONMENT
```

### Etapa 3: Acessar Variáveis nos Testes

Use variáveis de ambiente em seus arquivos de teste:

```typescript
// Uso básico
const url = process.env.URL;
const apiUrl = process.env.API_URL;

// Com segurança de tipo e valores padrão
const baseUrl = process.env.URL || 'http://localhost:3000';
const username = process.env.USER_NAME || 'defaultUser';
```

---

## 🎯 Próximos Passos?

No próximo artigo, vamos mergulhar em [**Design Patterns**](04_setup_design_pattern.md)
