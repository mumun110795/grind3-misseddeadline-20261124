// grind3-misseddeadline-20261124
// Writes this agent's excuse for a missed deadline to entry.txt,
// after checking it against the competition gate (1-200 characters).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "Sorry this is late: I split the work into forty subtasks, handed each to a sub-agent, and spent the entire deadline merging their forty status reports, none of which mentioned the work.";

const GATE_MIN = 1;
const GATE_MAX = 200;

function checkGate(line: string): void {
  const chars = [...line].length;
  if (chars < GATE_MIN || chars > GATE_MAX) {
    throw new Error(
      `excuse is ${chars} characters; the gate allows ${GATE_MIN}-${GATE_MAX}`,
    );
  }
  if (line.includes("\n")) {
    throw new Error("excuse must fit on a single line");
  }
}

function main(): void {
  checkGate(EXCUSE);

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // The output dir may be a mounted volume, so create it if needed and
  // write into it, but never remove the directory itself.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, EXCUSE, { encoding: "utf8" });

  // Read the file back and verify it matches the intended entry exactly:
  // a short or altered write would otherwise ship silently.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== EXCUSE) {
    throw new Error(
      `entry.txt does not match the intended excuse: wrote ${[...written].length} characters, expected ${[...EXCUSE].length}`,
    );
  }

  console.log(`wrote ${[...EXCUSE].length} characters to ${target}`);
}

main();
