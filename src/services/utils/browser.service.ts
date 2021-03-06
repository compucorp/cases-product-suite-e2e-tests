import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { chromium, ChromiumBrowser, ChromiumBrowserContext, Cookie, Page } from 'playwright';
import ConfigFile from '../../interfaces/config-file.interface';
import Configs from './configs.service';
import UserRole from './user-role.service';

/**
 * Browser Service Class
 */
export default class BrowserService {
  private browser: ChromiumBrowser;
  private context: ChromiumBrowserContext;

  /**
   * Setup the browser.
   *
   * @returns promise
   */
  async setup (): Promise<ChromiumBrowser> {
    return await this.launchChrome();
  }

  /**
   * Create New Page from a new Context.
   *
   * @returns promise
   */
  async newPage (): Promise<Page> {
    this.context = await this.browser.newContext();

    return await this.context.newPage();
  }

  /**
   * Closes the browser.
   *
   * @returns promise
   */
  async close (): Promise<void> {
    return await this.browser.close();
  }

  /**
   * Writes the session cookie files that will be used to log in as different users
   *
   * It uses the [`drush uli`](https://drushcommands.com/drush-7x/user/user-login/)
   * command to generate a one-time login url, the browser then go to that url
   * which then creates the session cookie
   *
   * The cookie is then stored in a json file which is used by the BackstopJS scenarios
   * to log in
   *
   * @returns promise
   */
  async writeCookies (): Promise<void> {
    for (const roleObj of UserRole.getAllRoles()) {
      const cookieFilePath = path.join(Configs.cookieDir, `${UserRole.getCookieFileName(roleObj.name)}`);
      const config: ConfigFile = Configs.getSiteConfig();
      const command = `drush ${config.drush_alias} uli --name=${UserRole.getRoleName(roleObj.name)} --uri=${config.url} --browser=0`;
      const loginUrl = execSync(command, { encoding: 'utf8', cwd: config.root });

      await this.launchChrome();
      const page = await this.newPage();
      await page.goto(loginUrl);

      const cookies = await this.context.cookies();
      await this.close();

      !fs.existsSync(Configs.cookieDir) && fs.mkdirSync(Configs.cookieDir);
      fs.existsSync(cookieFilePath) && fs.unlinkSync(cookieFilePath);

      fs.writeFileSync(cookieFilePath, JSON.stringify(cookies));
    }
  }

  /**
   * Loads the saved cookies into the browser context.
   *
   * @param roleName role name
   * @returns promise
   */
  async loginUsingCookiesAs (roleName: string): Promise<void> {
    let cookies: Cookie[] = [];
    const cookiePath = Configs.getCookiePathFor(roleName);

    // READ COOKIES FROM FILE IF EXISTS
    if (fs.existsSync(cookiePath)) {
      cookies = JSON.parse(fs.readFileSync(cookiePath).toString());
    }

    await this.setCookies(this.context, cookies);
  }

  /**
   * Launch Chrome.
   *
   * @returns browser
   */
  private async launchChrome (): Promise<ChromiumBrowser> {
    this.browser = await chromium.launch();

    return this.browser;
  }

  /**
   * Set cookies.
   *
   * @param context context object
   * @param cookies cookies array
   * @returns promise
   */
  private async setCookies (
    context: ChromiumBrowserContext,
    cookies: Cookie[]): Promise<void> {
    return await context.addCookies(cookies);
  }

  /**
   * @param page page object
   * @param hasTestFailures whether test has failed
   * @param failureScreenshotFileName screenshot file name
   */
  public async takeScreenshotWhenFailedAndClose (page: Page, hasTestFailures: boolean, failureScreenshotFileName: string): Promise<any> {
    if (hasTestFailures) {
      await page.screenshot({
        path: `./test-report/${failureScreenshotFileName}.png`,
        fullPage: true
      });
    }
    await page.close();
  }
}
