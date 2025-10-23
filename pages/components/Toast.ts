import { Page, Locator, expect } from '@playwright/test';

/**
 * Esse é o objeto do componente de Toast.
 * @export
 * @class Toast
 */
export class Toast {
  constructor(private page: Page) {}

  // ################## Elementos ##################

  // Container principal de toasts
  get container(): Locator {
    return this.page.locator('.toast-container, [data-testid="toast-container"]');
  }

  // Toast individual
  get toast(): Locator {
    return this.page.locator('.toast, [data-testid="toast"]').first();
  }

  get todosToasts(): Locator {
    return this.page.locator('.toast, [data-testid="toast"]');
  }

  // Conteúdo do toast
  get icone(): Locator {
    return this.page.locator('.toast-icon, [data-testid="toast-icon"]');
  }

  get titulo(): Locator {
    return this.page.locator('.toast-title, [data-testid="toast-title"]');
  }

  get mensagem(): Locator {
    return this.page.locator('.toast-message, [data-testid="toast-message"]');
  }

  get botaoFechar(): Locator {
    return this.page.locator('.toast-close, [data-testid="toast-close"]');
  }

  // Tipos de toast
  get toastSucesso(): Locator {
    return this.page.locator('.toast-success, [data-type="success"]');
  }

  get toastErro(): Locator {
    return this.page.locator('.toast-error, [data-type="error"]');
  }

  get toastAviso(): Locator {
    return this.page.locator('.toast-warning, [data-type="warning"]');
  }

  get toastInfo(): Locator {
    return this.page.locator('.toast-info, [data-type="info"]');
  }

  // ################## Métodos ##################

  /**
   * Verifica se existe pelo menos um toast visível.
   */
  async existeToast(): Promise<boolean> {
    return await this.toast.isVisible();
  }

  /**
   * Aguarda um toast aparecer.
   */
  async aguardarAparecer(): Promise<void> {
    await expect(this.toast).toBeVisible();
  }

  /**
   * Aguarda todos os toasts desaparecerem.
   */
  async aguardarDesaparecer(): Promise<void> {
    await expect(this.todosToasts).toBeHidden();
  }

  /**
   * Fecha o primeiro toast clicando no botão de fechar.
   */
  async fechar(): Promise<void> {
    await this.botaoFechar.click();
  }

  /**
   * Fecha todos os toasts visíveis.
   */
  async fecharTodos(): Promise<void> {
    const quantidade = await this.todosToasts.count();
    for (let i = 0; i < quantidade; i++) {
      if (await this.todosToasts.nth(i).isVisible()) {
        await this.todosToasts.nth(i).locator('.toast-close').click();
      }
    }
  }

  /**
   * Verifica se existe um toast de sucesso.
   */
  async existeToastSucesso(): Promise<boolean> {
    return await this.toastSucesso.isVisible();
  }

  /**
   * Verifica se existe um toast de erro.
   */
  async existeToastErro(): Promise<boolean> {
    return await this.toastErro.isVisible();
  }

  /**
   * Verifica se existe um toast de aviso.
   */
  async existeToastAviso(): Promise<boolean> {
    return await this.toastAviso.isVisible();
  }

  /**
   * Verifica se existe um toast de informação.
   */
  async existeToastInfo(): Promise<boolean> {
    return await this.toastInfo.isVisible();
  }

  /**
   * Obtém o texto da mensagem do primeiro toast.
   */
  async obterMensagem(): Promise<string> {
    return await this.mensagem.innerText();
  }

  /**
   * Obtém o texto do título do primeiro toast.
   */
  async obterTitulo(): Promise<string> {
    return await this.titulo.innerText();
  }

  /**
   * Verifica se a mensagem do toast contém o texto esperado.
   * @param mensagemEsperada Texto esperado na mensagem
   */
  async verificarMensagem(mensagemEsperada: string): Promise<void> {
    await expect(this.mensagem).toContainText(mensagemEsperada);
  }

  /**
   * Verifica se o título do toast contém o texto esperado.
   * @param tituloEsperado Texto esperado no título
   */
  async verificarTitulo(tituloEsperado: string): Promise<void> {
    await expect(this.titulo).toContainText(tituloEsperado);
  }

  /**
   * Conta quantos toasts estão visíveis.
   */
  async contarToasts(): Promise<number> {
    return await this.todosToasts.count();
  }

  /**
   * Aguarda um toast específico aparecer baseado no tipo.
   * @param tipo Tipo do toast (success, error, warning, info)
   */
  async aguardarToastPorTipo(
    tipo: 'success' | 'error' | 'warning' | 'info'
  ): Promise<void> {
    const seletor = `.toast-${tipo}, [data-type="${tipo}"]`;
    await expect(this.page.locator(seletor)).toBeVisible();
  }

  /**
   * Verifica se um toast específico contém determinado texto.
   * @param texto Texto a ser procurado
   */
  async verificarTextoExiste(texto: string): Promise<void> {
    await expect(this.todosToasts).toContainText([texto]);
  }

  /**
   * Aguarda um toast desaparecer automaticamente (baseado no timeout).
   * @param timeout Tempo máximo de espera em milissegundos
   */
  async aguardarDesaparecerAutomatico(timeout = 5000): Promise<void> {
    await this.page.waitForTimeout(timeout);
    await this.aguardarDesaparecer();
  }

  /**
   * Clica em um toast para interagir com ele (se for clicável).
   */
  async clicarToast(): Promise<void> {
    await this.toast.click();
  }

  /**
   * Verifica se o toast tem uma classe CSS específica.
   * @param classeCSS Nome da classe CSS
   */
  async temClasseCSS(classeCSS: string): Promise<boolean> {
    return await this.toast.evaluate((element, className) => {
      return element.classList.contains(className);
    }, classeCSS);
  }

  /**
   * Obtém o tipo do primeiro toast (success, error, warning, info).
   */
  async obterTipo(): Promise<string> {
    const classes = await this.toast.getAttribute('class');
    if (classes?.includes('success')) return 'success';
    if (classes?.includes('error')) return 'error';
    if (classes?.includes('warning')) return 'warning';
    if (classes?.includes('info')) return 'info';
    return 'unknown';
  }

  /**
   * Aguarda um toast com mensagem específica aparecer.
   * @param mensagem Mensagem esperada no toast
   */
  async aguardarToastComMensagem(mensagem: string): Promise<void> {
    await expect(this.todosToasts.filter({ hasText: mensagem })).toBeVisible();
  }
}
