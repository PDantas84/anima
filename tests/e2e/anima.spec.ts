import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs/promises';
const KEY = 'anima.workspace.v1';
async function ready(page: Page, path = '/') {
  await page.goto(path);
  await expect(page.locator('.loading-state')).toHaveCount(0);
  await expect(page.locator('main')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const el = document.querySelector('.page-enter');
    return !el || getComputedStyle(el).opacity === '1';
  });
}
async function writeEntry(
  page: Page,
  title = 'Meu primeiro cuidado',
  content = 'Hoje reservei um tempo para respirar e caminhar.',
) {
  await ready(page, '/journal');
  await page.getByRole('button', { name: 'Nova entrada', exact: true }).click();
  await page.getByLabel('Um título, se quiser').fill(title);
  await page.getByLabel('Suas palavras').fill(content);
  await page.getByRole('button', { name: 'Guardar minhas palavras' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
}
test('fresh home works without credentials, errors, external requests or overflow', async ({
  page,
  baseURL,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (req) => {
    if (req.url().startsWith('http') && !req.url().startsWith(baseURL!))
      external.push(req.url());
  });
  await ready(page);
  await expect(
    page.getByRole('heading', { name: 'Que bom ter você aqui.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Fazer uma pausa' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test('personalization and check-in survive reload and replace the same day', async ({
  page,
}) => {
  await ready(page, '/profile');
  await page.getByLabel('Como você gosta de ser chamado(a)?').fill('Pablo');
  await page.getByRole('button', { name: 'Salvar preferências' }).click();
  await ready(page);
  await expect(
    page.getByRole('heading', { name: 'Que bom te ver, Pablo.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Bem', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Bem', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Em paz', exact: true }).click();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).checkIns.length,
      KEY,
    ),
  ).toBe(1);
});
test('journal supports creation, search, editing and confirmed deletion', async ({
  page,
}) => {
  await writeEntry(page);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Meu primeiro cuidado' }),
  ).toBeVisible();
  await page.getByLabel('Buscar no diário').fill('inexistente');
  await expect(
    page.getByRole('heading', { name: 'Nenhum registro por aqui.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await page
    .getByRole('button', { name: /Meu primeiro cuidado.*Ler e editar/ })
    .click();
  await page.getByLabel('Um título, se quiser').fill('Meu cuidado revisitado');
  await page.getByRole('button', { name: 'Guardar minhas palavras' }).click();
  await expect(
    page.getByRole('heading', { name: 'Meu cuidado revisitado' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Apagar entrada: Meu cuidado revisitado' })
    .click();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Meu cuidado revisitado' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Apagar entrada: Meu cuidado revisitado' })
    .click();
  await page
    .getByRole('button', { name: 'Apagar entrada', exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Sua história começa com uma palavra.' }),
  ).toBeVisible();
});
test('cycle records a day, prevents skipping and can be revisited after reload', async ({
  page,
}) => {
  await ready(page, '/cycles');
  await page
    .getByRole('button', { name: 'Conhecer este ciclo' })
    .first()
    .click();
  await page.getByRole('button', { name: 'Começar este ciclo' }).click();
  await expect(
    page.getByRole('button', { name: /Dar nome ao que sente/ }),
  ).toBeDisabled();
  await page.getByRole('button', { name: /Chegar ao agora/ }).click();
  await page.getByRole('button', { name: 'Concluir encontro' }).click();
  await expect(
    page.getByRole('button', { name: /Dar nome ao que sente/ }),
  ).toBeDisabled();
  await expect(page.getByText('Seu próximo encontro, amanhã')).toBeVisible();
  await page.getByRole('button', { name: 'Fechar janela' }).click();
  await page.reload();
  await expect(page.getByText('1 de 7 encontros concluídos')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar meu ciclo' }).click();
  await page.getByRole('button', { name: /Chegar ao agora/ }).click();
  await expect(
    page.getByRole('button', { name: 'Encontro concluído', exact: true }),
  ).toBeDisabled();
});
test('ritual timer pauses, completes, favorites persist and diary prompt opens', async ({
  page,
}) => {
  await ready(page, '/rituals');
  await page
    .getByRole('button', {
      name: 'Favoritar Um respiro, um recomeço',
      exact: true,
    })
    .click();
  await page.reload();
  await page.getByRole('button', { name: 'Favoritos', exact: true }).click();
  await expect(page.locator('.ritual-card')).toHaveCount(1);
  await page
    .getByRole('button', { name: /Um respiro, um recomeço Uma pausa/ })
    .click();
  await expect(page.getByRole('timer')).toHaveText('1:00');
  await page.getByRole('button', { name: 'Começar a pausa' }).click();
  await expect(page.getByRole('timer')).not.toHaveText('1:00');
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await page.getByRole('button', { name: 'Reiniciar cronômetro' }).click();
  await expect(page.getByRole('timer')).toHaveText('1:00');
  await page.getByRole('button', { name: 'Concluir prática' }).click();
  await expect(page.getByText('Guarde esse momento.')).toBeVisible();
  await page.getByRole('button', { name: 'Levar para o diário' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('O que mudou depois dessa pausa?')).toBeVisible();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).practices.length,
      KEY,
    ),
  ).toBe(1);
});
test('guided conversation discloses scripts, saves and prioritizes human support', async ({
  page,
}) => {
  await ready(page, '/session');
  await expect(page.getByText(/Não é IA generativa/)).toBeVisible();
  await page
    .getByRole('button', { name: /Entender o que estou sentindo/ })
    .click();
  await page.getByLabel('Sua mensagem').fill('Estou cansada');
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(page.getByText(/Você trouxe o cansaço/)).toBeVisible();
  await page
    .getByRole('button', { name: 'Guardar no diário', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Guardado no diário' }),
  ).toBeDisabled();
  await page.getByLabel('Sua mensagem').fill('Não quero mais viver');
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(
    page.getByRole('link', { name: 'Ligar para o CVV · 188' }),
  ).toHaveAttribute('href', 'tel:188');
  await expect(page.getByLabel('Sua mensagem')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ver opções de apoio' }).click();
  await expect(
    page.getByRole('link', { name: 'Ligar para o SAMU · 192' }),
  ).toHaveAttribute('href', 'tel:192');
});
test('backup round-trip restores entries only after confirmation', async ({
  page,
}) => {
  await writeEntry(page);
  await ready(page, '/profile');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar meus dados' }).click();
  const download = await downloading;
  const path = await download.path();
  const backup = await fs.readFile(path!, 'utf8');
  expect(JSON.parse(backup).entries[0].title).toBe('Meu primeiro cuidado');
  await page
    .getByRole('button', { name: 'Apagar todos os meus dados' })
    .click();
  await page
    .getByRole('button', { name: 'Apagar todos os dados', exact: true })
    .click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), KEY),
  ).toBeNull();
  await page.getByLabel('Selecionar backup da ANIMA').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  });
  await expect(
    page.getByRole('dialog', { name: 'Restaurar este backup?' }),
  ).toBeVisible();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), KEY),
  ).toBeNull();
  await page
    .getByRole('button', { name: 'Restaurar backup', exact: true })
    .click();
  await ready(page, '/journal');
  await expect(
    page.getByRole('heading', { name: 'Meu primeiro cuidado' }),
  ).toBeVisible();
});
test('corrupt local data is preserved and can be explicitly reset', async ({
  page,
}) => {
  await ready(page);
  await page.evaluate((key) => localStorage.setItem(key, '{broken'), KEY);
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Não foi possível abrir');
  await page.getByRole('button', { name: 'Bem', exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(
    '{broken',
  );
  await page
    .getByRole('alert')
    .getByRole('button', { name: 'Abrir Meu espaço', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Apagar todos os meus dados' })
    .click();
  await page
    .getByRole('button', { name: 'Apagar todos os dados', exact: true })
    .click();
  await expect(page.getByRole('alert')).toHaveCount(0);
});
test('storage failures do not report successful saves or clear the diary draft', async ({
  page,
}) => {
  await ready(page, '/journal');
  await page.getByRole('button', { name: 'Nova entrada', exact: true }).click();
  await page
    .getByLabel('Suas palavras')
    .fill('Meu rascunho precisa continuar aqui.');
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    };
  });
  await page.getByRole('button', { name: 'Guardar minhas palavras' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Suas palavras')).toHaveValue(
    'Meu rascunho precisa continuar aqui.',
  );
  await expect(page.getByRole('status')).toContainText('Alteração não salva');
});
test('navigation, dialog keyboard dismissal, map and future letter work', async ({
  page,
  isMobile,
}) => {
  await ready(page);
  if (isMobile) await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('link', { name: 'Mapa da jornada' }).click();
  await expect(
    page.getByRole('heading', { name: 'Mapa da jornada' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Escrever minha carta' }).click();
  await page
    .getByLabel('Carta para meu eu futuro')
    .fill('Que você continue encontrando tempo para si.');
  await page.getByRole('button', { name: 'Guardar minha carta' }).click();
  await page.reload();
  await expect(page.getByLabel('Carta para meu eu futuro')).toHaveValue(
    'Que você continue encontrando tempo para si.',
  );
  await ready(page);
  await page.getByRole('button', { name: 'Fazer uma pausa' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Fazer uma pausa' }),
  ).toBeFocused();
});

test('closing an unsaved journal entry asks before discarding the draft', async ({
  page,
}) => {
  await ready(page, '/journal');
  await page.getByRole('button', { name: 'Nova entrada', exact: true }).click();
  await page
    .getByLabel('Suas palavras')
    .fill('Ainda estou encontrando as palavras.');
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('heading', { name: 'Descartar as alterações?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Continuar escrevendo' }).click();
  await expect(page.getByLabel('Suas palavras')).toHaveValue(
    'Ainda estou encontrando as palavras.',
  );
  await page.getByRole('button', { name: 'Fechar janela' }).click();
  await page.getByRole('button', { name: 'Descartar alterações' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Sua história começa com uma palavra.' }),
  ).toBeVisible();
});
