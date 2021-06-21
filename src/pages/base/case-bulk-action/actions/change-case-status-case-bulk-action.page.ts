import { Page } from 'playwright';
import CaseBulkActionBase from '../case-bulk-action-base.page';

/**
 * Change Case Status Bulk Action Class
 */
export default class ChangeCaseStatusCaseBulkAction extends CaseBulkActionBase {
  selectors = {
    caseStatus: '.civicase__bulkactions-actions-dropdown__text ~ .dropdown-menu a:has-text("Change Case Status")',
    openStatusSelectDropdown: '.crm-confirm-dialog .select2-arrow',
    selectStatus: '.select2-drop .select2-result-label:has-text("Resolved")',
    continue: '.ui-dialog .ui-dialog-buttonset .ui-corner-all:has-text("Continue")'
  };

  /**
   * @param page page object
   * @param numberOfCases number of cases to select
   * @returns promise
   */
  async doAction (page: Page, numberOfCases: 'all' | 'visible' | 'none'): Promise<any> {
    await this.enableBulkActionFor(page, numberOfCases);
    await this.changeCaseStatus(page);
  }

  /**
   * @param page page object
   */
  async changeCaseStatus (page: Page): Promise<void> {
    await page.click(this.baseSelectors.caseList + ' ' + this.selectors.caseStatus);
    await page.click(this.selectors.openStatusSelectDropdown);
    await page.click(this.selectors.selectStatus);
    await page.click(this.selectors.continue);
  }
}
