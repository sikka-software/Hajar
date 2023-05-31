const fs = require("fs");
const { exec } = require("child_process");
const readline = require("readline");

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

    // Generate model content
    modelContent += `class ${modelName} {\n`;
    for (const propertyName in modelProperties) {
      const propertyType = modelProperties[propertyName];
      modelContent += `  ${propertyName} = ${propertyType};\n`;
    }
    modelContent += `}\n`;

    // Write model content to a file
    fs.writeFileSync(`./models/${modelName}.js`, modelContent);

    // Run any additional command if required (e.g., migrations)
    exec(`npm run migrate:model ${modelName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(
          `Error running migration for ${modelName}: ${error.message}`
        );
        return;
      }
      console.log(`Migration for ${modelName} completed successfully!`);
    });
  }

  rl.close();
}

module.exports = generateModelsFromJSON;
