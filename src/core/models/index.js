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
      let propertyOptions = "";

      if (propertyType === "ObjectId") {
        propertyOptions += `    type: Schema.Types.ObjectId,\n`;
        propertyOptions += `    required: true,\n`;
        propertyOptions += `    ref: "${propertyName}",\n`; // Set reference to the related model
      } else if (propertyType === "[ObjectId]") {
        propertyOptions += `    type: [Schema.Types.ObjectId],\n`;
        propertyOptions += `    required: true,\n`;
        propertyOptions += `    ref: "${propertyName}",\n`; // Set reference to the related model
      } else {
        propertyOptions += `    type: ${propertyType},\n`;
        propertyOptions += `    required: true,\n`;
      }
      modelContent += `  ${propertyName}: {\n`;
      modelContent += propertyOptions;
      modelContent += `  },\n`;
    }
    modelContent += `});\n\n`;
    modelContent += `const ${modelName} = mongoose.model("${modelName.toLowerCase()}s", ${modelName}Schema);\n\n`;
    modelContent += `module.exports = ${modelName};\n`;
    // Write model content to a file
    const modelsPath = path.join(process.cwd(), "models");
    createDirectory(modelsPath);

    const modelFilePath = path.join(modelsPath, `${modelName}.js`);
    writeFile(modelFilePath, modelContent);
    // Generate schema and resolvers
    const schemaContent = generateSchemaContent(modelName, modelProperties);
    const resolverContent = generateResolverContent(modelName);
    // generateRandomDocuments(modelName, modelProperties, 10);
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
// this is to generate the Schema
function generateSchemaContent(modelName, modelProperties) {
  let schemaContent = `type ${modelName} {\n`;
  for (const propertyName in modelProperties) {
    const propertyType = modelProperties[propertyName];
    if (propertyType === "ObjectId") {
      schemaContent += `  ${propertyName}: ID\n`; // Use ID type for ObjectId
    } else if (propertyType === "[ObjectId]") {
      schemaContent += `  ${propertyName}: [ID]\n`; // Use ID type for ObjectId
    } else if (propertyType === "String") {
      schemaContent += `  ${propertyName}: String\n`; // Use String type
    } else if (propertyType === "Int" || propertyType === "Number") {
      schemaContent += `  ${propertyName}: Int\n`; // Use Int type
    } else if (propertyType === "Float") {
      schemaContent += `  ${propertyName}: Float\n`; // Use Float type
    } else if (propertyType === "Boolean") {
      schemaContent += `  ${propertyName}: Boolean\n`; // Use Boolean type
    } else if (propertyType === "[String]") {
      schemaContent += `  ${propertyName}: [String]\n`; // Use array of String type
    } else if (propertyType === "[Float]") {
      schemaContent += `  ${propertyName}: [Float]\n`; // Use array of Float type
    } else if (propertyType === "[Boolean]") {
      schemaContent += `  ${propertyName}: [Boolean]\n`; // Use array of Boolean type
    } else if (typeof propertyType === "object") {
      // Handle nested fields
      schemaContent += `  ${propertyName}: ${generateNestedType(
        propertyType
      )}\n`;
    } else {
      schemaContent += `  ${propertyName}: ${propertyType}\n`; // Use the provided type
    }
  }
  schemaContent += `}\n\n`;

  schemaContent += `input ${modelName}Input {\n`;
  for (const propertyName in modelProperties) {
    const propertyType = modelProperties[propertyName];
    if (propertyType === "ObjectId") {
      schemaContent += `  ${propertyName}: ID\n`; // Use ID type for ObjectId
    } else if (propertyType === "[ObjectId]") {
      schemaContent += `  ${propertyName}: [ID]\n`; // Use ID type for ObjectId
    } else if (propertyType === "String") {
      schemaContent += `  ${propertyName}: String\n`; // Use String type
    } else if (propertyType === "Int" || propertyType === "Number") {
      schemaContent += `  ${propertyName}: Int\n`; // Use Int type
    } else if (propertyType === "Float") {
      schemaContent += `  ${propertyName}: Float\n`; // Use Float type
    } else if (propertyType === "Boolean") {
      schemaContent += `  ${propertyName}: Boolean\n`; // Use Boolean type
    } else if (propertyType === "[String]") {
      schemaContent += `  ${propertyName}: [String]\n`; // Use array of String type
    } else if (propertyType === "[Float]") {
      schemaContent += `  ${propertyName}: [Float]\n`; // Use array of Float type
    } else if (propertyType === "[Boolean]") {
      schemaContent += `  ${propertyName}: [Boolean]\n`; // Use array of Boolean type
    } else if (typeof propertyType === "object") {
      // Handle nested fields
      schemaContent += `  ${propertyName}: ${generateNestedInput(
        propertyType
      )}\n`;
    } else {
      schemaContent += `  ${propertyName}: ${propertyType}\n`; // Use the provided type
    }
  }
  schemaContent += `}\n\n`;

  schemaContent += `type Query {\n`;
  schemaContent += `  get${modelName}ById(id: ID!, roleID: ID!): ${modelName}\n`;
  schemaContent += `  getAll${modelName}s(roleID: ID!): [${modelName}]\n`;
  schemaContent += `  count${modelName}s(): Int\n`;
  schemaContent += `}\n\n`;

  schemaContent += `type Mutation {\n`;
  schemaContent += `  create${modelName}(input: ${modelName}Input): ${modelName}\n`;
  schemaContent += `  update${modelName}(id: ID!, input: ${modelName}Input): ${modelName}\n`;
  schemaContent += `  delete${modelName}(id: ID!): ${modelName}\n`;
  schemaContent += `}\n\n`;

  return schemaContent;
}

