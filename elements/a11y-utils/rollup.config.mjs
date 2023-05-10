// rollup.config.js
import configFactory from "../../scripts/rollup.config.factory.js";
import packageJson from "./package.json" assert { type: "json" };

export default configFactory(packageJson.wcfactory);
