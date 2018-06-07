// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {test} from './utils';
import {ParameterLocation} from '@loopback/openapi-v3-types';

const BOOLEAN_PARAM = {
  in: <ParameterLocation>'path',
  name: 'aparameter',
  schema: {type: 'boolean'},
};

describe('coerce param from string to boolean', () => {
  test<boolean>(BOOLEAN_PARAM, 'false', false);
  test<boolean>(BOOLEAN_PARAM, 'true', true);
  test<undefined>(BOOLEAN_PARAM, undefined, undefined);
});
