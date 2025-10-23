import { test as setup } from '../fixtures/test-options';
import { expect } from '@playwright/test';

let uiAccessToken: string | undefined;

setup('autenticar e limpar ambiente', async ({ loginPage, page }) => {
  await setup.step('fazer login pela interface', async () => {
    // Atualize o LoginPage para se adequar ao seu aplicativo
    await loginPage.acessar();
    await loginPage.fazerLogin(process.env.EMAIL!, process.env.PASSWORD!);

    // Armazena o token de acesso no estado de armazenamento para reutilização em testes
    const cookies = await page.context().cookies();
    const authCookie = cookies.find((c) => c.name === 'token');
    uiAccessToken = authCookie?.value;

    expect(
      uiAccessToken,
      'Token de acesso não encontrado após login na UI'
    ).toBeTruthy();

    process.env['ACCESS_TOKEN'] = uiAccessToken!;
    await page.context().storageState({ path: '.auth/userSession.json' });
  });

  await setup.step('limpar ambiente', async () => {
    // Adicione aqui a lógica para limpar o ambiente de teste, se necessário
    // Exemplo: await apiClient.limparDadosDeTeste(uiAccessToken!);
  });
});
