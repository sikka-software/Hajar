const shortid = require("shortid");
const { buildSchema } = require("graphql");
const Schema = global.__mongoose.Schema;

function buildSchemaModel(name, fields, type) {
  var customType = `type ${name} {`;
  if (!type) {
    customType = `${customType} _id: ID! `;
  }
  for (const [key, value] of Object.entries(fields)) {
    if (value.type === Schema.Types.ObjectId) {
      customType = `${customType} ${key}: ${ref}`;
    } else {
      customType = `${customType} ${key}: ${value.type}`;
    }
    if (value.required === true) {
      customType = `${customType}! `;
    }
  }
  if (!type) {
    customType = `${customType} createdAt: String updatedAt: String`;
  }
  customType = `}`;
  return customType;
}

function buildMutationsQueriesModel(name, fields, type) {
  var customMutation = `
    userPremium(userId: ID!): User 
    userPremium(userId: ID!): User 
    createUser(userInput: UserInput): User 
    updateUser(userId: ID!, userUpdate: UserUpdate): User 
    deleteUser(userId: ID!, email : String!): User`;
  return customMutation;
}

function buildRoot(types, queries, mutations) {
  var customMutation = buildSchema(`
    type RootQuery {
        ${queries}
    }
    type RootMutation {
        ${mutations}
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `);
  return customMutation;
}

function createModel(name, fields, schema = false) {
  if (fields) {
    const customSchema = new Schema(fields, { timestamps: true });
    return mongoose.model(name, customSchema);
  }
}

module.exports = {
  createModel: createModel,
  createSchema: buildSchemaModel,
  createMutationsQueries: buildMutationsQueriesModel,
  createRoot: buildRoot
};
