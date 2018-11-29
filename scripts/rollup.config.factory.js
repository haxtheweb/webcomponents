import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";

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
        presets: ["@babel/preset-env"],
        plugins: [
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-syntax-import-meta"
        ]
      }),
      terser(),
      del({ targets: "build" })
    ],
    external: id => id.startsWith("..")
  };
}

export default function factory({ elementName, className } = {}) {
  return [umdConfig({ elementName, className })];
}