function generateNestedType(nestedFields) {
  let nestedTypeContent = "{\n";
  for (const propertyName in nestedFields) {
    const propertyType = nestedFields[propertyName];
    if (propertyType === "ObjectId") {
      nestedTypeContent += `    ${propertyName}: ID\n`; // Use ID type for ObjectId
    } else if (propertyType === "[ObjectId]") {
      nestedTypeContent += `    ${propertyName}: [ID]\n`; // Use ID type for ObjectId
    } else if (propertyType === "String") {
      nestedTypeContent += `    ${propertyName}: String\n`; // Use String type
    } else if (propertyType === "Int" || propertyType === "Number") {
      nestedTypeContent += `    ${propertyName}: Int\n`; // Use Int type
    } else if (propertyType === "Float") {
      nestedTypeContent += `    ${propertyName}: Float\n`; // Use Float type
    } else if (propertyType === "Boolean") {
      nestedTypeContent += `    ${propertyName}: Boolean\n`; // Use Boolean type
    } else if (propertyType === "[String]") {
      nestedTypeContent += `    ${propertyName}: [String]\n`; // Use array of String type
    } else if (propertyType === "[Int]") {
      nestedTypeContent += `    ${propertyName}: [Int]\n`; // Use array of Int type
    } else if (propertyType === "[Float]") {
      nestedTypeContent += `    ${propertyName}: [Float]\n`; // Use array of Float type
    } else if (propertyType === "[Boolean]") {
      nestedTypeContent += `    ${propertyName}: [Boolean]\n`; // Use array of Boolean type
    } else {
      nestedTypeContent += `    ${propertyName}: ${propertyType}\n`; // Use the provided type
    }
  }
  nestedTypeContent += "  }";
  return nestedTypeContent;
}

function generateNestedInput(nestedFields) {
  let nestedInputContent = "{\n";
  for (const propertyName in nestedFields) {
    const propertyType = nestedFields[propertyName];
    if (propertyType === "ObjectId") {
      nestedInputContent += `    ${propertyName}: ID\n`; // Use ID type for ObjectId
    } else if (propertyType === "[ObjectId]") {
      nestedInputContent += `    ${propertyName}: [ID]\n`; // Use ID type for ObjectId
    } else if (propertyType === "String") {
      nestedInputContent += `    ${propertyName}: String\n`; // Use String type
    } else if (propertyType === "Int") {
      nestedInputContent += `    ${propertyName}: Int\n`; // Use Int type
    } else if (propertyType === "Float") {
      nestedInputContent += `    ${propertyName}: Float\n`; // Use Float type
    } else if (propertyType === "Boolean") {
      nestedInputContent += `    ${propertyName}: Boolean\n`; // Use Boolean type
    } else if (propertyType === "[String]") {
      nestedInputContent += `    ${propertyName}: [String]\n`; // Use array of String type
    } else if (propertyType === "[Int]") {
      nestedInputContent += `    ${propertyName}: [Int]\n`; // Use array of Int type
    } else if (propertyType === "[Float]") {
      nestedInputContent += `    ${propertyName}: [Float]\n`; // Use array of Float type
    } else if (propertyType === "[Boolean]") {
      nestedInputContent += `    ${propertyName}: [Boolean]\n`; // Use array of Boolean type
    } else {
      nestedInputContent += `    ${propertyName}: ${propertyType}\n`; // Use the provided type
    }
  }
  nestedInputContent += "  }";
  return nestedInputContent;
}

