/**
 * R3F 9 still constructs THREE.Clock on every Canvas. Clock is deprecated
 * since three r183 (use Timer; R3F v10 will). THREE.Clock is a read-only
 * export, so we cannot replace it — we drop only that constructor warning.
 */

import { setConsoleFunction } from "three";

setConsoleFunction((level, message, ...params) => {
  if (
    level === "warn" &&
    typeof message === "string" &&
    message.includes("Clock:") &&
    message.includes("deprecated")
  ) {
    return;
  }

  const write =
    level === "error"
      ? console.error
      : level === "log"
        ? console.log
        : console.warn;
  write(message, ...params);
});
