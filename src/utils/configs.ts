import * as fs from 'fs';
import throwError from './throw-error';
import ConfigFile from '../interfaces/config-file.interface';
import UserRole from './../role/user-role.service';
import * as path from 'path';

export default {
  cookieDir: './cookies/',
  siteConfig: 'site-config.json',
  siteConfigSample: 'site-config.json.sample',
  /**
   * @returns {ConfigFile} config file
   */
  getSiteConfig (): ConfigFile {
    return JSON.parse(fs.readFileSync(this.siteConfig).toString());
  },
  /**
   * @param {string} roleName role name
   * @returns {string} cookie path
   */
  getCookiePathFor (roleName: string): string {
    return path.join(this.cookieDir, UserRole.getCookieFileName(roleName));
  },
  /**
   * Creates the config file if not present.
   */
  touchSiteConfigFile (): void {
    try {
      fs.readFileSync(this.siteConfig);
    } catch (err) {
      fs.copyFileSync(this.siteConfigSample, this.siteConfig);

      throwError(
        'No site-config.json file detected!\n' +
        '\tOne has been created for you \n' +
        '\tPlease insert the real value for each placeholder and try again'
      );
    }
  }
};
