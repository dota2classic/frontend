// eslint-disable-next-line @typescript-eslint/no-var-requires
/* eslint-disable */
const fs = require("fs");

const componentName = process.argv[2];

const componentSource = `
import React from "react"

import { } from ".."

import c from "./${componentName}.module.scss"

export const ${componentName} = () => {

  return (
    <>
    </>
  )
}
`;

const componentStyle = `@import "../../common.scss";\n`;

fs.mkdirSync(`./src/components/${componentName}`);
fs.appendFileSync(
  `./src/components/${componentName}/${componentName}.module.scss`,
  componentStyle,
);
fs.appendFileSync(
  `./src/components/${componentName}/${componentName}.tsx`,
  componentSource,
);
fs.appendFileSync(
  "./src/components/index.ts",
  `export { ${componentName} } from "./${componentName}/${componentName}";\n`,
);
