import process from "node:process";
import { styleText } from "node:util";

export function padTitleWithDots(leftText: string) {
  const dots = ".".repeat(
    Math.max(0, process.stdout.columns - leftText.length),
  );

  return `${styleText("green", leftText)}${styleText("gray", dots)}`;
}

export function padWithDots(leftText: string, rightText: string) {
  const dots = ".".repeat(
    Math.max(0, process.stdout.columns - leftText.length - rightText.length),
  );

  return `${leftText}${styleText("gray", dots)}${rightText}`;
}
