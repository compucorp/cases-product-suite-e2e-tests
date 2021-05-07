import { execSync } from 'child_process';
import Configs from '../utils/configs';

/**
 * Disables the session_limit drupal module.
 * This is done to ensure Session Limit is not reached, as tests always
 * create a new session.
 *
 * @param {string} moduleName module name
 * @param {boolean} enable should enable or disable
 */
export default function changeDrupalModuleState (moduleName: string, enable: boolean): void {
  const state = enable ? 'en' : 'dis';
  const config = Configs.getSiteConfig();

  execSync(`drush ${state} ${moduleName} -y`, { encoding: 'utf8', cwd: config.root });
};
