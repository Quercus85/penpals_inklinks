const assert = require('assert');
const app = require('../../src/app');

describe('\'discordhandles\' service', () => {
  it('registered the service', () => {
    const service = app.service('discordhandles');

    assert.ok(service, 'Registered the service');
  });
});
