// rollup.config.mjs
import configFactory from "@wcfactory/rollup-umd-build";
import rhelementPackage from "./package.json";

export default configFactory(rhelementPackage.rhelement);
