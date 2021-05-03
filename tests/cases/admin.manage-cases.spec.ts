import { Page } from 'playwright';
import BrowserService from '../../src/services/utils/browser.service';
import { ManageCases } from '../../src/pages/cases/manage-case.page';
import DatabaseService from '../../src/services/data/database.service';

describe('Manage Cases: As Admin User', function () {
  let page: Page;
  let manageCases: ManageCases;
  const browser = new BrowserService();

  beforeAll(async () => {
    await browser.setup();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await DatabaseService.startTransaction();
    page = await browser.newPage();

    manageCases = new ManageCases(browser);
  });

  afterEach(async () => {
    await page.close();
    await DatabaseService.rollbackTransaction();
  });

  describe('on navigate', function () {
    beforeEach(async () => {
      await browser.loadCookiesFor('admin');
      await manageCases.navigate(page);
      await manageCases.waitForPageLoad(page);
    });

    it('should show manage cases page title', async () => {
      expect(await page.title()).toBe(manageCases.getPageTitle());
    });
  });
});
