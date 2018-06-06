// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {test} from './utils';

const BOOLEAN_SCHEMA = {type: 'boolean'};

describe('coerce param from string to boolean', () => {
  /*tslint:disable:max-line-length*/
  test(['false', BOOLEAN_SCHEMA, 'false', false]);
  test(['true', BOOLEAN_SCHEMA, 'true', true]);
  test(['undefined', BOOLEAN_SCHEMA, undefined, undefined]);
});
