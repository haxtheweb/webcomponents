import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

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
      commonjs(),
      babel({
        presets: ["@babel/preset-env"]
      }),
      terser()
    ],
    external: id => id.startsWith("..")
  };
}

export default function factory({ elementName, className } = {}) {
  return [umdConfig({ elementName, className })];
}
