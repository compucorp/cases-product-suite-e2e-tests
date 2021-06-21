import BaseEntityService from './base-entity.service';
import CiviApiResponseValue from '../../interfaces/civi-response-value.interface';
import CiviApiParam from '../../interfaces/civi-api-param.interface';
import EmailService from './email.service';
import { chain } from 'lodash';

/**
 * Contact Entity Service
 */
export default class ContactService extends BaseEntityService {
  /**
   * Constructor.
   */
  constructor () {
    super('Contact');
  }

  /**
   * Create Contacts.
   *
   * @param params parameters
   * @returns created entities
   */
  create (params: CiviApiParam[]): CiviApiResponseValue[] {
    const response = super.create(params);

    const Email = new EmailService();
    const emailParams =
      chain(params)
        .each(function (param, index) {
          param.index = index;
        })
        .filter(function (param) {
          return param !== undefined;
        })
        .map(function (param) {
          return {
            sequential: '1',
            email: param.email,
            contact_id: response[param.index].id
          };
        })
        .value();

    Email.create(emailParams);

    return response;
  }
}
