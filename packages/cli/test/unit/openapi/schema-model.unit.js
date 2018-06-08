// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const expect = require('@loopback/testlab').expect;
const loadSpec = require('../../../generators/openapi/spec-loader');
const {
  generateModelSpecs,
} = require('../../../generators/openapi/schema-helper');
const path = require('path');

describe('schema to model', () => {
  let usptoSpec, petstoreSpec;
  const uspto = path.join(__dirname, '../../fixtures/openapi/uspto.yaml');
  const petstore = path.join(
    __dirname,
    '../../fixtures/openapi/petstore-expanded.yaml',
  );

  before(async () => {
    usptoSpec = await loadSpec(uspto);
    petstoreSpec = await loadSpec(petstore);
  });

  it('generates models for uspto', () => {
    const objectTypeMapping = new Map();
    const models = generateModelSpecs(usptoSpec, {objectTypeMapping});
    expect(models).to.eql([
      {
        name: 'dataSetList',
        className: 'DataSetList',
        fileName: 'data-set-list.model.ts',
        properties: [
          {
            name: 'total',
            signature: 'total?: number;',
            decoration: "@property('total')",
          },
          {
            name: 'apis',
            signature:
              'apis?: {\n  apiKey?: string;\n  apiVersionNumber?: string;\n' +
              '  apiUrl?: string;\n  apiDocumentationUrl?: string;\n}[];',
            decoration: "@property('apis')",
          },
        ],
        definition:
          '{\n  total?: number;\n  apis?: {\n  apiKey?: string;\n' +
          '  apiVersionNumber?: string;\n  apiUrl?: string;\n' +
          '  apiDocumentationUrl?: string;\n}[];\n}',
      },
      {
        properties: [
          {
            name: 'apiKey',
            signature: 'apiKey?: string;',
            decoration: "@property('apiKey')",
          },
          {
            name: 'apiVersionNumber',
            signature: 'apiVersionNumber?: string;',
            decoration: "@property('apiVersionNumber')",
          },
          {
            name: 'apiUrl',
            signature: 'apiUrl?: string;',
            decoration: "@property('apiUrl')",
          },
          {
            name: 'apiDocumentationUrl',
            signature: 'apiDocumentationUrl?: string;',
            decoration: "@property('apiDocumentationUrl')",
          },
        ],
        definition:
          '{\n  apiKey?: string;\n  apiVersionNumber?: string;\n' +
          '  apiUrl?: string;\n  apiDocumentationUrl?: string;\n}',
      },
    ]);
  });

  it('generates models for petstore', () => {
    const objectTypeMapping = new Map();
    const models = generateModelSpecs(petstoreSpec, {objectTypeMapping});
    expect(models).to.eql([
      {name: 'Pet', className: 'Pet', fileName: 'pet.model.ts'},
      {
        name: 'NewPet',
        className: 'NewPet',
        fileName: 'new-pet.model.ts',
        properties: [
          {
            name: 'name',
            signature: 'name: string;',
            decoration: `@property('name')`,
          },
          {
            name: 'tag',
            signature: 'tag?: string;',
            decoration: `@property('tag')`,
          },
        ],
        definition: '{\n  name: string;\n  tag?: string;\n}',
      },
      {
        name: 'Error',
        className: 'Error',
        fileName: 'error.model.ts',
        properties: [
          {
            name: 'code',
            signature: 'code: number;',
            decoration: `@property('code')`,
          },
          {
            name: 'message',
            signature: 'message: string;',
            decoration: `@property('message')`,
          },
        ],
        definition: '{\n  code: number;\n  message: string;\n}',
      },
      {
        properties: [
          {name: 'id', signature: 'id: number;', decoration: `@property('id')`},
        ],
        definition: '{\n  id: number;\n}',
      },
    ]);
  });
});
