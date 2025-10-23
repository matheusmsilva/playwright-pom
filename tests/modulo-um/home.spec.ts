import { test } from '../../fixtures/test-options';
import { faker } from '@faker-js/faker';

test.describe('Suite de testes', () => {
  test(
    '[TestID] - Acessar o sistema com sucesso e criar uma variável de nome aleatório',
    { tag: '@regression' },
    async ({ page }) => {
      await test.step('Passo para fazer o teste', async () => {
        // adicione ações
        await page.goto('https://example.com');
      });

      await test.step('Segundo passo do teste', async () => {
        // adicione ações
        const randomName = faker.person.firstName();
        await page.locator('body').fill(randomName);
      });
    }
  );
});
