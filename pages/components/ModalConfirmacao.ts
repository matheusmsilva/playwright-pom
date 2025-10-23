import { Page, Locator, expect } from '@playwright/test';

/**
 * Esse é o objeto do componente de Modal de Confirmação.
 * @export
 * @class ModalConfirmacao
 */
export class ModalConfirmacao {
  constructor(private page: Page) {}

  // ################## Elementos ##################

  // Modal principal
  get modal(): Locator {
    return this.page.locator('[role="dialog"]');
  }

  get overlay(): Locator {
    return this.page.locator('.modal-overlay, .backdrop');
  }

  // Cabeçalho do modal
  get titulo(): Locator {
    return this.page.locator('.modal-title, [data-testid="modal-title"]');
  }

  get botaoFechar(): Locator {
    return this.page.locator('.modal-close, [aria-label="Close"]');
  }

  // Conteúdo do modal
  get conteudo(): Locator {
    return this.page.locator('.modal-body, [data-testid="modal-content"]');
  }

  get mensagem(): Locator {
    return this.page.locator('.modal-message, [data-testid="modal-message"]');
  }

  // Botões de ação
  get botaoConfirmar(): Locator {
    return this.page.getByRole('button', { name: /confirmar|sim|ok|aceitar/i });
  }

  get botaoCancelar(): Locator {
    return this.page.getByRole('button', { name: /cancelar|não|fechar/i });
  }

  get botaoConfirmarSecundario(): Locator {
    return this.page.locator('.btn-secondary, .btn-cancel');
  }

  get botaoConfirmarPrimario(): Locator {
    return this.page.locator('.btn-primary, .btn-confirm');
  }

  // ################## Métodos ##################

  /**
   * Verifica se o modal está visível.
   */
  async estaVisivel(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  /**
   * Aguarda o modal aparecer e verifica se está visível.
   */
  async aguardarAparecer(): Promise<void> {
    await expect(this.modal).toBeVisible();
  }

  /**
   * Aguarda o modal desaparecer.
   */
  async aguardarDesaparecer(): Promise<void> {
    await expect(this.modal).toBeHidden();
  }

  /**
   * Fecha o modal clicando no botão de fechar.
   */
  async fechar(): Promise<void> {
    await this.botaoFechar.click();
    await this.aguardarDesaparecer();
  }

  /**
   * Confirma a ação clicando no botão de confirmar.
   */
  async confirmar(): Promise<void> {
    await this.botaoConfirmar.click();
    await this.aguardarDesaparecer();
  }

  /**
   * Cancela a ação clicando no botão de cancelar.
   */
  async cancelar(): Promise<void> {
    await this.botaoCancelar.click();
    await this.aguardarDesaparecer();
  }

  /**
   * Fecha o modal clicando no overlay (fora do modal).
   */
  async fecharPorOverlay(): Promise<void> {
    await this.overlay.click({ position: { x: 10, y: 10 } });
    await this.aguardarDesaparecer();
  }

  /**
   * Verifica se o título do modal contém o texto esperado.
   * @param tituloEsperado Texto esperado no título
   */
  async verificarTitulo(tituloEsperado: string): Promise<void> {
    await expect(this.titulo).toContainText(tituloEsperado);
  }

  /**
   * Verifica se a mensagem do modal contém o texto esperado.
   * @param mensagemEsperada Texto esperado na mensagem
   */
  async verificarMensagem(mensagemEsperada: string): Promise<void> {
    await expect(this.mensagem).toContainText(mensagemEsperada);
  }

  /**
   * Obtém o texto do título do modal.
   */
  async obterTitulo(): Promise<string> {
    return await this.titulo.innerText();
  }

  /**
   * Obtém o texto da mensagem do modal.
   */
  async obterMensagem(): Promise<string> {
    return await this.mensagem.innerText();
  }

  /**
   * Verifica se o botão de confirmar está habilitado.
   */
  async botaoConfirmarEstaHabilitado(): Promise<boolean> {
    return await this.botaoConfirmar.isEnabled();
  }

  /**
   * Verifica se o botão de cancelar está habilitado.
   */
  async botaoCancelarEstaHabilitado(): Promise<boolean> {
    return await this.botaoCancelar.isEnabled();
  }

  /**
   * Fecha o modal usando a tecla Escape.
   */
  async fecharComEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.aguardarDesaparecer();
  }

  /**
   * Confirma a ação usando a tecla Enter.
   */
  async confirmarComEnter(): Promise<void> {
    await this.botaoConfirmar.focus();
    await this.page.keyboard.press('Enter');
    await this.aguardarDesaparecer();
  }

  /**
   * Verifica se o modal tem a classe CSS especificada.
   * @param classeCSS Nome da classe CSS
   */
  async temClasseCSS(classeCSS: string): Promise<boolean> {
    return await this.modal.evaluate((element, className) => {
      return element.classList.contains(className);
    }, classeCSS);
  }
}
