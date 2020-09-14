import babel from "rollup-plugin-babel"
import commonJS from "rollup-plugin-commonjs"
import pkg from "./package.json"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "rollup-plugin-typescript2"

const input = "src/index.tsx"
const external = Object.keys(pkg.peerDependencies || {})

/** @type {import('rollup').RollupOptions} */
export default [
    {
        input,
        output: {
            file: `${pkg.module}`,
            format: "es",
        },
        external,
        plugins: [
            typescript({
                typescript: require("typescript"),
                tsconfig: "./tsconfig.build.json",
            }),
            resolve(),
            babel({
                exclude: [/\/core-js\//, "node_modules/**"],
                runtimeHelpers: true,
            }),
            commonJS(),
        ],
    },
    {
        input,
        output: {
            file: `${pkg.main}`,
            format: "cjs",
        },
        external,
        plugins: [
            typescript({
                typescript: require("typescript"),
                tsconfig: "./tsconfig.build.json",
            }),
            resolve(),
            babel({
                exclude: [/\/core-js\//, "node_modules/**"],
                runtimeHelpers: true,
            }),
            commonJS(),
        ],
    },
]
