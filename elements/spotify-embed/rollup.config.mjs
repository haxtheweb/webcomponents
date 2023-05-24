// rollup.config.mjs
import configFactory from "@wcfactory/rollup-umd-build";
import packageJson from "./package.json" assert { type: "json" };

export default configFactory(packageJson.wcfactory);