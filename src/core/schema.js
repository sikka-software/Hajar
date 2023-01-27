import * as fs from "fs";
export async function CreateSchema(modelName, fields, directory) {
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
