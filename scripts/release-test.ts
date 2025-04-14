import { execSync } from "child_process";
import fs from "fs";

// Helper để chạy lệnh và lấy output dạng string
const run = (cmd: string) => execSync(cmd, { encoding: "utf8" }).trim();

// Hàm để tăng version
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
  // 1. Lấy version hiện tại từ package.json
  const currentVersion = JSON.parse(
    fs.readFileSync("package.json", "utf8")
  ).version;
  console.log(`📦 Current version: v${currentVersion}`);

  // 2. Tăng version theo hàm incrementVersion
  const newVersion = incrementVersion(currentVersion);
  console.log(`📦 New version: v${newVersion}`);

  // 3. Cập nhật version trong package.json
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

  // 4. Cập nhật changelog
  console.log("📝 Updating CHANGELOG.md...");
  run("npx conventional-changelog -p angular -i CHANGELOG.md -s");

  // 5. Lấy nội dung changelog
  console.log("🧾 Getting latest changelog...");
  const changelog = run("npx conventional-changelog -p angular -r 1");

  // 6. Commit tất cả thay đổi
  console.log("✅ Committing changes...");
  run("git add .");
  run(
    `git commit -m "chore: release v${newVersion}" -m "${changelog.replace(
      /"/g,
      '\\"'
    )}"`
  );

  // 7. Tạo annotated tag với changelog
  console.log("🏷️ Creating annotated tag...");
  run(`git tag -a v${newVersion} -m "${changelog.replace(/"/g, '\\"')}"`);

  // 8. Push commit và tag
  console.log("📤 Pushing changes and tag...");
  run("git push");
  run("git push --tags");

  console.log(`🎉 Release v${newVersion} created and pushed!`);
};

main();
