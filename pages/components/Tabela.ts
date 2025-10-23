import { Page, Locator, expect } from '@playwright/test';

/**
 * Esse é o objeto do componente de Tabela.
 * @export
 * @class Tabela
 */
export class Tabela {
  constructor(private page: Page) {}

  // ################## Elementos ##################

  // Tabela principal
  get tabela(): Locator {
    return this.page.locator('table, [data-testid="table"]');
  }

  get container(): Locator {
    return this.page.locator('.table-container, [data-testid="table-container"]');
  }

  // Cabeçalho da tabela
  get cabecalho(): Locator {
    return this.page.locator('thead, [data-testid="table-header"]');
  }

  get colunasCabecalho(): Locator {
    return this.page.locator('thead tr th, [data-testid="table-header"] th');
  }

  get tituloColuna(): Locator {
    return this.page.locator('thead th, [data-testid="table-header"] th');
  }

  // Corpo da tabela
  get corpo(): Locator {
    return this.page.locator('tbody, [data-testid="table-body"]');
  }

  get linhas(): Locator {
    return this.page.locator('tbody tr, [data-testid="table-row"]');
  }

  get celulas(): Locator {
    return this.page.locator('tbody td, [data-testid="table-cell"]');
  }

  // Funcionalidades de busca e filtro
  get barraBusca(): Locator {
    return this.page.locator('.search-bar, [data-testid="search-bar"]');
  }

  get inputBusca(): Locator {
    return this.page
      .getByPlaceholder(/buscar|search/i)
      .or(this.page.locator('input[type="search"]'));
  }

  get botaoBuscar(): Locator {
    return this.page
      .locator('button[type="submit"]')
      .or(this.page.getByRole('button', { name: /buscar|search/i }));
  }

  get botaoLimparBusca(): Locator {
    return this.page.locator('.clear-search, [data-testid="clear-search"]');
  }

  // Paginação
  get paginacao(): Locator {
    return this.page.locator('.pagination, [data-testid="pagination"]');
  }

  get botaoProximaPagina(): Locator {
    return this.page.getByRole('button', { name: /próxima|next/i });
  }

  get botaoPaginaAnterior(): Locator {
    return this.page.getByRole('button', { name: /anterior|previous/i });
  }

  get indicadorPagina(): Locator {
    return this.page.locator('.page-info, [data-testid="page-info"]');
  }

  // Ações da tabela
  get botoesAcao(): Locator {
    return this.page.locator('.table-actions, [data-testid="table-actions"]');
  }

  get botaoAdicionar(): Locator {
    return this.page.getByRole('button', { name: /adicionar|add|novo|new/i });
  }

  get botaoExportar(): Locator {
    return this.page.getByRole('button', { name: /exportar|export/i });
  }

  get botaoAtualizar(): Locator {
    return this.page.getByRole('button', {
      name: /atualizar|refresh|recarregar/i,
    });
  }

  // Seleção de linhas
  get checkboxSelecionarTodos(): Locator {
    return this.page.locator('thead input[type="checkbox"]');
  }

  get checkboxesLinhas(): Locator {
    return this.page.locator('tbody input[type="checkbox"]');
  }

  // Ordenação
  get botoesOrdenacao(): Locator {
    return this.page.locator('thead th button, [data-testid="sort-button"]');
  }

  get indicadorOrdenacao(): Locator {
    return this.page.locator('.sort-indicator, [data-testid="sort-indicator"]');
  }

  // ################## Métodos ##################

  /**
   * Retorna todas as linhas da tabela (excluindo o cabeçalho).
   */
  get obterLinhas(): Locator {
    return this.linhas;
  }

  /**
   * Retorna o número de linhas da tabela (excluindo cabeçalho).
   */
  async contarLinhas(): Promise<number> {
    return await this.linhas.count();
  }

  /**
   * Retorna todas as colunas de uma linha específica (0-indexed).
   * @param indiceLinha Índice da linha (0 para a primeira linha de dados)
   */
  async obterColunasDaLinha(indiceLinha: number): Promise<Locator> {
    return this.linhas.nth(indiceLinha).locator('td');
  }