// Here we generate the resolver content
function generateResolverContent(modelName) {
  let resolverContent = `const ${modelName} = require("../../models/${modelName}.js");
const RoleModel = require("../../models/Role.js");
const { GraphQLError } = require("graphql");
const grants = require("../../utils/grants.js");
  
const resolvers = {
  Query: {
    get${modelName}ById: async (parent, args, context, info) => {
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
              permission.grant === grants.${modelName.toLowerCase()} && permission.read === true
          )
        ) {
          return new GraphQLError("You are not allowed to read ${modelName}", {
            extensions: { code: "not-authorized" },
          });
        }
        const ${modelName.toLowerCase()} = await ${modelName}.findById(id);
        if (!${modelName.toLowerCase()}) {
          throw new Error("${modelName} not found.");
        }
        return { ...${modelName.toLowerCase()}._doc, _id: ${modelName.toLowerCase()}.id };
      } catch (errorAuthorizationget${modelName}ById) {
        console.log(
          "Something went wrong during checking authorization getting ${modelName} by id.",
          errorAuthorizationget${modelName}ById
        );
        return new GraphQLError(
          "Something went wrong during checking authorization getting ${modelName} by id",
          {
            extensions: {
              code: "server-error",
            },
          }
        );
      }
    },
    getAll${modelName}s: async (parent, args, context, info) => {
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
        if (!${modelName}s || ${modelName}s.length === 0) {
          throw new Error("${modelName} not found.");
        }
        return ${modelName}s.map((${modelName}) => ({ ...${modelName}._doc }));
      } catch (errorAuthorizationget${modelName}s) {
        console.log(
          "Something went wrong during checking authorization getting ${modelName}.",
          errorAuthorizationget${modelName}s
        );
        return new GraphQLError("Something went wrong during checking authorization getting ${modelName}.", {
          extensions: {
            code: "server-error",
          },
        });
      }
    },
    count${modelName}s: async () => {
      const count = await ${modelName}.countDocuments();
      return count;
    },
  },

  Mutation: {
    create${modelName}: async (parent,{input}) => {
      try {
        console.log("Resolving create${modelName} mutation...");

        const ${modelName.toLowerCase()} = await ${modelName}.create({input});
        return { ...${modelName.toLowerCase()}._doc };

        }catc (errorcatchCreate${modelName}) {
        console.log("Something went wrong during creating ${modelName}.", errorcatchCreate${modelName});
        return new GraphQLError("Something went wrong during creating ${modelName}.", {
          extensions: { code: "server-error" },
        });
      }
    },
    update${modelName}: async (parent, {id , input}) => {
      try {
        console.log("Resolving update${modelName} mutation...");
        const ${modelName.toLowerCase()} = await ${modelName}.findByIdAndUpdate(
          id,
          input,
          { new: true }
        )

        if (!${modelName.toLowerCase()}) {
          throw new Error("${modelName} not found.");
        }
        return { ...${modelName.toLowerCase()}._doc};
      } catch (errorcatchUpdate${modelName}) {
        console.log("Something went wrong during updating ${modelName}.", errorcatchUpdate${modelName});
        return new GraphQLError("Something went wrong during updating ${modelName}.", {
          extensions: { code: "server-error" },
        });
      }
    },
    delete${modelName}: async (parent, {id}) => {
      try {
        console.log("Resolving delete${modelName} mutation...");
        const ${modelName.toLowerCase()} = await ${modelName}.findByIdAndDelete(id);

        if (!${modelName.toLowerCase()}) {
          throw new Error("${modelName} not found.");
        }
        return ${modelName.toLowerCase()}
      } catch (errorcatchDelete${modelName}) {
        console.log("Something went wrong during deleting ${modelName}.", errorcatchDelete${modelName});
        return new GraphQLError("Something went wrong during deleting ${modelName}.", {
          extensions: { code: "server-error" },
        });
      }
    },
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