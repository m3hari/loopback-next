// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {test} from './utils';

const BUFFER_SCHEMA = {type: 'string', format: 'byte'};

describe('coerce param from string to buffer', () => {
  const testValues = {
    base64: Buffer.from('Hello World').toString('base64'),
  };
  /*tslint:disable:max-line-length*/
  test([
    'base64',
    BUFFER_SCHEMA,
    testValues.base64,
    Buffer.from(testValues.base64, 'base64'),
  ]);
});
