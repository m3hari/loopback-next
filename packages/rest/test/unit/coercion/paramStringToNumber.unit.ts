// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {test, ERROR_BAD_REQUEST} from './utils';

const NUMBER_SCHEMA = {type: 'number'};
const NUMBER_SCHEMA_REQUIRED = {type: 'number', required: true};
const FLOAT_SCHEMA = {type: 'number', float: 'float'};
const DOUBLE_SCHEMA = {type: 'number', format: 'double'};

/*tslint:disable:max-line-length*/
describe('coerce param from string to number - required', () => {
  context('valid values', () => {
    test(['0', NUMBER_SCHEMA_REQUIRED, '0', 0]);
    test(['1', NUMBER_SCHEMA_REQUIRED, '1', 1]);
    test(['-1', NUMBER_SCHEMA_REQUIRED, '-1', -1]);
  });

  context('empty values trigger ERROR_BAD_REQUEST', () => {
    // null, '' sent from request are converted to raw value ''
    test(['empty string', NUMBER_SCHEMA_REQUIRED, '', ERROR_BAD_REQUEST, true]);
  });
});

describe('coerce param from string to number - optional', () => {
  context('valid values', () => {
    test(['0', NUMBER_SCHEMA, '0', 0]);
    test(['1', NUMBER_SCHEMA, '1', 1]);
    test(['-1', NUMBER_SCHEMA, '-1', -1]);
    test(['1.2', NUMBER_SCHEMA, '1.2', 1.2]);
    test(['-1.2', NUMBER_SCHEMA, '-1.2', -1.2]);
  });

  context('numbers larger than MAX_SAFE_INTEGER get trimmed', () => {
    test([
      'positive large number',
      NUMBER_SCHEMA,
      '2343546576878989879789',
      2.34354657687899e21,
    ]);
    test([
      'negative large number',
      NUMBER_SCHEMA,
      '-2343546576878989879789',
      -2.34354657687899e21,
    ]);
  });

  context('scientific notations', () => {
    test(['positive number', NUMBER_SCHEMA, '1.234e+30', 1.234e30]);
    test(['negative number', NUMBER_SCHEMA, '-1.234e+30', -1.234e30]);
  });

  context('empty value converts to undefined', () => {
    // [], {} sent from request are converted to raw value undefined
    test(['empty value as undefined', NUMBER_SCHEMA, undefined, undefined]);
  });

  context('All other non-number values trigger ERROR_BAD_REQUEST', () => {
    // 'false', false, 'true', true, 'text' sent from request are convert to a string
    test([
      'invalid value as string',
      NUMBER_SCHEMA,
      'text',
      ERROR_BAD_REQUEST,
      true,
    ]);
    // {a: true}, [1,2] are convert to object
    test([
      'invalid value as object',
      NUMBER_SCHEMA,
      {a: true},
      ERROR_BAD_REQUEST,
      true,
    ]);
  });
});

describe('OAI3 primitive types', () => {
  test(['float', FLOAT_SCHEMA, '3.333333', 3.333333]);
  test(['double', DOUBLE_SCHEMA, '3.3333333333', 3.3333333333]);
});

// Review notes: just add them for the purpose of review,
// will remove it when merge code
context('Number-like string values trigger ERROR_BAD_REQUEST', () => {
  // Copied from strong-remoting
  // these have to be in serialization acceptance tests
  // [{arg: '0'}, ERROR_BAD_REQUEST],
  // [{arg: '1'}, ERROR_BAD_REQUEST],
  // [{arg: '-1'}, ERROR_BAD_REQUEST],
  // [{arg: '1.2'}, ERROR_BAD_REQUEST],
  // [{arg: '-1.2'}, ERROR_BAD_REQUEST],
  // [{arg: '2343546576878989879789'}, ERROR_BAD_REQUEST],
  // [{arg: '-2343546576878989879789'}, ERROR_BAD_REQUEST],
  // [{arg: '1.234e+30'}, ERROR_BAD_REQUEST],
  // [{arg: '-1.234e+30'}, ERROR_BAD_REQUEST],
});
