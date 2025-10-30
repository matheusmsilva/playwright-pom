# Configuração Inicial do Playwright

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados:

> ⚠️ **Importante:** Certifique-se de que todos os pré-requisitos estejam atendidos antes de prosseguir

- **Node.js** (versão 20.13.1 ou superior)
- **npm** (versão 10 ou superior)
- **IDE**

### 💻 IDEs Recomendadas

- 🌊 **Windsurf**
- ✨ **Visual Studio Code**
- 🖱️ **Cursor**

---

## 🛠️ Inicialização do Projeto Playwright

### Etapa 1: Inicializar Projeto

Para inicializar um novo projeto Playwright, execute o seguinte comando:

```bash
npm init playwright@latest
```

### Etapa 2: Opções de Configuração

> 💡 **Dica:** Recomendo usar as seguintes opções para uma configuração ideal

- **Linguagem** - TypeScript (padrão)
- **Pasta de Testes** - tests (padrão)
- **Adicionar workflow do Github Actions** - false (padrão)
- **Instalar navegadores do Playwright** - true (padrão)

### Etapa 3: Limpeza

Após a conclusão da instalação, você pode excluir com segurança o seguinte:

> 🗑️ **Limpeza:** Remova arquivos de exemplo para começar do zero

- 📁 Pasta `tests-examples`
- 📄 Arquivo `tests/example.spec.ts`

### Etapa 4: Instalar Navegadores do Playwright

Para instalar os navegadores do Playwright, execute o seguinte comando:

```bash
npx playwright install
```

---

## 🎯 Próximos Passos?

No próximo artigo, vamos mergulhar em [**User Snippets**](./02_criar_snippets.md) - sua arma secreta para produtividade!
