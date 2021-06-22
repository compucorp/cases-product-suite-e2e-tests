import { ManageProspects } from '../../../src/pages/prospect/manage-prospects.page';
import JestGlobal from '../../../src/interfaces/jest-global.interface';

declare const global: JestGlobal;

describe('Prospect Page Title', function () {
  let manageProspects: ManageProspects;

  beforeEach(async () => {
    manageProspects = new ManageProspects();
  });

  describe('as admin user', function () {
    beforeEach(async () => {
      await global.browser.loginUsingCookiesAs('admin');
      await manageProspects.navigate(global.page);
      await manageProspects.waitForPageLoad(global.page);
    });

    it('should show manage prospects page title', async () => {
      expect(await global.page.title()).toBe(manageProspects.getPageTitle());
    });
  });
});
