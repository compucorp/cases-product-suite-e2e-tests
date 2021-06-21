import { ManageCases } from '../../../src/pages/cases/manage-case.page';
import CaseTypeService from '../../../src/services/entities/case-type.service';
import JestGlobal from '../../../src/interfaces/jest-global.interface';

declare const global: JestGlobal;

describe('Case Page Title', function () {
  let manageCases: ManageCases;

  const CaseType = new CaseTypeService();

  beforeEach(async () => {
    manageCases = new ManageCases();

    setupCaseTypeIds();
  });

  afterEach(async () => {
    CaseType.cleanUp();
  });

  describe('as admin user', function () {
    beforeEach(async () => {
      await global.browser.loginUsingCookiesAs('admin');
      await manageCases.navigate(global.page);
      await manageCases.waitForPageLoad(global.page);
    });

    it('should show manage cases page title', async () => {
      expect(await global.page.title()).toBe(manageCases.getPageTitle());
    });
  });

  /**
   * @returns case type ids
   */
  function setupCaseTypeIds (): object[] {
    const definition = {
      activityTypes: [
        { name: 'Open Case', max_instances: '1' },
        { name: 'Follow up' },
        { name: 'File Upload' }
      ],
      activitySets: [],
      caseRoles: [
        { name: 'Homeless Services Coordinator is', creator: '1', manager: '0' },
        { name: 'Health Services Coordinator', manager: '0' },
        { name: 'Benefits Specialist is', manager: '1' }
      ],
      timelineActivityTypes: []
    };

    return CaseType.create([
      {
        sequential: '1',
        name: 'e2e_case_type',
        case_type_category: 2,
        title: 'E2E CaseType',
        definition: definition
      },
      {
        sequential: '1',
        name: 'e2e_case_type2',
        case_type_category: 2,
        title: 'E2E CaseType2',
        definition: definition
      }
    ]);
  }
});
