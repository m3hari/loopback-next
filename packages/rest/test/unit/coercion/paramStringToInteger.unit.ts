// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {test} from './utils';

const INT32_SCHEMA = {type: 'integer', format: 'int32'};
const INT64_SCHEMA = {type: 'integer', format: 'int64'};
// const INT_SCHEMA = {type: 'integer'}; will be used for future edge cases

describe('coerce param from string to integer', () => {
  /*tslint:disable:max-line-length*/
  test(['integer', INT32_SCHEMA, '100', 100]);
  test(['long', INT64_SCHEMA, '9223372036854775807', 9223372036854775807]);
});
