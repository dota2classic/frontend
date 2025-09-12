// eslint-disable-next-line @typescript-eslint/no-var-requires
/* eslint-disable */
const fs = require("fs");

const componentName = process.argv[2];

const componentSource = `
import React from "react"

import { } from ".."

import c from "./${componentName}.module.scss"

interface I${componentName}Props {
  
}

export const ${componentName}: React.FC<I${componentName}Props> = ({ }) => {
  return (
    <>
    </>
  )
}

`;

const componentStyle = `@use "../../common.scss";\n`;

fs.mkdirSync(`./src/containers/${componentName}`);
fs.appendFileSync(
  `./src/containers/${componentName}/${componentName}.module.scss`,
  componentStyle,
);
fs.appendFileSync(
  `./src/containers/${componentName}/${componentName}.tsx`,
  componentSource,
);
fs.appendFileSync(
  `./src/containers/${componentName}/index.ts`,
  `export { ${componentName} } from "./${componentName}";\n`,
);
