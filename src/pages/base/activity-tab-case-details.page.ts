import { Page, Response } from 'playwright';
import Configs from '../../services/utils/configs.service';
import BasePage from './base.page';
import OptionValueService from '../../services/entities/option-value.service';
import SendEmailCaseBulkAction from './case-bulk-action/actions/send-email-case-bulk-action.page';

const sendEmailCaseBulkAction = new SendEmailCaseBulkAction();

/**
 * Activity Tab Case Details Page
 */
export default class ActivityTabCaseDetails extends BasePage {
  caseTypeCategory = 'cases';
  caseID: string;
  focussed: 0 | 1 = 0;
  OptionValue = new OptionValueService();
  selectors = {
    activityTabPlaceholders: '.civicase__activity-feed__placeholder',
    activityFeedListItem: '.civicase__activity-feed__list',
    successfulEmailActivitySent: '.civicase__activity-icon.fa-envelope-o.civicase__text-success',
    emailActivityType: '.civicase__tooltip:has-text("Email")',
    emailActivitySybject: `.civicase__activity-card-row:has-text("${sendEmailCaseBulkAction.values.emailSubject}")`
  };

  /**
   * @param caseID case id
   * @param focussed if activity tab should be foccussed
   */
  constructor (caseID: string, focussed: 0 | 1) {
    super();
    this.caseID = caseID;
    this.focussed = focussed;
  }

  /**
   * @param {Page} page page object
   * @returns {Promise<Response|null>} promise
   */
  async navigate (page: Page): Promise<Response|null> {
    return await page.goto(Configs.getSiteConfig().url + this.getPageUrl());
  }

  /**
   * @param page page object
   * @returns promise
   */
  async waitForPageLoad (page: Page): Promise<any> {
    await page.waitForSelector(this.selectors.activityTabPlaceholders, { state: 'hidden' });
  }

  /**
   * @returns case type category value
   */
  private getCaseTypeCategoryValue (): string {
    const caseTypeCategoryValue = this.OptionValue.get({
      sequential: 1,
      option_group_id: 'case_type_categories',
      name: this.caseTypeCategory
    }, true)[0].value;

    return caseTypeCategoryValue;
  }

  /**
   * @returns page title
   */
  getPageUrl (): string {
    return `/civicrm/case/a/?case_type_category=${this.getCaseTypeCategoryValue()}#/case/list?cf=%7B%22case_type_category%22:%22${this.getCaseTypeCategoryValue()}%22%7D&caseId=${this.caseID}&focus=${this.focussed}&tab=Activities`;
  }
}
