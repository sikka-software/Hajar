const fs = require("fs");
const { exec } = require("child_process");
const readline = require("readline");
const path = require("path");

function generateModelsFromJSON(jsonFilePath) {
  // Read the JSON file
  let models = null;
  try {
    const fs = require("fs");
    const { exec } = require("child_process");
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

        const schemaFilePath = path.join(
          typesPath,
          `${modelName}.type.graphql`
        );
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
  schemaContent += `  get${modelName}(id: ID! , roleID : ID!): ${modelName}\n`;
  schemaContent += `  getAll${modelName}s(roleID: ID!): [${modelName}]\n`;
  schemaContent += `  count${modelName}s(roleID: ID!): Int\n`;
  schemaContent += `}\n\n`;

  return schemaContent;
}

function generateResolverContent(modelName) {
  let resolverContent = `const ${modelName} = require("../../models/${modelName}.js");
const RoleModel = require("../../models/Role.js");
const { GraphQLError } = require("graphql");
const grants = require("../../grants.json");
  
const resolvers = {
Query: {
  get${modelName}: async (parent, args, context, info) => {
    try {
      console.log("Resolving get${modelName} query...")
      const { id , roleID } = args;
      const role = await RoleModel.findById(roleID).populate("permissions");
      console.log("role", role);
      if (!role) {
        return new GraphQLError("This role does not exist", {
          extensions: { code: "invalid-input" },
        });
      }
      if (
        !role.permissions.find(
          (permission) =>
            permission.grant === grants.customer && permission.read === true
        )
      ) {
        return new GraphQLError("You are not allowed to read ${modelName}", {
          extensions: { code: "not-authorized" },
        });
      }
      const result = await ${modelName}.findById(id);
      if (!result) {
        throw new Error("${modelName} not found.");
      }
      return {...result._doc, _id: result.id};
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get ${modelName}. Please try again later.");
    }
  },
  getAll${modelName}s: async () => {
    try {
      console.log("Resolving get${modelName} query...")
      const { roleID } = args;
      console.log("actorRole", roleID);
      const role = await RoleModel.findById(roleID).populate("permissions");
      console.log("role", role);
      console.log("role", role);
      if (!role) {
        return new GraphQLError("This role does not exist", {
          extensions: { code: "invalid-input" },
        });
      }
      if (
        !role.permissions.find(
          (permission) =>
            permission.grant === grants.${modelName.toLowerCase()} && permission.read === true
        )
      ) {
        return new GraphQLError("You are not allowed to read ${modelName.toLowerCase()}s", {
          extensions: { code: "not-authorized" },
        });
      }
      const ${modelName}s = await ${modelName}.find();
      if(!${modelName}s || ${modelName}s.length === 0) {
        throw new Error("${modelName} not found.");
      }
      return ${modelName}s.map(${modelName} => {
        ...${modelName}._doc,
      }
      ));
      catch (errorAuthorizationge${modelName}s) {
        console.log(
          "Something went wrong during checking authorization getting ${modelName}.",
          errorAuthorizationget${modelName}s
        );
        return new GraphQLError(
          "Something went wrong during checking authorization getting ${modelName}.",
          {
            extensions: {
              code: "server-error",
            },
          }
        );
      }
    },
};

module.exports = resolvers;
`;

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
