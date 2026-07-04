const bcrypt = require('bcryptjs');

const collections = {
  Admin: [],
  Category: [],
  Design: [],
  TeamMember: [],
  Inquiry: []
};

const registry = {};

class Schema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options;
    this.pres = {};
    this.methods = {};
  }
  pre(event, fn) {
    this.pres[event] = this.pres[event] || [];
    this.pres[event].push(fn);
  }
}
Schema.Types = {
  ObjectId: 'ObjectId'
};

function matchesQuery(doc, query) {
  for (const [key, val] of Object.entries(query)) {
    if (key === '$or') {
      const matched = val.some(subQuery => matchesQuery(doc, subQuery));
      if (!matched) return false;
      continue;
    }

    let docVal = doc[key];
    if (docVal && typeof docVal === 'object' && docVal._id) {
      docVal = docVal._id;
    }

    if (val && typeof val === 'object' && val.$regex) {
      const regex = new RegExp(val.$regex, val.$options || '');
      if (!regex.test(String(docVal || ''))) return false;
    } else if (val && typeof val === 'object' && val.$ne) {
      if (String(docVal) === String(val.$ne)) return false;
    } else {
      if (String(docVal) !== String(val)) return false;
    }
  }
  return true;
}

function filterCollection(collection, query) {
  if (!query || Object.keys(query).length === 0) return [...collection];
  return collection.filter(doc => matchesQuery(doc, query));
}

class MockQuery {
  constructor(results, singleResult = false) {
    this.results = results;
    this.singleResult = singleResult;
  }

  sort(criteria) {
    if (criteria && typeof criteria === 'object') {
      const [key, dir] = Object.entries(criteria)[0];
      this.results.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA < valB) return dir === -1 ? 1 : -1;
        if (valA > valB) return dir === -1 ? -1 : 1;
        return 0;
      });
    }
    return this;
  }

  populate(path, select) {
    for (const doc of this.results) {
      if (doc[path]) {
        const refId = doc[path];
        const refDoc = collections['Category'] && collections['Category'].find(c => String(c._id) === String(refId));
        if (refDoc) {
          doc[path] = { ...refDoc };
        }
      }
    }
    return this;
  }

  then(onFulfilled, onRejected) {
    const value = this.singleResult ? (this.results[0] || null) : this.results;
    return Promise.resolve(value).then(onFulfilled, onRejected);
  }
}

function model(name, schema) {
  if (registry[name]) return registry[name];

  collections[name] = collections[name] || [];

  class MockModel {
    constructor(data) {
      Object.assign(this, data);
      this._id = this._id || 'mock_id_' + Math.random().toString(36).substr(2, 9);
      this.createdAt = this.createdAt || new Date();
      this.updatedAt = this.updatedAt || new Date();
      
      this.isModified = function(path) {
        return true;
      };

      if (schema && schema.methods) {
        for (const [key, fn] of Object.entries(schema.methods)) {
          this[key] = fn.bind(this);
        }
      }
    }

    async save() {
      if (schema && schema.pres && schema.pres.save) {
        for (const fn of schema.pres.save) {
          await new Promise((resolve, reject) => {
            fn.call(this, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      }

      const collection = collections[name];
      const index = collection.findIndex(doc => String(doc._id) === String(this._id));
      if (index >= 0) {
        collection[index] = this;
      } else {
        collection.push(this);
      }
      return this;
    }

    async deleteOne() {
      const collection = collections[name];
      const index = collection.findIndex(doc => String(doc._id) === String(this._id));
      if (index >= 0) {
        collection.splice(index, 1);
      }
      return { deletedCount: 1 };
    }
  }

  MockModel.modelName = name;
  MockModel.schema = schema;

  MockModel.find = function(query = {}) {
    let results = filterCollection(collections[name], query);
    let cloned = results.map(d => new MockModel(JSON.parse(JSON.stringify(d))));
    return new MockQuery(cloned);
  };

  MockModel.findOne = function(query = {}, projection = {}, options = {}) {
    let results = filterCollection(collections[name], query);
    let cloned = results.map(d => new MockModel(JSON.parse(JSON.stringify(d))));
    let q = new MockQuery(cloned, true);
    if (projection && typeof projection === 'object' && projection.sort) {
      q.sort(projection.sort);
    }
    if (options && typeof options === 'object' && options.sort) {
      q.sort(options.sort);
    }
    return q;
  };

  MockModel.findById = function(id) {
    let doc = collections[name].find(d => String(d._id) === String(id));
    let cloned = doc ? [new MockModel(JSON.parse(JSON.stringify(doc)))] : [];
    return new MockQuery(cloned, true);
  };

  MockModel.findByIdAndDelete = async function(id) {
    const index = collections[name].findIndex(d => String(d._id) === String(id));
    if (index >= 0) {
      const doc = collections[name].splice(index, 1)[0];
      return new MockModel(JSON.parse(JSON.stringify(doc)));
    }
    return null;
  };

  MockModel.insertMany = async function(arr) {
    const docs = [];
    for (const item of arr) {
      const doc = new MockModel(item);
      await doc.save();
      docs.push(doc);
    }
    return docs;
  };

  MockModel.countDocuments = async function(query = {}) {
    let results = filterCollection(collections[name], query);
    return results.length;
  };

  MockModel.deleteMany = async function(query = {}) {
    if (Object.keys(query).length === 0) {
      collections[name].length = 0;
    } else {
      let keep = collections[name].filter(doc => !matchesQuery(doc, query));
      collections[name].length = 0;
      collections[name].push(...keep);
    }
    return { deletedCount: 1 };
  };

  registry[name] = MockModel;
  return MockModel;
}

const mockMongoose = {
  Schema,
  model,
  connect: async () => {
    console.log('Mock MongoDB Connected (In-Memory Mock Active)');
    return {
      connection: {
        host: 'mock-in-memory-db'
      }
    };
  },
  connection: {
    on: () => {},
    once: () => {}
  }
};

module.exports = mockMongoose;
