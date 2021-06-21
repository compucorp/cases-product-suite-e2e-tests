import { Page, Response } from 'playwright';
import Configs from '../../services/utils/configs.service';

/**
 * Manage Entity Page
 */
export default abstract class BasePage {
  siteName: string = Configs.getSiteConfig().site_name;

  /**
   * @param page page object
   * @returns promise
   */
  async navigate (page: Page): Promise<Response|null> {
    return await page.goto(Configs.getSiteConfig().url + this.getPageUrl());
  }

  /**
   * @param page page object
   * @returns promise
   */
  abstract waitForPageLoad (page: Page): Promise<any>;

  /**
   * @returns page title
   */
  abstract getPageUrl (filters?: any): string;
}
