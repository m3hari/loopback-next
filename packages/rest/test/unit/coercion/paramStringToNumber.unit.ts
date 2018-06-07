// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {test} from './utils';
import {ParameterLocation} from '@loopback/openapi-v3-types';
import * as HttpErrors from 'http-errors';
import {HttpErrorMessage} from './../../../';

const NUMBER_PARAM = {
  in: <ParameterLocation>'path',
  name: 'aparameter',
  schema: {type: 'number'},
};

const REQUIRED_NUMBER_PARAM = {
  in: <ParameterLocation>'path',
  name: 'aparameter',
  schema: {type: 'number'},
  required: true,
};

const FLOAT_PARAM = {
  in: <ParameterLocation>'path',
  name: 'aparameter',
  schema: {
    type: 'number',
    float: 'float',
  },
};

const DOUBLE_PARAM = {
  in: <ParameterLocation>'path',
  name: 'aparameter',
  schema: {
    type: 'number',
    float: 'double',
  },
};

/*tslint:disable:max-line-length*/
describe('coerce param from string to number - required', () => {
  context('valid values', () => {
    test<number>(REQUIRED_NUMBER_PARAM, '0', 0);
    test<number>(REQUIRED_NUMBER_PARAM, '1', 1);
    test<number>(REQUIRED_NUMBER_PARAM, '-1', -1);
  });

  context('empty values trigger ERROR_BAD_REQUEST', () => {
    // null, '' sent from request are converted to raw value ''
    const errorMsg = HttpErrorMessage.MISSING_REQUIRED(
      REQUIRED_NUMBER_PARAM.name,
    );
    test<HttpErrors.HttpError>(
      REQUIRED_NUMBER_PARAM,
      '',
      new HttpErrors['400'](errorMsg),
    );
  });
});

describe('coerce param from string to number - optional', () => {
  context('valid values', async () => {
    test<number>(NUMBER_PARAM, '0', 0);
    test<number>(NUMBER_PARAM, '1', 1);
    test<number>(NUMBER_PARAM, '-1', -1);
    test<number>(NUMBER_PARAM, '1.2', 1.2);
    test<number>(NUMBER_PARAM, '-1.2', -1.2);
  });

  context('numbers larger than MAX_SAFE_INTEGER get trimmed', () => {
    test<number>(NUMBER_PARAM, '2343546576878989879789', 2.34354657687899e21);
    test<number>(NUMBER_PARAM, '-2343546576878989879789', -2.34354657687899e21);
  });

  context('scientific notations', () => {
    test<number>(NUMBER_PARAM, '1.234e+30', 1.234e30);
    test<number>(NUMBER_PARAM, '-1.234e+30', -1.234e30);
  });

  context('empty value converts to undefined', () => {
    // [], {} sent from request are converted to raw value undefined
    test<undefined>(NUMBER_PARAM, undefined, undefined);
  });

  context('All other non-number values trigger ERROR_BAD_REQUEST', () => {
    let errorMsg = HttpErrorMessage.INVALID_DATA('text', NUMBER_PARAM.name);
    // 'false', false, 'true', true, 'text' sent from request are convert to a string
    test<HttpErrors.HttpError>(
      NUMBER_PARAM,
      'text',
      new HttpErrors['400'](errorMsg),
    );

    errorMsg = HttpErrorMessage.INVALID_DATA({a: true}, NUMBER_PARAM.name);
    // {a: true}, [1,2] are convert to object
    test<HttpErrors.HttpError>(
      NUMBER_PARAM,
      {a: true},
      new HttpErrors['400'](errorMsg),
    );
  });
});

describe('OAI3 primitive types', () => {
  test<number>(FLOAT_PARAM, '3.333333', 3.333333);
  test<number>(DOUBLE_PARAM, '3.3333333333', 3.3333333333);
});
