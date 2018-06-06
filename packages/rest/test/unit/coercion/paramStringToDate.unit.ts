// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {test} from './utils';

const DATE_SCHEMA = {type: 'string', format: 'date'};

describe('coerce param from string to date', () => {
  /*tslint:disable:max-line-length*/
  test(['date', DATE_SCHEMA, '2015-03-01', new Date('2015-03-01')]);
});
