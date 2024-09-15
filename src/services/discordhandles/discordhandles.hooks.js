const debugMessage = async context => {
  console.log("service PARTITO! " + JSON.stringify(context));
  return context;
};

const afterMessage = async context => {
  console.log("Ho creato qualcosa spero " + JSON.stringify(context));
  return context;
};

module.exports = {
  before: {
    all: [debugMessage],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [afterMessage],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
