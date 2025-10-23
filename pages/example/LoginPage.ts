import { Page, Locator, expect } from '@playwright/test';

/**
 * Esse é o objeto da página de Login.
 * @export
 * @class LoginPage
 * @typedef {LoginPage}
 */
export class LoginPage {
  constructor(private page: Page) {}

  // ################## Elementos ##################

  // Container principal
  get container(): Locator {
    return this.page.locator('.login-container, [data-testid="login-container"]');
  }

  get formulario(): Locator {
    return this.page.locator('.login-form, [data-testid="login-form"]');
  }

  // Título
  get titulo(): Locator {
    return this.page.locator('h1, .login-title, [data-testid="login-title"]');
  }

  // Campos de entrada
  get emailInput(): Locator {
    return this.page
      .getByLabel(/email/i)
      .or(this.page.getByPlaceholder(/email/i));
  }

  get senhaInput(): Locator {
    return this.page
      .getByLabel(/senha|password/i)
      .or(this.page.getByPlaceholder(/senha|password/i));
  }

  // Botões
  get botaoEntrar(): Locator {
    return this.page.getByRole('button', { name: /entrar|login|sign in/i });
  }

  get botaoEsqueciSenha(): Locator {
    return this.page.getByRole('link', { name: /esqueci|forgot|esqueceu/i });
  }

  // Links
  get linkCadastro(): Locator {
    return this.page.getByRole('link', {
      name: /cadastrar|register|criar conta/i,
    });
  }

  // Mensagens de feedback
  get mensagemErro(): Locator {
    return this.page.locator(
      '.error-message, .alert-error, [data-testid="error-message"]'
    );
  }

  get mensagemSucesso(): Locator {
    return this.page.locator(
      '.success-message, .alert-success, [data-testid="success-message"]'
    );
  }

  // Loading
  get indicadorCarregamento(): Locator {
    return this.page.locator('.loading, .spinner, [data-testid="loading"]');
  }

  // ################## Métodos ##################

  /**
   * Acessa a página de login.
   */
  async acessar(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Realiza login com email e senha.
   * @param email Email do usuário
   * @param senha Senha do usuário
   */
  async fazerLogin(email: string, senha: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.senhaInput.fill(senha);
    await this.botaoEntrar.click();
  }

  /**
   * Preenche apenas o campo de email.
   * @param email Email a ser preenchido
   */
  async preencherEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Preenche apenas o campo de senha.
   * @param senha Senha a ser preenchida
   */
  async preencherSenha(senha: string): Promise<void> {
    await this.senhaInput.fill(senha);
  }

  /**
   * Clica no botão de entrar.
   */
  async clicarEntrar(): Promise<void> {
    await this.botaoEntrar.click();
  }

  /**
   * Clica no link de cadastro.
   */
  async irParaCadastro(): Promise<void> {
    await this.linkCadastro.click();
  }

  /**
   * Clica no link de esqueci a senha.
   */
  async irParaRecuperarSenha(): Promise<void> {
    await this.botaoEsqueciSenha.click();
  }

  /**
   * Limpa todos os campos do formulário.
   */
  async limparFormulario(): Promise<void> {
    await this.emailInput.clear();
    await this.senhaInput.clear();
  }

  /**
   * Verifica se o login foi bem-sucedido.
   */
  async verificarLoginSucesso(): Promise<void> {
    await expect(this.mensagemSucesso).toBeVisible();
  }

  /**
   * Verifica se há mensagem de erro.
   */
  async verificarErroLogin(): Promise<void> {
    await expect(this.mensagemErro).toBeVisible();
  }

  /**
   * Obtém o texto da mensagem de erro.
   */
  async obterMensagemErro(): Promise<string> {
    return await this.mensagemErro.innerText();
  }

  /**
   * Obtém o texto da mensagem de sucesso.
   */
  async obterMensagemSucesso(): Promise<string> {
    return await this.mensagemSucesso.innerText();
  }

  /**
   * Verifica se o formulário está carregando.
   */
  async estaCarregando(): Promise<boolean> {
    return await this.indicadorCarregamento.isVisible();
  }

  /**
   * Aguarda o carregamento terminar.
   */
  async aguardarCarregamento(): Promise<void> {
    await expect(this.indicadorCarregamento).toBeHidden();
  }

  /**
   * Verifica se o botão de entrar está habilitado.
   */
  async botaoEntrarEstaHabilitado(): Promise<boolean> {
    return await this.botaoEntrar.isEnabled();
  }

  /**
   * Verifica se o campo de email está vazio.
   */
  async emailEstaVazio(): Promise<boolean> {
    const valor = await this.emailInput.inputValue();
    return valor === '';
  }

  /**
   * Verifica se o campo de senha está vazio.
   */
  async senhaEstaVazia(): Promise<boolean> {
    const valor = await this.senhaInput.inputValue();
    return valor === '';
  }

  /**
   * Obtém o valor do campo de email.
   */
  async obterValorEmail(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  /**
   * Obtém o valor do campo de senha.
   */
  async obterValorSenha(): Promise<string> {
    return await this.senhaInput.inputValue();
  }

  /**
   * Verifica se a página de login está visível.
   */
  async estaVisivel(): Promise<boolean> {
    return await this.container.isVisible();
  }

  /**
   * Aguarda a página de login aparecer.
   */
  async aguardarAparecer(): Promise<void> {
    await expect(this.container).toBeVisible();
  }

  /**
   * Verifica se o usuário está logado (procura por elementos que indicam login).
   */
  async usuarioEstaLogado(): Promise<boolean> {
    const indicadores = [
      this.page.getByText(/bem-vindo|welcome/i),
      this.page.getByText(/dashboard|painel/i),
      this.page.locator('[data-testid="user-menu"]'),
      this.page.locator('.user-avatar, .profile-picture'),
    ];

    for (const indicador of indicadores) {
      if (await indicador.isVisible()) {
        return true;
      }
    }
    return false;
  }
}
