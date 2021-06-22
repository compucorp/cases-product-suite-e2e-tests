import { ManageApplications } from '../../../src/pages/awards/manage-applications.page';

import JestGlobal from '../../../src/interfaces/jest-global.interface';

declare const global: JestGlobal;

describe('Award Page Title', function () {
  let manageApplications: ManageApplications;

  beforeEach(async () => {
    manageApplications = new ManageApplications();
  });

  describe('as admin user', function () {
    beforeEach(async () => {
      await global.browser.loginUsingCookiesAs('admin');
      await manageApplications.navigate(global.page);
      await manageApplications.waitForPageLoad(global.page);
    });

    it('should show manage applications page title', async () => {
      expect(await global.page.title()).toBe(manageApplications.getPageTitle());
    });
  });

  describe('as case user', function () {
    beforeEach(async () => {
      await global.browser.loginUsingCookiesAs('case_user');
      await manageApplications.navigate(global.page);
    });

    it('should not have access to manage applications page', async () => {
      expect(await global.page.title()).not.toBe(manageApplications.getPageTitle());
    });
  });
});
