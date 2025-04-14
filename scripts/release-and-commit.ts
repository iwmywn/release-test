import fs from "fs";
import path from "path";
import { execSync } from "child_process";

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

function getCurrentVersionFromManifest(): string {
  const manifestPath = path.resolve(".release-please-manifest.json");

  if (!fs.existsSync(manifestPath)) {
    throw new Error("⚠️ File .release-please-manifest.json not found.");
  }

  const manifestRaw = fs.readFileSync(manifestPath, "utf-8");
  const manifest = JSON.parse(manifestRaw);

  const versionWithV: string = manifest["."];
  return versionWithV;
}

function createReleaseCommit(version: string) {
  const message = `chore: release v${version}`;
  const body = `Release-As: ${version}`;

  try {
    execSync(`git commit --allow-empty -m "${message}" -m "${body}"`, {
      stdio: "inherit",
    });
    console.log(`✅ Commit created: ${message}`);
  } catch (error) {
    console.error("❌ Failed to create git commit.");
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

try {
  const currentVersion = getCurrentVersionFromManifest().replace(/^v/, "");
  const newVersion = incrementVersion(currentVersion);
  createReleaseCommit(newVersion);
} catch (err) {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error("Unexpected error", err);
  }
}
