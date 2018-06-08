// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const util = require('util');
const {isExtension, titleCase, kebabCase} = require('./utils');

function getTypes(candidates, options) {
  const types = candidates.map(t => mapSchemaType(t, options));
  return Array.from(new Set(types));
}

/**
 *
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#data-types
 *
 * @param {object} schema
 */
function mapSchemaType(schema, options) {
  options = options || {};
  let defaultVal = '';
  if (options.includeDefault && schema.default !== undefined) {
    defaultVal = ' = ' + JSON.stringify(schema.default);
  }

  if (!options.objectTypeMapping) {
    options.objectTypeMapping = new Map();
  }

  const opts = Object.assign({}, options, {includeDefault: false});
  if (Array.isArray(schema.oneOf) && schema.oneOf.length) {
    return getTypes(schema.oneOf, opts).join(' | ') + defaultVal;
  }

  if (Array.isArray(schema.anyOf) && schema.anyOf.length) {
    return getTypes(schema.anyOf, opts).join(' | ') + defaultVal;
  }

  if (Array.isArray(schema.allOf) && schema.allOf.length) {
    return getTypes(schema.allOf, opts).join(' & ') + defaultVal;
  }

  if (schema.type === 'array') {
    return mapSchemaType(schema.items, opts) + '[]' + defaultVal;
  }

  const objectTypeMapping = options.objectTypeMapping;
  if (schema.type === 'object' || schema.properties) {
    let entry = objectTypeMapping && objectTypeMapping.get(schema);
    entry = entry || {};
    if (entry.definition) {
      return entry.name || entry.definition;
    }
    const properties = [];
    const required = schema.required || [];
    for (const p in schema.properties) {
      const suffix = required.includes(p) ? '' : '?';
      const propertyType = mapSchemaType(
        schema.properties[p],
        Object.assign({}, options, {
          includeDefault: true,
        }),
      );
      properties.push({
        name: p,
        signature: `${p + suffix}: ${propertyType};`,
        decoration: `@property('${p}')`,
      });
    }
    entry.properties = properties;
    const signatures = properties.map(p => p.signature);
    entry.definition = `{
  ${signatures.join('\n  ')}
}`;
    objectTypeMapping.set(schema, entry);
    return entry.name || entry.definition;
  }

  /**
   * integer	integer	int32	    signed 32 bits
   * long	    integer	int64	    signed 64 bits
   * float	  number	float
   * double	  number	double
   * string	  string
   * byte	    string	byte	    base64 encoded characters
   * binary	  string	binary	  any sequence of octets
   * boolean	boolean
   * date	    string	date	    As defined by full-date - RFC3339
   * dateTime	string	date-time	As defined by date-time - RFC3339
   * password	string	password	A hint to UIs to obscure input.
   */
  let jsType = 'string';
  switch (schema.type) {
    case 'integer':
    case 'number':
      jsType = 'number';
      break;
    case 'boolean':
      jsType = 'boolean';
      break;
    case 'string':
      switch (schema.format) {
        case 'date':
        case 'date-time':
          jsType = 'Date';
          break;
        case 'binary':
          jsType = 'Buffer';
          break;
        case 'byte':
        case 'password':
          jsType = 'string';
          break;
      }
      break;
  }

  return jsType + defaultVal;
}

/**
 * Generate model definitions from openapi spec
 * @param {object} apiSpec
 */
function generateModelSpecs(apiSpec) {
  const objectTypeMapping = new Map();
  const options = {objectTypeMapping};

  const schemas =
    (apiSpec && apiSpec.components && apiSpec.components.schemas) || {};

  // First map schema objects to names
  for (const modelName in schemas) {
    if (isExtension(modelName)) continue;
    objectTypeMapping.set(schemas[modelName], {
      name: modelName,
      className: titleCase(modelName),
      fileName: getModelFileName(modelName),
    });
  }

  // Generate models from schema objects
  for (const modelName in schemas) {
    if (isExtension(modelName)) continue;
    mapSchemaType(schemas[modelName], {objectTypeMapping});
  }
  return Array.from(objectTypeMapping.values());
}

function getModelFileName(modelName) {
  let name = modelName;
  if (modelName.endsWith('Model')) {
    name = modelName.substring(0, modelName.length - 'Model'.length);
  }
  return kebabCase(name) + '.model.ts';
}

module.exports = {
  mapSchemaType,
  generateModelSpecs,
  getModelFileName,
};
