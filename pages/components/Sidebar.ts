import { Page, Locator, expect } from '@playwright/test';

/**
 * Esse é o objeto do componente de Sidebar.
 * @export
 * @class Sidebar
 */
export class Sidebar {
  constructor(private page: Page) {}

  // ################## Elementos ##################

  // Sidebar principal
  get sidebar(): Locator {
    return this.page.locator('.sidebar, [data-testid="sidebar"]');
  }

  get overlay(): Locator {
    return this.page.locator('.sidebar-overlay, .backdrop');
  }

  // Cabeçalho da sidebar
  get cabecalho(): Locator {
    return this.page.locator('.sidebar-header, [data-testid="sidebar-header"]');
  }

  get titulo(): Locator {
    return this.page.locator('.sidebar-title, [data-testid="sidebar-title"]');
  }

  get botaoFechar(): Locator {
    return this.page.locator('.sidebar-close, [data-testid="sidebar-close"]');
  }

  // Conteúdo da sidebar
  get conteudo(): Locator {
    return this.page.locator('.sidebar-content, [data-testid="sidebar-content"]');
  }

  get corpo(): Locator {
    return this.page.locator('.sidebar-body, [data-testid="sidebar-body"]');
  }

  // Navegação principal
  get menu(): Locator {
    return this.page.locator('.sidebar-menu, [data-testid="sidebar-menu"]');
  }

  get itensMenu(): Locator {
    return this.page.locator(
      '.sidebar-menu-item, [data-testid="sidebar-menu-item"]'
    );
  }

  get linksMenu(): Locator {
    return this.page.locator('.sidebar-menu a, [data-testid="sidebar-menu"] a');
  }

  // Botão de toggle para abrir/fechar sidebar
  get botaoToggle(): Locator {
    return this.page.locator(
      '[data-testid="sidebar-toggle"], .sidebar-toggle, .menu-toggle'
    );
  }

  // Submenu e dropdowns
  get submenus(): Locator {
    return this.page.locator('.sidebar-submenu, [data-testid="sidebar-submenu"]');
  }

  get itensSubmenu(): Locator {
    return this.page.locator(
      '.sidebar-submenu-item, [data-testid="sidebar-submenu-item"]'
    );
  }

  get linksSubmenu(): Locator {
    return this.page.locator(
      '.sidebar-submenu a, [data-testid="sidebar-submenu"] a'
    );
  }

  // Ícones de navegação
  get iconesMenu(): Locator {
    return this.page.locator(
      '.sidebar-menu-icon, [data-testid="sidebar-menu-icon"]'
    );
  }

  get iconesSubmenu(): Locator {
    return this.page.locator(
      '.sidebar-submenu-icon, [data-testid="sidebar-submenu-icon"]'
    );
  }

  // Badges e contadores
  get badges(): Locator {
    return this.page.locator('.sidebar-badge, [data-testid="sidebar-badge"]');
  }

  get contadores(): Locator {
    return this.page.locator('.sidebar-counter, [data-testid="sidebar-counter"]');
  }

  // Separadores de seção
  get separadores(): Locator {
    return this.page.locator(
      '.sidebar-separator, [data-testid="sidebar-separator"]'
    );
  }

  // Grupos de menu
  get gruposMenu(): Locator {
    return this.page.locator(
      '.sidebar-menu-group, [data-testid="sidebar-menu-group"]'
    );
  }

  get titulosGrupos(): Locator {
    return this.page.locator(
      '.sidebar-group-title, [data-testid="sidebar-group-title"]'
    );
  }

  // ################## Métodos ##################

  /**
   * Verifica se a sidebar está visível.
   */
  async estaVisivel(): Promise<boolean> {
    return await this.sidebar.isVisible();
  }

  /**
   * Verifica se a sidebar está aberta (visível).
   */
  async estaAberta(): Promise<boolean> {
    return await this.sidebar.isVisible();
  }

  /**
   * Verifica se a sidebar está fechada.
   */
  async estaFechada(): Promise<boolean> {
    return !(await this.sidebar.isVisible());
  }

  /**
   * Aguarda a sidebar aparecer.
   */
  async aguardarAparecer(): Promise<void> {
    await expect(this.sidebar).toBeVisible();
  }

