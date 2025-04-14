import { execSync } from "child_process";
import fs from "fs";

const run = (cmd: string) => execSync(cmd, { encoding: "utf8" }).trim();

function incrementVersion(currentVersion: string): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 +
      startOfYear.getDay() +
      1) /
      7
  );

  const [prevYear, prevWeek, minor] = currentVersion.split(".").map(Number);

  let newMinor = minor + 1;
  if (year !== prevYear.toString() || week !== prevWeek) {
    newMinor = 0;
  }

  return `${year}.${week}.${newMinor}`;
}

const main = () => {
  const currentVersion = JSON.parse(
    fs.readFileSync("package.json", "utf8")
  ).version;
  console.log(`📦 Current version: v${currentVersion}`);

  const newVersion = incrementVersion(currentVersion);
  console.log(`📦 New version: v${newVersion}`);

  console.log("🔼 Bumping version...");
  fs.writeFileSync(
    "package.json",
    JSON.stringify(
      {
        ...JSON.parse(fs.readFileSync("package.json", "utf8")),
        version: newVersion,
      },
      null,
      2
    )
  );

  console.log("📝 Updating CHANGELOG.md...");
  run("npx conventional-changelog -p angular -i CHANGELOG.md -s");

  console.log("🧾 Getting latest changelog...");
  const changelog = run("npx conventional-changelog -p angular -r 1");
  console.log(changelog.replace(/"/g, '\\"'));
  console.log("✅ Committing changes...");
  run("git add .");
  run(
    `git commit -m "chore: release v${newVersion}" -m "${changelog.replace(
      /"/g,
      '\\"'
    )}"`
  );

  console.log("🏷️ Creating annotated tag...");
  run(`git tag -a v${newVersion} -m "${changelog.replace(/"/g, '\\"')}"`);

  console.log("📤 Pushing changes and tag...");
  run("git push");
  run("git push --tags");

  console.log(`🎉 Release v${newVersion} created and pushed!`);
};

main();