  /**
   * Retorna o valor de uma célula específica da tabela.
   * @param linha Índice da linha (0 para a primeira linha)
   * @param coluna Índice da coluna (0 para a primeira coluna)
   */
  async obterTextoCelula(linha: number, coluna: number): Promise<string> {
    const colunas = await this.obterColunasDaLinha(linha);
    return await colunas.nth(coluna).innerText();
  }

  /**
   * Retorna o número de colunas (baseado no cabeçalho).
   */
  async contarColunas(): Promise<number> {
    return await this.colunasCabecalho.count();
  }

  /**
   * Busca por uma linha que contenha determinado texto e retorna o índice.
   * @param texto Texto esperado em alguma célula
   */
  async encontrarLinhaPorTexto(texto: string): Promise<number> {
    const total = await this.linhas.count();

    for (let i = 0; i < total; i++) {
      const linhaTexto = await this.linhas.nth(i).innerText();
      if (linhaTexto.includes(texto)) {
        return i;
      }
    }

    throw new Error(`Linha com o texto "${texto}" não encontrada.`);
  }

  /**
   * Clica em um botão/link localizado em uma célula da linha que contém determinado texto.
   * @param texto Texto que identifica a linha desejada
   * @param seletorElemento Seletor do botão/link a ser clicado dentro da célula
   */
  async clicarElementoNaLinhaPorTexto(
    texto: string,
    seletorElemento: Locator
  ): Promise<void> {
    const indice = await this.encontrarLinhaPorTexto(texto);
    const linha = this.linhas.nth(indice);
    await linha.locator(seletorElemento).click();
  }

  /**
   * Verifica se um texto existe em alguma célula da tabela.
   * @param texto Texto a ser procurado
   */
  async verificarTextoExiste(texto: string): Promise<void> {
    await expect(this.linhas).toContainText([texto]);
  }

  /**
   * Verifica se a tabela está vazia (sem linhas de dados).
   */
  async estaVazia(): Promise<boolean> {
    return (await this.contarLinhas()) === 0;
  }

  /**
   * Retorna todos os textos da linha como array de strings.
   * @param indiceLinha Índice da linha
   */
  async obterTextoDaLinha(indiceLinha: number): Promise<string[]> {
    const colunas = await this.obterColunasDaLinha(indiceLinha);
    const totalColunas = await colunas.count();

    const valores: string[] = [];
    for (let i = 0; i < totalColunas; i++) {
      valores.push(await colunas.nth(i).innerText());
    }

    return valores;
  }

  /**
   * Verifica se existe apenas um item na tabela com o nome especificado.
   * Usa o input de busca para filtrar os resultados.
   * @param nomeItem Nome do item a ser verificado
   */
  async verificarExisteApenasUmItemComNome(nomeItem: string): Promise<void> {
    await this.inputBusca.clear();
    await this.inputBusca.fill(nomeItem);
    await this.inputBusca.press('Enter');
    await this.page.waitForTimeout(500);
    const quantidadeLinhas = await this.contarLinhas();
    expect(quantidadeLinhas).toBe(1);
    await this.verificarTextoExiste(nomeItem);
  }

  /**
   * Pesquisa um item na tabela.
   * @param nome Nome do item a ser pesquisado
   */
  async pesquisarItem(nome: string): Promise<void> {
    await expect(this.botaoBuscar).toBeVisible();
    await this.inputBusca.fill(nome);
    await this.botaoBuscar.click();
    await expect(this.page.getByText(nome)).toBeVisible();
  }

  /**
   * Limpa a busca atual.
   */
  async limparBusca(): Promise<void> {
    if (await this.botaoLimparBusca.isVisible()) {
      await this.botaoLimparBusca.click();
    } else {
      await this.inputBusca.clear();
    }
  }

