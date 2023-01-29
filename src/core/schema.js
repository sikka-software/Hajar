import * as fs from "fs";
import { buildSchema } from "graphql";
/* export async function CreateSchema(modelName, fields, directory) {
  let query = `type Query {
    all${modelName}: [${modelName}]
    ${modelName}(id: ID!): ${modelName}
  }`;

  let mutation = `type Mutation {
    create${modelName}(input: ${modelName}Input): ${modelName}
    update${modelName}(id: ID!, input: ${modelName}Input): ${modelName}
    delete${modelName}(id: ID!): ${modelName}
  }`;

  let typeDefs = `${query} ${mutation}`;

  // Create the input type for the mutations
  let inputType = `input ${modelName}Input {`;
  fields.forEach((field) => {
    inputType += `\n  ${field.name}: ${field.type}`;
  });
  inputType += `\n}`;

  // Create the model type for the schema
  let modelType = `type ${modelName} {`;
  fields.forEach((field) => {
    modelType += `\n  ${field.name}: ${field.type}`;
  });
  modelType += `\n}`;

  typeDefs += ` ${inputType} ${modelType}`;

  // Write the schema file to the specified directory
  fs.writeFileSync(`${directory}/${modelName}.graphql`, typeDefs);
}
 */

export async function CreateSchema(model) {
  let fields = Object.keys(model.schema.paths)
    .filter((key) => ["_id", "__v"].indexOf(key) === -1)
    .map((key) => `${key}: ${model.schema.paths[key].instance}`)
    .join("\n");

  let schema = `
    type ${model.modelName} {
        ${fields}
    }
    input ${model.modelName}Input {
      ${fields}
    }
    type Query {
      get${model.modelName}s: [${model.modelName}]
      get${model.modelName}(_id : ID): ${model.modelName}

    }
    type Mutation {
        create${model.modelName}(input: ${model.modelName}Input): ${model.modelName}
        update${model.modelName}(_id: ID, input: ${model.modelName}Input): ${model.modelName}
        delete${model.modelName}(_id: ID): ${model.modelName}
    }
    
    `;

  schema.trim();
  // Write the schema file to the specified directory
  fs.writeFileSync(`./test/${model.modelName}.type.graphql`, schema);
  return buildSchema(schema);
}
