import { execSync } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const GH_TOKEN = process.env.GH_TOKEN;
const REPO_URL = "iwmywn/release-test";
const TARGET_BRANCH = "release-trigger";

if (!GH_TOKEN) {
  console.error("❌ GH_TOKEN is not set.");
  process.exit(1);
}

const mode = process.argv[2];

if (!mode || !["pr", "github"].includes(mode)) {
  console.error('❌ Please specify "pr" or "github" as an argument.');
  console.error("👉 Example: npm run release:pr");
  process.exit(1);
}

const command =
  mode === "pr"
    ? `npx release-please release-pr --token=${GH_TOKEN} --repo-url=${REPO_URL} --target-branch=${TARGET_BRANCH}`
    : `npx release-please github-release --token=${GH_TOKEN} --repo-url=${REPO_URL} --target-branch=${TARGET_BRANCH}`;

try {
  execSync(command, { stdio: "inherit" });
  console.log(`✅ release:${mode} completed.`);
} catch (error) {
  console.error(`❌ release:${mode} failed:`, error);
  process.exit(1);
}
