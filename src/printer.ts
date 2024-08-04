import process from "node:process";
import chalk from "chalk";

const COLORS = {
  title: chalk.green,
  dots: chalk.gray,
};

export function padTitleWithDots(leftText: string) {
  const dots = COLORS.dots(
    ".".repeat(
      Math.max(0, process.stdout.columns - leftText.length),
    ),
  );

  return `${COLORS.title(leftText)}${COLORS.dots(dots)}`;
}

export function padWithDots(leftText: string, rightText: string) {
  const dots = COLORS.dots(
    ".".repeat(
      Math.max(0, process.stdout.columns - leftText.length - rightText.length),
    ),
  );

  return `${leftText}${COLORS.dots(dots)}${rightText}`;
}
