import cvApiBatch from '../utils/cv-api.service';
import CiviApiResponseValue from '../../interfaces/civi-response-value.interface';
import CiviApiParam from '../../interfaces/civi-api-param.interface';
import CiviApiQuery from '../../interfaces/civi-api-query.interface';

/**
 * Base Entity Service
 */
export default abstract class BaseEntityService {
  entityName: string;
  entityIds: string[];

  /**
   * @param entityName name of the entity
   */
  constructor (entityName: string) {
    this.entityName = entityName;
  }

  /**
   * Create Entity.
   *
   * @param params parameters
   * @returns created entities
   */
  create (params: CiviApiParam[]): CiviApiResponseValue[] {
    this.entityIds = [];

    const apiCalls = params.map((param: CiviApiParam): CiviApiQuery => {
      return [this.entityName, 'create', param];
    });

    const apiReturnValue = cvApiBatch(apiCalls).map((entity) => {
      return entity.values[0];
    });

    this.entityIds = apiReturnValue.map((returnVal) => {
      return returnVal.id;
    });

    return apiReturnValue;
  }

  /**
   * Get Option Values.
   *
   * @param params parameters
   * @param useCache return values from cache if present
   * @returns option values
   */
  get (params: CiviApiParam, useCache: boolean): CiviApiResponseValue[] {
    return cvApiBatch([[this.entityName, 'get', params]], useCache)[0].values;
  }

  /**
   * Cleanup Entities created by this instance of the class.
   */
  cleanUp (): void {
    const apiCalls = this.entityIds.map((entityId): [string, string, CiviApiParam] => {
      return [this.entityName, 'delete', { id: entityId, skip_undelete: '1' }];
    });

    cvApiBatch(apiCalls);

    this.entityIds = [];
  }
}
