import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/example/LoginPage';
import { Tabela } from '../../pages/components/Tabela';
import { Toast } from '../../pages/components/Toast';
import { Sidebar } from '../../pages/components/Sidebar';
import { ModalConfirmacao } from '../../pages/components/ModalConfirmacao';

export type FrameworkFixtures = {
  loginPage: LoginPage;
  tabela: Tabela;
  toast: Toast;
  sidebar: Sidebar;
  modalConfirmacao: ModalConfirmacao;
};

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  tabela: async ({ page }, use) => {
    await use(new Tabela(page));
  },
  toast: async ({ page }, use) => {
    await use(new Toast(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new Sidebar(page));
  },
  modalConfirmacao: async ({ page }, use) => {
    await use(new ModalConfirmacao(page));
  },
});

export { expect } from '@playwright/test';
