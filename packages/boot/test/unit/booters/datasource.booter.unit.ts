// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect, TestSandbox, sinon} from '@loopback/testlab';
import {resolve} from 'path';
import {AppWithRepository, RepositoryMixin} from '@loopback/repository';
import {DataSourceBooter, DataSourceDefaults} from '../../../src';
import {Application} from '@loopback/core';

describe('datasource booter unit tests', () => {
  const SANDBOX_PATH = resolve(__dirname, '../../../.sandbox');
  const sandbox = new TestSandbox(SANDBOX_PATH);

  const DATASOURCES_PREFIX = 'datasources';
  const DATASOURCES_TAG = 'datasource';

  class AppWithRepo extends RepositoryMixin(Application) {}

  let app: AppWithRepo;
  let stub: sinon.SinonStub;

  beforeEach('reset sandbox', () => sandbox.reset());
  beforeEach(getApp);
  beforeEach(createStub);
  afterEach(restoreStub);

  it('gives a wanring if called on an app without RepositoryMixin', async () => {
    const normalApp = new Application();
    await sandbox.copyFile(
      resolve(__dirname, '../../fixtures/multiple.artifact.js'),
    );

    const booterInst = new DataSourceBooter(
      normalApp as AppWithRepository,
      SANDBOX_PATH,
    );

    booterInst.discovered = [resolve(SANDBOX_PATH, 'multiple.artifact.js')];
    await booterInst.load();

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(
      stub,
      'app.dataSource() function is needed for DataSourceBooter. You can add ' +
        'it to your Application using RepositoryMixin from @loopback/repository.',
    );
  });

  it(`uses DataSourceDefaults for 'options' if none are given`, () => {
    const booterInst = new DataSourceBooter(app, SANDBOX_PATH);
    expect(booterInst.options).to.deepEqual(DataSourceDefaults);
  });

  it('overrides defaults with provided options and uses defaults for the rest', () => {
    const options = {
      dirs: ['test'],
      extensions: ['.ext1'],
    };
    const expected = Object.assign({}, options, {
      nested: DataSourceDefaults.nested,
    });

    const booterInst = new DataSourceBooter(app, SANDBOX_PATH, options);
    expect(booterInst.options).to.deepEqual(expected);
  });

  it('binds datasources during the load phase', async () => {
    const expected = [
      `${DATASOURCES_PREFIX}.artifact-one`,
      `${DATASOURCES_PREFIX}.artifact-two`,
    ];
    await sandbox.copyFile(
      resolve(__dirname, '../../fixtures/multiple.artifact.js'),
    );
    const booterInst = new DataSourceBooter(app, SANDBOX_PATH);
    const NUM_CLASSES = 2; // 2 classes in above file.

    booterInst.discovered = [resolve(SANDBOX_PATH, 'multiple.artifact.js')];
    await booterInst.load();

    const datasources = app.findByTag(DATASOURCES_TAG);
    const keys = datasources.map(binding => binding.key);
    expect(keys).to.have.lengthOf(NUM_CLASSES);
    expect(keys.sort()).to.eql(expected.sort());
  });

  function getApp() {
    app = new AppWithRepo();
  }

  function restoreStub() {
    stub.restore();
  }

  function createStub() {
    stub = sinon.stub(console, 'warn');
  }
});
