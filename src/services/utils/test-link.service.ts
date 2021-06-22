import { TestLink } from 'testlink-xmlrpc';
import { Dayjs } from 'dayjs';
import xmlrpc from 'xmlrpc';

declare const process: {
  env: {
    TEST_LINK_USER: string
    TEST_LINK_PASS: string
  }
};

/**
 * Test Link Service Class
 */
export default {
  host: 'testlink.cc-infra.tools',
  secure: true,
  apiKey: 'ec40068f870aa62e03f6642ef51dc17c',
  projectName: 'Extensions & Modules',
  testPlanName: 'Regression Test Plan:: Cases',
  testPlan: null,
  testlink: null,
  build: null,

  /**
   */
  async init () {
    this.testlink = new TestLink({
      host: this.host,
      secure: this.secure,
      apiKey: this.apiKey,
      autoConnect: false
    });

    if (process.env.TEST_LINK_USER === undefined || process.env.TEST_LINK_PASS === undefined) {
      throw new Error('TEST_LINK_USER & TEST_LINK_PASS environment variables are not set.');
    }

    this.testlink.rpcClient = xmlrpc.createClient({
      host: this.testlink.host,
      port: this.testlink.port,
      path: this.testlink.rpcPath,
      basic_auth: {
        user: process.env.TEST_LINK_USER,
        pass: process.env.TEST_LINK_PASS
      }
    });

    // the 'testlink-xmlrpc' module has a bug, it does not set https,
    // hence setting it manually
    this.testlink.rpcClient.isSecure = this.secure;

    await this.getTestPlan();
  },

  /**
   */
  async getTestPlan (): Promise<void> {
    const allProjects: any = await this.testlink.getProjects();

    const project = allProjects.find((project: any) => {
      return project.name === this.projectName;
    });

    const allTestPlans: any = await this.testlink.getProjectTestPlans({
      testprojectid: project.id
    });

    this.testPlan = allTestPlans.find((project: any) => {
      return project.name === this.testPlanName;
    });
  },

  /**
   * @returns promise
   */
  async getTestCasesBy (): Promise<any> {
    return this.testlink.getTestCasesForTestPlan({
      testplanid: this.testPlan.id
    });
  },

  /**
   * @param testStartDateTime start date and time of the curent test suite
   */
  async createNewBuild (testStartDateTime: Dayjs): Promise<void> {
    const date = testStartDateTime;

    const build = await this.testlink.createBuild({
      testplanid: this.testPlan.id,
      buildname: `E2E Build - ${date.format('DD-MMMM-YYYY-HH-mm-ss')}`,
      buildnotes: `End to End Test Suite Build - ${date.format('DD-MMMM-YYYY-HH-mm-ss')}`,
      active: true,
      open: true,
      releasedate: date.format('YYYY-MMMM-DD')
    });

    this.build = build[0];
  },

  /**
   * @param testLinkID test case id
   * @param isPassed if test case has passed
   * @returns promise
   */
  async reportTestCase (testLinkID: string, isPassed: boolean): Promise<any> {
    if (testLinkID !== '') {
      const status = isPassed ? 'Passed' : 'Failed';
      console.log(`Testcase ${testLinkID} marked as ${status} in Testlink.`);

      return this.testlink.reportTCResult({
        testcaseexternalid: testLinkID,
        testplanid: this.testPlan.id,
        buildid: this.build.id,
        status: isPassed ? 'p' : 'f',
        steps: []
      });
    }
  },

  /**
   * Get the Test link ID.
   *
   * @param name name of the test
   * @returns test link id
   *
   * @example
   *  // getTestLinkID('EXT-1234::Should open popup')
   *  // returns 'EXT-1234'
   */
  getTestLinkID (name: string): string {
    return name.substr(0, name.indexOf('::'));
  }
};
