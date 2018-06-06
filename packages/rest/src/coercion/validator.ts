// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  SchemaObject,
  ReferenceObject,
  isReferenceObject,
} from '@loopback/openapi-v3-types';
import * as HttpErrors from 'http-errors';
import * as debugModule from 'debug';

const debug = debugModule('loopback:rest:coercion');

/**
 * A set of options to pass into the validator functions
 */
export type ValidationOptions = {
  required?: boolean;
};

/**
 * The context information that a validator needs
 */
export type ValidationContext = {
  schema?: SchemaObject;
};

/**
 * Validator class provides a bunch of functions that perform
 * validations on the request parameters and request body.
 */
export class Validator {
  constructor(public ctx: ValidationContext) {}

  /**
   * The validation executed before type coercion. Like
   * checking absence.
   *
   * @param type A parameter's type.
   * @param value A parameter's raw value from http request.
   * @param opts options
   */
  validateParamBeforeCoercion(
    type: string,
    value: any,
    opts?: ValidationOptions,
  ) {
    if (this.isAbsent(value)) {
      if (this.isRequired(opts)) {
        throw new HttpErrors['400']();
      } else {
        return;
      }
    }
  }

  /**
   * Check is a parameter required or not.
   *
   * @param opts
   */
  isRequired(opts?: ValidationOptions) {
    if (this.ctx && this.ctx.schema && this.ctx.schema.required) return true;
    if (opts && opts.required) return true;
    return false;
  }

  /**
   * The validation executed after type coercion. Like
   * checking invalid values.
   *
   * @param type A parameter's type.
   * @param value A parameter's raw value from http request.
   * @param opts options.
   */

  validateParamAfterCoercion(
    type: string,
    value: any,
    opts?: ValidationOptions,
  ) {
    switch (type) {
      case 'number':
        this.validateNumber(value);
        break;
      //@jannyhou: other types TBD
      default:
        return;
    }
  }

  /**
   * Return `true` if the value is empty, return `false` otherwise.
   *
   * @param value
   */
  isAbsent(value: any) {
    const isEmptySet = [''];
    return isEmptySet.includes(value);
  }

  /**
   * Validate the coerced value for a number type parameter.
   *
   * @param value the coerced value of a number type parameter.
   */
  validateNumber(value: any) {
    if (value === undefined) return;
    if (isNaN(value)) throw new HttpErrors['400']();
  }
}
