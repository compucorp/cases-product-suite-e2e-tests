import { Page, Response } from 'playwright';
import BrowserService from '../../services/utils/browser.service';
import Configs from '../../services/utils/configs';
import cvApiBatch from '../../services/utils/cv-api.service';
import BasePage from './base.page';

/**
 * Manage Entity Page
 */
export abstract class ManageCasetypecategoryList extends BasePage {
  caseTypeCategory = 'cases';

  /**
   * @param {BrowserService} browser browser object
   */
  constructor (public browser: BrowserService) {
    super(browser);
  }

  /**
   * @param {Page} page page object
   * @returns {Promise<Response|null>} promise
   */
  async navigate (page: Page): Promise<Response|null> {
    return await page.goto(Configs.getSiteConfig().url + this.getPageUrl());
  }

  /**
   * @param {Page} page page object
   * @returns {Promise<any>} promise
   */
  async waitForPageLoad (page: Page): Promise<any> {
    return await page.waitForSelector('.civicase__case-filter-panel__button');
  }

  /**
   * @returns {string} page title
   */
  abstract getPageTitle (): string;

  /**
   * @returns {number} case type category value
   */
  private getCaseTypeCategoryValue (): number {
    // implement a caching service
    const caseTypeCategoryValue = cvApiBatch([['OptionValue', 'get', {
      sequential: 1,
      option_group_id: 'case_type_categories',
      name: this.caseTypeCategory
    }]])[0].values[0].value;

    return caseTypeCategoryValue;
  }

  /**
   * @returns {string} page title
   */
  getPageUrl (): string {
    return `/civicrm/case/a/?case_type_category=${this.getCaseTypeCategoryValue()}#/case/list?cf=%7B%22case_type_category%22:%22${this.getCaseTypeCategoryValue()}%22%7D`;
  }
}