import process from "node:process";
import { styleText } from "node:util";
import path from "node:path";
import fs from "node:fs";

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

export function getPackageVersion(): string {
  const packageJsonPath = path.join("package.json");
  const pkg = JSON.parse(
    fs.readFileSync(packageJsonPath, { encoding: "utf-8" }),
  );

  return pkg.version;
}