  /**
   * Aguarda a sidebar desaparecer.
   */
  async aguardarDesaparecer(): Promise<void> {
    await expect(this.sidebar).toBeHidden();
  }

  /**
   * Abre a sidebar clicando no botão de toggle.
   */
  async abrir(): Promise<void> {
    if (await this.botaoToggle.isVisible()) {
      await this.botaoToggle.click();
    }
    await this.aguardarAparecer();
  }

  /**
   * Fecha a sidebar clicando no botão de fechar.
   */
  async fechar(): Promise<void> {
    await this.botaoFechar.click();
    await this.aguardarDesaparecer();
  }

  /**
   * Fecha a sidebar clicando no overlay.
   */
  async fecharPorOverlay(): Promise<void> {
    await this.overlay.click({ position: { x: 10, y: 10 } });
    await this.aguardarDesaparecer();
  }

  /**
   * Fecha a sidebar usando a tecla Escape.
   */
  async fecharComEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.aguardarDesaparecer();
  }

  /**
   * Clica em um item do menu da sidebar.
   * @param nomeItem Nome ou texto do item do menu
   */
  async clicarItemMenu(nomeItem: string): Promise<void> {
    const item = this.page.getByRole('menuitem', { name: nomeItem });
    await item.click();
  }

  /**
   * Clica em um link do menu da sidebar.
   * @param textoLink Texto do link
   */
  async clicarLinkMenu(textoLink: string): Promise<void> {
    const link = this.linksMenu.filter({ hasText: textoLink });
    await link.click();
  }

  /**
   * Navega para um item específico do menu.
   * @param indiceItem Índice do item (0-based)
   */
  async navegarParaItem(indiceItem: number): Promise<void> {
    await this.itensMenu.nth(indiceItem).click();
  }

  /**
   * Conta quantos itens existem no menu principal.
   */
  async contarItensMenu(): Promise<number> {
    return await this.itensMenu.count();
  }

  /**
   * Conta quantos itens existem no submenu.
   */
  async contarItensSubmenu(): Promise<number> {
    return await this.itensSubmenu.count();
  }

  /**
   * Verifica se um item do menu está ativo/selecionado.
   * @param nomeItem Nome do item do menu
   */
  async itemMenuEstaAtivo(nomeItem: string): Promise<boolean> {
    const item = this.page.getByRole('menuitem', { name: nomeItem });
    return await item.evaluate((element) => {
      return (
        element.classList.contains('active') ||
        element.getAttribute('aria-current') === 'page'
      );
    });
  }

  /**
   * Obtém o texto de todos os itens do menu principal.
   */
  async obterItensMenu(): Promise<string[]> {
    const quantidade = await this.contarItensMenu();
    const itens: string[] = [];

    for (let i = 0; i < quantidade; i++) {
      const texto = await this.itensMenu.nth(i).innerText();
      itens.push(texto);
    }

    return itens;
  }

  /**
   * Obtém o texto de todos os itens do submenu.
   */
  async obterItensSubmenu(): Promise<string[]> {
    const quantidade = await this.contarItensSubmenu();
    const itens: string[] = [];

    for (let i = 0; i < quantidade; i++) {
      const texto = await this.itensSubmenu.nth(i).innerText();
      itens.push(texto);
    }

    return itens;
  }

  /**
   * Verifica se o título da sidebar contém o texto esperado.
   * @param tituloEsperado Texto esperado no título
   */
  async verificarTitulo(tituloEsperado: string): Promise<void> {
    await expect(this.titulo).toContainText(tituloEsperado);
  }

  /**
   * Obtém o texto do título da sidebar.
   */
  async obterTitulo(): Promise<string> {
    return await this.titulo.innerText();
  }

  /**
   * Expande um submenu (se houver botão de expansão).
   * @param nomeItem Nome do item que contém o submenu
   */
  async expandirSubmenu(nomeItem: string): Promise<void> {
    const item = this.page.getByRole('menuitem', { name: nomeItem });
    const botaoExpandir = item.locator('.submenu-toggle, .expand-icon');
    await botaoExpandir.click();
  }

  /**
   * Colapsa um submenu.
   * @param nomeItem Nome do item que contém o submenu
   */
  async colapsarSubmenu(nomeItem: string): Promise<void> {
    const item = this.page.getByRole('menuitem', { name: nomeItem });
    const botaoColapsar = item.locator('.submenu-toggle, .collapse-icon');
    await botaoColapsar.click();
  }

  /**
   * Verifica se um submenu está expandido.
   * @param nomeItem Nome do item que contém o submenu
   */
  async submenuEstaExpandido(nomeItem: string): Promise<boolean> {
    const item = this.page.getByRole('menuitem', { name: nomeItem });
    const submenu = item.locator('.sidebar-submenu');
    return await submenu.isVisible();
  }

  /**
   * Clica em um item do submenu.
   * @param nomeItem Nome do item do submenu
   */
  async clicarItemSubmenu(nomeItem: string): Promise<void> {
    const item = this.itensSubmenu.filter({ hasText: nomeItem });
    await item.click();
  }

  /**
   * Clica em um link do submenu.
   * @param textoLink Texto do link do submenu
   */
  async clicarLinkSubmenu(textoLink: string): Promise<void> {
    const link = this.linksSubmenu.filter({ hasText: textoLink });
    await link.click();
  }

  /**
   * Verifica se a sidebar tem uma classe CSS específica.
   * @param classeCSS Nome da classe CSS
   */
  async temClasseCSS(classeCSS: string): Promise<boolean> {
    return await this.sidebar.evaluate((element, className) => {
      return element.classList.contains(className);
    }, classeCSS);
  }

  /**
   * Verifica se a sidebar está posicionada à esquerda.
   */
  async estaPosicionadaEsquerda(): Promise<boolean> {
    return (
      (await this.temClasseCSS('sidebar-left')) ||
      (await this.temClasseCSS('left'))
    );
  }

  /**
   * Verifica se a sidebar está posicionada à direita.
   */
  async estaPosicionadaDireita(): Promise<boolean> {
    return (
      (await this.temClasseCSS('sidebar-right')) ||
      (await this.temClasseCSS('right'))
    );
  }

  /**
   * Aguarda um item específico do menu aparecer.
   * @param nomeItem Nome do item do menu
   */
  async aguardarItemMenu(nomeItem: string): Promise<void> {
    const item = this.page.getByRole('menuitem', { name: nomeItem });
    await expect(item).toBeVisible();
  }

  /**
   * Verifica se existe um item do menu com determinado texto.
   * @param texto Texto a ser procurado
   */
  async verificarItemMenuExiste(texto: string): Promise<void> {
    await expect(this.itensMenu).toContainText([texto]);
  }

  /**
   * Verifica se existe um item do submenu com determinado texto.
   * @param texto Texto a ser procurado
   */
  async verificarItemSubmenuExiste(texto: string): Promise<void> {
    await expect(this.itensSubmenu).toContainText([texto]);
  }

  /**
   * Obtém o texto de todos os títulos dos grupos de menu.
   */
  async obterTitulosGrupos(): Promise<string[]> {
    const quantidade = await this.titulosGrupos.count();
    const titulos: string[] = [];

    for (let i = 0; i < quantidade; i++) {
      const texto = await this.titulosGrupos.nth(i).innerText();
      titulos.push(texto);
    }

    return titulos;
  }

  /**
   * Conta quantos grupos de menu existem.
   */
  async contarGruposMenu(): Promise<number> {
    return await this.gruposMenu.count();
  }

  /**
   * Navega usando as setas do teclado.
   * @param direcao Direção da navegação ('ArrowUp' ou 'ArrowDown')
   */
  async navegarComTeclado(direcao: 'ArrowUp' | 'ArrowDown'): Promise<void> {
    await this.page.keyboard.press(direcao);
  }

  /**
   * Seleciona um item do menu usando Enter.
   */
  async selecionarItemComEnter(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }

  /**
   * Verifica se existe um badge com determinado texto.
   * @param texto Texto do badge
   */
  async verificarBadgeExiste(texto: string): Promise<void> {
    await expect(this.badges).toContainText([texto]);
  }

  /**
   * Obtém o valor de um contador específico.
   * @param indice Índice do contador (0-based)
   */
  async obterValorContador(indice: number): Promise<string> {
    return await this.contadores.nth(indice).innerText();
  }
}
