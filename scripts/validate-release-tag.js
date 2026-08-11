const fs = require("fs");
const path = require("path");

const packagePath = path.join(__dirname, "..", "package.json");
if (!fs.existsSync(packagePath)) {
  console.error("✘ [ERROR] package.json not found");
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const pkgVersion = packageJson.version;

if (!pkgVersion || typeof pkgVersion !== "string" || !/^\d+\.\d+\.\d+$/.test(pkgVersion)) {
  console.error(`✘ [ERROR] Invalid semantic version in package.json: "${pkgVersion}"`);
  process.exit(1);
}

const expectedTag = `v${pkgVersion}`;

// Inspect environment variables for Git ref / tag (GitHub Actions, Vercel, or custom env)
const githubRefName = process.env.GITHUB_REF_NAME || "";
const githubRef = process.env.GITHUB_REF || "";
const vercelGitCommitRef = process.env.VERCEL_GIT_COMMIT_REF || "";
const customTag = process.env.GIT_TAG || process.env.RELEASE_TAG || "";

let currentTag = "";
if (githubRefName && githubRefName.startsWith("v")) {
  currentTag = githubRefName;
} else if (githubRef && githubRef.startsWith("refs/tags/v")) {
  currentTag = githubRef.replace("refs/tags/", "");
} else if (vercelGitCommitRef && vercelGitCommitRef.startsWith("v")) {
  currentTag = vercelGitCommitRef;
} else if (customTag) {
  currentTag = customTag.startsWith("v") ? customTag : `v${customTag}`;
}

console.log(`=== PORTFOLIO RELEASE VERSION VALIDATION ===`);
console.log(`• Authoritative package.json version: "${pkgVersion}"`);
console.log(`• Target release Git tag:           "${expectedTag}"`);

if (currentTag) {
  console.log(`• Validating active Git tag:         "${currentTag}"`);
  if (currentTag !== expectedTag) {
    console.error(`\n\x1b[31m✘ [RELEASE TAG MISMATCH ERROR]\x1b[0m`);
    console.error(`The Git tag '${currentTag}' does not match the authoritative package.json version '${pkgVersion}'.`);
    console.error(`Expected tag: '${expectedTag}'`);
    console.error(`\nPlease update package.json version to '${currentTag.replace(/^v/, "")}' before tagging '${currentTag}'.`);
    process.exit(1);
  }
  console.log(`\x1b[32m✔ [PASS]\x1b[0m Git tag '${currentTag}' strictly matches package.json version '${pkgVersion}'.`);
} else {
  console.log(`\x1b[32m✔ [PASS]\x1b[0m Package version '${pkgVersion}' format is valid. No tag specified in environment.`);
}

console.log("============================================\n");
