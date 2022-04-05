import process from "process";

export default function isReact() {
  console.log("process=", process);
  if (process.env?.npm_package_dependencies_next && process.env?.npm_config_viewer === "browser") {
    return true;
  }
  return false;
}
