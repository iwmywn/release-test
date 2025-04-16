import { execSync } from "child_process";

const lineDelimiter = "<<<LINE>>>";
const logDelimiter = "<<<DELIM>>>";
// const range = "--root";

// console.log(
//   execSync(
//     `git log --oneline ${range} --pretty="format:${lineDelimiter}%H${logDelimiter}%h${logDelimiter}%s${logDelimiter}%b"`
//   ).toString()
// );

function getLog(): string {
  let range = "";
  try {
    const lastTag = execSync(`git describe --tags --abbrev=0`);
    range = `${lastTag.toString().trim()}..HEAD`;
  } catch {
    range = "--root";
  }
  return execSync(
    `git log --oneline ${range} --pretty="format:${lineDelimiter}%H${logDelimiter}%h${logDelimiter}%s${logDelimiter}%b"`
  ).toString();
}
console.log(getLog());
