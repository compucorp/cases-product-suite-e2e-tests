import { ManageCases } from '../../../src/pages/cases/manage-case.page';
import ActivityTabCaseDetails from '../../../src/pages/base/activity-tab-case-details.page';
import JestGlobal from '../../../src/interfaces/jest-global.interface';
import CaseTypeService from '../../../src/services/entities/case-type.service';
import CaseService from '../../../src/services/entities/case.service';
import ContactService from '../../../src/services/entities/contact.service';
import CiviApiResponseValue from '../../../src/interfaces/civi-response-value.interface';

declare const global: JestGlobal;

describe('Case "Change Case Status" Bulk Action', function () {
  let manageCases: ManageCases;
  let cases: any;

  const CaseType = new CaseTypeService();
  const Contact = new ContactService();
  const Case = new CaseService();

  beforeEach(async () => {
    manageCases = new ManageCases();

    const caseType = setupCaseType()[0];
    const contact = setupContacts()[0];
    cases = setupCases(caseType.id, contact.id);
  });

  afterEach(async () => {
    Case.cleanUp();
    Contact.cleanUp();
    CaseType.cleanUp();
  });

  describe('as case user', function () {
    beforeEach(async () => {
      await global.browser.loginUsingCookiesAs('case_user');
      await manageCases.navigate(global.page);
      await manageCases.waitForPageLoad(global.page);
    });

    describe('when changing case status', function () {
      beforeEach(async () => {
        await manageCases.enableBulkActionFor(global.page, 'visible', 'change-case-status');
        await manageCases.navigate(global.page, { status: 'Resolved' });
        await manageCases.waitForPageLoad(global.page);
      });

      it('EXT-1342:: changes the status of the selected cases', async () => {
        const noOfCaseMovedToNewStatus = await (await global.page.$$(manageCases.selectors.caseCard)).length;

        expect(noOfCaseMovedToNewStatus).toBe(2);
      });
    });

    describe('when sending email', function () {
      let activityTabForCase1: ActivityTabCaseDetails;
      let activityTabForCase2: ActivityTabCaseDetails;
      let emailCreatedForCase1: boolean;
      let emailCreatedForCase2: boolean;

      beforeEach(async () => {
        await manageCases.enableBulkActionFor(global.page, 'visible', 'send-email');

        activityTabForCase1 = new ActivityTabCaseDetails(cases[0].id, 1);
        await activityTabForCase1.navigate(global.page);
        await activityTabForCase1.waitForPageLoad(global.page);
        emailCreatedForCase1 = await ifAnEmailHasBeenCreatedFor(activityTabForCase1);

        activityTabForCase2 = new ActivityTabCaseDetails(cases[1].id, 1);
        await activityTabForCase2.navigate(global.page);
        await activityTabForCase2.waitForPageLoad(global.page);
        emailCreatedForCase2 = await ifAnEmailHasBeenCreatedFor(activityTabForCase2);
      });

      it('EXT-1341:: sends an email for all selected cases', async () => {
        expect(emailCreatedForCase1 && emailCreatedForCase2).toBe(true);
      });

      /**
       * @param activityTab activity tab page object
       * @returns boolean
       */
      async function ifAnEmailHasBeenCreatedFor (activityTab: ActivityTabCaseDetails): Promise<boolean> {
        const isEmailIconVisible = await global.page.isVisible(activityTab.selectors.successfulEmailActivitySent);
        const isEmailActivityTypeVisible = await global.page.isVisible(activityTab.selectors.emailActivityType);
        const isEmailCreatedWithCorrectSubject = await global.page.isVisible(activityTab.selectors.emailActivitySybject);

        return isEmailIconVisible && isEmailActivityTypeVisible && isEmailCreatedWithCorrectSubject;
      }
    });
  });

  /**
   * @returns case type ids
   */
  function setupCaseType (): CiviApiResponseValue[] {
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
        case_type_category: 1,
        title: 'E2E CaseType',
        definition: definition
      }
    ]);
  }

  /**
   * @returns contact ids
   */
  function setupContacts (): CiviApiResponseValue[] {
    return Contact.create([{
      sequential: '1',
      contact_type: 'Individual',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com'
    }]);
  }

  /**
   * @param caseTypeID case type ids
   * @param clientID client ids
   * @returns case ids
   */
  function setupCases (caseTypeID: string, clientID: string): CiviApiResponseValue[] {
    const cases = [
      {
        sequential: '1',
        contact_id: clientID,
        subject: 'Case 1',
        case_type_id: caseTypeID,
        status_id: 'Open',
        start_date: ''
      },
      {
        sequential: '1',
        contact_id: clientID,
        subject: 'Case 2',
        case_type_id: caseTypeID,
        status_id: 'Open',
        start_date: ''
      }
    ];

    return Case.create(cases);
  }
});
