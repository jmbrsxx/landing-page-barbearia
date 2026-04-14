import { test, expect } from '@playwright/test';

test('admin access with code admin2024', async ({ page }) => {
  // Navegar para a página admin
  await page.goto('http://localhost:8081/admin');

  // Verificar se estamos na página de login
  await expect(page.locator('text=Acesso ao Painel Administrativo')).toBeVisible();

  // Digitar o código admin2024
  await page.fill('input[type="password"]', 'admin2024');

  // Clicar no botão de acesso
  await page.click('button[type="submit"]');

  // Verificar se fomos redirecionados para o dashboard
  await expect(page.locator('text=Painel Administrativo')).toBeVisible();

  // Verificar se não há erros de autenticação
  await expect(page.locator('text=Erro de Autenticação')).not.toBeVisible();

  // Verificar se o dashboard está carregando (não deve mostrar dados mock)
  await expect(page.locator('text=Carregando dados do dashboard...')).toBeVisible({ timeout: 10000 });

  // Aguardar o carregamento completar
  await page.waitForTimeout(2000);

  // Verificar se mostra estatísticas do dashboard
  await expect(page.locator('text=Total de Agendamentos')).toBeVisible();
});

test('admin access with wrong code', async ({ page }) => {
  // Navegar para a página admin
  await page.goto('http://localhost:8081/admin');

  // Digitar código errado
  await page.fill('input[type="password"]', 'wrongcode');

  // Clicar no botão de acesso
  await page.click('button[type="submit"]');

  // Verificar se mostra erro
  await expect(page.locator('text=Chave de acesso inválida')).toBeVisible();
});