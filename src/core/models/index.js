const fs = require("fs");
const { exec } = require("child_process");
const readline = require("readline");
const path = require("path");

function generateModelsFromJSON(jsonFilePath) {
  // Read the JSON file
  let models = null;
  try {
    const jsonData = fs.readFileSync(jsonFilePath, "utf8");
    models = JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading or parsing the models JSON file:", error);
    process.exit(1);
  }

  // Generate models
  for (const modelName in models) {
    const modelProperties = models[modelName];
    let modelContent = "";
    modelContent += `const mongoose = require("mongoose");\n`;
    modelContent += `const { Schema } = mongoose;\n\n`;
    modelContent += `const ${modelName}Schema = new Schema({\n`;
    for (const propertyName in modelProperties) {
      const propertyType = modelProperties[propertyName];
      modelContent += `  ${propertyName}: {\n`;
      modelContent += `    type: ${propertyType},\n`;
      modelContent += `    required: true,\n`;
      modelContent += `  },\n`;
    }
    modelContent += `});\n\n`;
    modelContent += `const ${modelName} = mongoose.model("${modelName.toLowerCase()}", ${modelName}Schema);\n\n`;
    modelContent += `module.exports = ${modelName};\n`;
    // Write model content to a file
    const modelsPath = path.join(process.cwd(), "models");
    createDirectory(modelsPath);

    const modelFilePath = path.join(modelsPath, `${modelName}.js`);
    writeFile(modelFilePath, modelContent);
    // Generate schema and resolvers
    const schemaContent = generateSchemaContent(modelName, modelProperties);
    const resolverContent = generateResolverContent(modelName);

    // Write schema and resolver content to files
    const projectPath = path.join(process.cwd(), "graphQl");
    const resolversPath = path.join(projectPath, "resolvers");
    const typesPath = path.join(projectPath, "types");

    createDirectory(projectPath);
    createDirectory(resolversPath);
    createDirectory(typesPath);

    const schemaFilePath = path.join(typesPath, `${modelName}.type.graphql`);
    const resolverFilePath = path.join(
      resolversPath,
      `${modelName}.resolver.js`
    );

    writeFile(schemaFilePath, schemaContent);
    writeFile(resolverFilePath, resolverContent);

    console.log(
      `Schema and resolvers for ${modelName} generated successfully!`
    );
  }
}

function generateSchemaContent(modelName, modelProperties) {
  let schemaContent = `type ${modelName} {\n`;
  for (const propertyName in modelProperties) {
    const propertyType = modelProperties[propertyName];
    schemaContent += `  ${propertyName}: ${propertyType}\n`;
  }
  schemaContent += `}\n\n`;

  schemaContent += `type Query {\n`;
  schemaContent += `  get${modelName}(id: ID!): ${modelName}\n`;
  schemaContent += `  getAll${modelName}s: [${modelName}]\n`;
  schemaContent += `}\n\n`;

  return schemaContent;
}

function generateResolverContent(modelName) {
  let resolverContent = `const ${modelName} = require("../models/${modelName}.js");\n\n`;
  resolverContent += `const resolvers = {\n`;
  resolverContent += `  Query: {\n`;
  resolverContent += `    get${modelName}: async (parent, { id }) => {\n`;
  resolverContent += `      return ${modelName}.findById(id);\n`;
  resolverContent += `    },\n`;
  resolverContent += `    getAll${modelName}s: async () => {\n`;
  resolverContent += `      return ${modelName}.find();\n`;
  resolverContent += `    },\n`;
  resolverContent += `  },\n`;
  resolverContent += `};\n\n`;
  resolverContent += `module.exports = resolvers;\n`;

  return resolverContent;
}

function createDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, (error) => {
    if (error) {
      console.error(`Error writing file: ${filePath}`, error);
      return;
    }
  });
}

module.exports = generateModelsFromJSON;
