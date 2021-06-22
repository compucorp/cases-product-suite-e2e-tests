import { Page } from 'playwright';

/**
 * Case Bulk Action Base Class
 */
export default abstract class CaseBulkActionBase {
  baseSelectors = {
    caseList: '.civicase__case-list-column--fixed',
    enableMainCheckbox: '.civicase__bulkactions-checkbox > .civicase__checkbox',
    openModeDropdown: '.civicase__bulkactions-select-mode-dropdown.dropdown-toggle',
    openSelectActionDropdown: '.civicase__bulkactions-actions-dropdown__text',
    selectCases: {
      all: '.civicase__bulkactions-select-mode-dropdown +.dropdown-menu [ng-click="select(\'all\')"]',
      visible: '.civicase__bulkactions-select-mode-dropdown +.dropdown-menu [ng-click="select(\'visible\')"]',
      none: '.civicase__bulkactions-select-mode-dropdown +.dropdown-menu [ng-click="select(\'none\')"]'
    }
  };

  /**
   * @param page page object
   * @param numberOfCases number of cases to select
   * @returns promise
   */
  abstract doAction (page: Page, numberOfCases: 'all' | 'visible' | 'none'): Promise<void>;

  /**
   * @param page page object
   * @param numberOfCases number of cases to select
   */
  async enableBulkActionFor (page: Page, numberOfCases: 'all' | 'visible' | 'none'): Promise<void> {
    await page.click(this.baseSelectors.caseList + ' ' + this.baseSelectors.enableMainCheckbox);
    await page.click(this.baseSelectors.caseList + ' ' + this.baseSelectors.openModeDropdown);
    await page.click(this.baseSelectors.caseList + ' ' + this.baseSelectors.selectCases[numberOfCases]);
    await page.click(this.baseSelectors.caseList + ' ' + this.baseSelectors.openSelectActionDropdown);
  }
}
