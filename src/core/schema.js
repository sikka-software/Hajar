const { buildSchema } = require("graphql");

export async function CreateSchema(modelType, fields) {
  let fieldsString = "";
  for (const [fieldName, fieldType] of Object.entries(fields)) {
    fieldsString += `${fieldName}: ${fieldType}\n`;
  }
  const schema = buildSchema(`
    type ${modelType} {
        _id: ID
        ${fieldsString}
    }
    type Query {
        get${modelType}: [${modelType}]
        get${modelType}ById(id: ID!): ${modelType}

    }
    type Mutation {
        create${modelType}(${fieldsString}): ${modelType}
        update${modelType}(id: ID!, ${fieldsString}): ${modelType}
        remove${modelType}ById(id: ID!): ${modelType}
    }
  `);
  return schema;
}
