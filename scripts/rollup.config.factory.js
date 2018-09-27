import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";

function umdConfig({ elementName, className } = {}) {
  const umdFilename = `${elementName}.umd.js`;
  return {
    input: umdFilename,
    output: {
      file: umdFilename,
      format: "umd",
      sourcemap: true,
      name: className
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        presets: [
          "@babel/preset-env",
          {
            useBuiltIns: "usage"
          }
        ]
      }),
      uglify()
    ],
    external: id => id.startsWith("..")
  };
}

export default function factory({ elementName, className } = {}) {
  return [umdConfig({ elementName, className })];
}
