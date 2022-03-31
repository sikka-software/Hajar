import { detect } from './browser';

export async function importModule(moduleName: string): Promise<any> {
    console.log("importing ", moduleName);
    const importedModule = await import(moduleName);
    console.log("\timported ...");
    return importedModule;
}
export async function importFs(moduleNameNode: string, ModuleNameBrowser: string) {
    const result = detect();
    let fs: any;
    if (result) {
        switch (result.type) {
          case 'browser':
            // result is an instanceof BrowserInfo
            fs = await importModule(ModuleNameBrowser);
            break;
      
          case 'node':
            // result is an instanceof NodeInfo
            fs = await importModule(moduleNameNode);
            break;
        }
      }
    return fs;
}

