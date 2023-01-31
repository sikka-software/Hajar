/*
    @Mansour
    This function will take a mongoose model and return a resolver object
*/
import * as fs from "fs";
import * as path from "path";
export async function createResolvers(model) {
  const resolverFile = `
  const ${model.modelName} = require('./models/${model.modelName}');
  module.exports = {
    Query: {
        async get${model.modelName}s() {
            return await ${model.modelName}.find();
        },
        async get${model.modelName}(_, { id }) {
            return await ${model.modelName}.findById({_id : id});
        }
    },
    Mutation: {
        async create${model.modelName}(_, { input }) {
            const new${model.modelName} = new ${model.modelName}(input);
            return await new${model.modelName}.save();
        },
        async update${model.modelName}(_, { id, input }) {
            return await ${model.modelName}.findByIdAndUpdate(id, input, { new: true });
        },
        async delete${model.modelName}(_, { id }) {
            return await ${model.modelName}.findByIdAndDelete({_id :id});
        }
    }
};
  `;
  resolverFile.trim();

  fs.writeFileSync(
    `./test/resolver/${model.modelName}.resolver.js`,
    resolverFile
  );
}
