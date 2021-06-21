import { Page } from 'playwright';
import CaseBulkActionBase from '../case-bulk-action-base.page';

/**
 * Send Email Action Class
 */
export default class SendEmailCaseBulkAction extends CaseBulkActionBase {
  values = {
    emailSubject: 'Test Email Activity Subject'
  };

  selectors = {
    sendEmail: '.civicase__bulkactions-actions-dropdown__text ~ .dropdown-menu a:has-text("Email - send now")',
    openRoleSelectorDropdown: '.civicase__email-role-selector .select2-container',
    selectClientRole: '.select2-drop .select2-result-label:has-text("Client")',
    continueToDraftEmail: '.ui-dialog .ui-dialog-buttonset .ui-corner-all:has-text("Draft Email")',
    emailSubject: '.crm-contactEmail-form-block-subject #subject',
    sendEmailButton: '.ui-dialog .ui-dialog-buttonset .ui-corner-all:has-text("Send Email")',
    sendEmailPopup: '.ui-dialog'
  };

  /**
   * @param page page object
   * @param numberOfCases number of cases to select
   * @returns promise
   */
  async doAction (page: Page, numberOfCases: 'all' | 'visible' | 'none'): Promise<any> {
    await this.enableBulkActionFor(page, numberOfCases);
    await this.sendEmail(page);
  }

  /**
   * @param page page object
   */
  async sendEmail (page: Page): Promise<void> {
    await page.click(this.baseSelectors.caseList + ' ' + this.selectors.sendEmail);
    await page.click(this.selectors.openRoleSelectorDropdown);
    await page.click(this.selectors.selectClientRole);
    await page.click(this.selectors.continueToDraftEmail);
    await page.fill(this.selectors.emailSubject, this.values.emailSubject);
    await page.click(this.selectors.sendEmailButton);
    await page.waitForSelector(this.selectors.sendEmailPopup, { state: 'hidden' });
  }
}
