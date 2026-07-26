const pptxgen = require("pptxgenjs");
const { setup, count } = require("./lib");

const pptx = new pptxgen();
setup(pptx, "Agentic Thinking EP03 · Model over Everything");

require("./s0-open")(pptx);
require("./s1-partA1")(pptx);
require("./s2-partA2")(pptx);
require("./s3-partA3")(pptx);
require("./s4-partA4")(pptx);
require("./s5-partB")(pptx);
require("./s6-partC1")(pptx);
require("./s7-partC2")(pptx);
require("./s8-partC3")(pptx);
require("./s9-close")(pptx);

const out = process.argv[2] || "EP3-Model-over-Everything.pptx";
pptx.writeFile({ fileName: out }).then(() => console.log("slides:", count(), "→", out));
