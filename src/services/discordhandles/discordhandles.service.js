// Initializes the `discordhandles` service on path `/discordhandles`
const { Discordhandles } = require('./discordhandles.class');
const createModel = require('../../models/discordhandles.model');
const hooks = require('./discordhandles.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/discordhandles', new Discordhandles(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('discordhandles');

  service.hooks(hooks);
};
