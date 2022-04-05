import isReact from "./environnement";

export async function importModule(moduleName: string): Promise<any | null | Error> {
  try {
    console.log("importing ", moduleName);
    const importedModule = await import(moduleName);
    console.log("\timported ...");
    return importedModule;
  } catch (e) {
    return e;
  }
  return null;
}

export default async function Hajarimport(moduleNameNode: string, ModuleNameBrowser: string) {
  let module: any;
  if (isReact()) {
    module = await importModule(ModuleNameBrowser);
  }
  else {
    module = await importModule(moduleNameNode);
  }
  return module;
}

