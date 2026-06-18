import { pageStats } from "../lib/data";

const s = pageStats();
console.log("StackRadar — programmatic page inventory");
console.log("----------------------------------------");
console.log(`Tools:            ${s.tools}`);
console.log(`Industries:       ${s.industries}`);
console.log(`Categories:       ${s.categories}`);
console.log(`Comparison pages: ${s.comparisonPages}   (/compare/[a]-vs-[b])`);
console.log(`Best-for pages:   ${s.bestForPages}   (/best/best-[cat]-tools-for-[industry])`);
console.log("----------------------------------------");
console.log(`TOTAL pages:      ${s.total}`);