  /**
   * Ordena a tabela por uma coluna específica.
   * @param nomeColuna Nome da coluna para ordenação
   */
  async ordenarPorColuna(nomeColuna: string): Promise<void> {
    const coluna = this.colunasCabecalho.filter({ hasText: nomeColuna });
    await coluna.click();
  }

  /**
   * Seleciona todas as linhas da tabela.
   */
  async selecionarTodasLinhas(): Promise<void> {
    await this.checkboxSelecionarTodos.check();
  }

  /**
   * Desmarca todas as linhas selecionadas.
   */
  async desmarcarTodasLinhas(): Promise<void> {
    await this.checkboxSelecionarTodos.uncheck();
  }

  /**
   * Seleciona uma linha específica por índice.
   * @param indiceLinha Índice da linha (0-based)
   */
  async selecionarLinha(indiceLinha: number): Promise<void> {
    await this.checkboxesLinhas.nth(indiceLinha).check();
  }

  /**
   * Verifica se uma linha está selecionada.
   * @param indiceLinha Índice da linha (0-based)
   */
  async linhaEstaSelecionada(indiceLinha: number): Promise<boolean> {
    return await this.checkboxesLinhas.nth(indiceLinha).isChecked();
  }

  /**
   * Conta quantas linhas estão selecionadas.
   */
  async contarLinhasSelecionadas(): Promise<number> {
    const total = await this.checkboxesLinhas.count();
    let selecionadas = 0;

    for (let i = 0; i < total; i++) {
      if (await this.checkboxesLinhas.nth(i).isChecked()) {
        selecionadas++;
      }
    }

    return selecionadas;
  }

  /**
   * Navega para a próxima página.
   */
  async irParaProximaPagina(): Promise<void> {
    await this.botaoProximaPagina.click();
  }

  /**
   * Navega para a página anterior.
   */
  async irParaPaginaAnterior(): Promise<void> {
    await this.botaoPaginaAnterior.click();
  }

  /**
   * Obtém o texto do indicador de página atual.
   */
  async obterInformacaoPagina(): Promise<string> {
    return await this.indicadorPagina.innerText();
  }

  /**
   * Adiciona um novo item (clica no botão adicionar).
   */
  async adicionarItem(): Promise<void> {
    await this.botaoAdicionar.click();
  }

  /**
   * Exporta os dados da tabela.
   */
  async exportarDados(): Promise<void> {
    await this.botaoExportar.click();
  }

  /**
   * Atualiza/recarrega a tabela.
   */
  async atualizarTabela(): Promise<void> {
    await this.botaoAtualizar.click();
  }

  /**
   * Verifica se a tabela está carregando.
   */
  async estaCarregando(): Promise<boolean> {
    return await this.page
      .locator('.loading, [data-testid="loading"]')
      .isVisible();
  }

  /**
   * Aguarda a tabela terminar de carregar.
   */
  async aguardarCarregamento(): Promise<void> {
    await expect(
      this.page.locator('.loading, [data-testid="loading"]')
    ).toBeHidden();
  }

  /**
   * Obtém o texto de todas as colunas do cabeçalho.
   */
  async obterColunasCabecalho(): Promise<string[]> {
    const total = await this.contarColunas();
    const colunas: string[] = [];

    for (let i = 0; i < total; i++) {
      const texto = await this.colunasCabecalho.nth(i).innerText();
      colunas.push(texto);
    }

    return colunas;
  }

  /**
   * Verifica se uma coluna específica existe no cabeçalho.
   * @param nomeColuna Nome da coluna
   */
  async verificarColunaExiste(nomeColuna: string): Promise<void> {
    await expect(this.colunasCabecalho).toContainText([nomeColuna]);
  }

  /**
   * Obtém todos os dados da tabela como matriz de strings.
   */
  async obterTodosDados(): Promise<string[][]> {
    const totalLinhas = await this.contarLinhas();
    const dados: string[][] = [];

    for (let i = 0; i < totalLinhas; i++) {
      const linha = await this.obterTextoDaLinha(i);
      dados.push(linha);
    }

    return dados;
  }
}
