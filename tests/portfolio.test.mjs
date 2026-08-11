import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

test("1. Resume PDF Download Availability", () => {
  const pdfPath = path.join(rootDir, "public", "resume", "Osama_Farouk_DevOps_Resume.pdf");
  assert.ok(fs.existsSync(pdfPath), "Resume PDF must exist at public/resume/Osama_Farouk_DevOps_Resume.pdf");
  const stats = fs.statSync(pdfPath);
  assert.ok(stats.size > 1000, "Resume PDF file size must be greater than 1KB");
});

test("2. External Links Security (target='_blank' has rel='noopener noreferrer')", () => {
  const scanDirs = [
    path.join(rootDir, "src", "components"),
    path.join(rootDir, "src", "app"),
  ];

  const getFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        results.push(fullPath);
      }
    });
    return results;
  };

  const files = scanDirs.flatMap(getFiles);
  let totalBlankLinks = 0;

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");
    const anchorRegex = /<a\s+[^>]*target=["']_blank["'][^>]*>/gi;
    let match;
    while ((match = anchorRegex.exec(content)) !== null) {
      totalBlankLinks++;
      const tag = match[0];
      assert.ok(
        tag.includes('rel="noopener noreferrer"') || tag.includes("rel='noopener noreferrer'"),
        `Unsafe target='_blank' link missing rel='noopener noreferrer' in ${path.relative(rootDir, file)}: ${tag}`
      );
    }
  });

  assert.ok(totalBlankLinks > 0, "At least one target='_blank' link should be tested");
});

test("3. Security Headers Configuration in next.config.ts", () => {
  const configPath = path.join(rootDir, "next.config.ts");
  assert.ok(fs.existsSync(configPath), "next.config.ts must exist");
  const content = fs.readFileSync(configPath, "utf8");

  assert.ok(content.includes("poweredByHeader: false"), "X-Powered-By header must be disabled");
  assert.ok(content.includes("Content-Security-Policy"), "CSP header must be configured");
  assert.ok(content.includes("X-Frame-Options"), "X-Frame-Options header must be configured");
  assert.ok(content.includes("X-Content-Type-Options"), "X-Content-Type-Options header must be configured");
  assert.ok(content.includes("Referrer-Policy"), "Referrer-Policy header must be configured");
  assert.ok(content.includes("Strict-Transport-Security"), "HSTS header must be configured");
});

test("4. Project Routes & Slugs Integrity", () => {
  const projectsPath = path.join(rootDir, "content", "projects.json");
  assert.ok(fs.existsSync(projectsPath), "content/projects.json must exist");
  const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));

  assert.ok(Array.isArray(projects), "projects.json must contain an array");
  assert.ok(projects.length >= 6, "At least 6 project entries must exist");

  projects.forEach((proj) => {
    assert.ok(proj.slug, "Project must have a slug");
    assert.ok(proj.title, "Project must have a title");
  });
});

test("5. Accidental Committed Secrets Audit", () => {
  const contentFiles = fs.readdirSync(path.join(rootDir, "content")).map((f) => path.join(rootDir, "content", f));

  contentFiles.forEach((file) => {
    const text = fs.readFileSync(file, "utf8");
    assert.ok(!text.includes("AKIA") || text.includes("AKIAIOSFODNN7EXAMPLE"), `Potential AWS Secret Access Key in ${path.relative(rootDir, file)}`);
    assert.ok(!text.includes("-----BEGIN PRIVATE KEY-----"), `Potential Private Key in ${path.relative(rootDir, file)}`);
  });
});

test("6. Authoritative Versioning System Alignment", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
  const versionFileContent = fs.readFileSync(path.join(rootDir, "src", "utils", "version.ts"), "utf8");

  assert.ok(versionFileContent.includes("packageJson.version"), "version.ts must export version directly from package.json");

  const terminalEnginePath = path.join(rootDir, "src", "utils", "terminalEngine.ts");
  const terminalEngineContent = fs.readFileSync(terminalEnginePath, "utf8");
  assert.ok(terminalEngineContent.includes("v${APP_VERSION}-STABLE"), "terminalEngine must format banner using APP_VERSION");

  const terminalComponentPath = path.join(rootDir, "src", "components", "Terminal.tsx");
  const terminalComponentContent = fs.readFileSync(terminalComponentPath, "utf8");
  assert.ok(terminalComponentContent.includes("v{APP_VERSION}-STABLE"), "Terminal.tsx header must format header using APP_VERSION");

  const layoutComponentPath = path.join(rootDir, "src", "components", "Layout.tsx");
  const layoutComponentContent = fs.readFileSync(layoutComponentPath, "utf8");
  assert.ok(layoutComponentContent.includes("V{APP_VERSION}"), "Layout.tsx footer must format footer using APP_VERSION");

  // Ensure no hardcoded old version strings remain
  assert.ok(!terminalEngineContent.includes("2.4.0"), "No hardcoded 2.4.0 version string in terminalEngine.ts");
  assert.ok(!terminalComponentContent.includes("2.4.0"), "No hardcoded 2.4.0 version string in Terminal.tsx");
});

test("7. Git Tag Release Validation Logic", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
  const validTag = `v${pkg.version}`;

  // Valid tag check
  const validOutput = execSync(`node scripts/validate-release-tag.js`, {
    env: { ...process.env, GIT_TAG: validTag },
    encoding: "utf8",
  });
  assert.ok(validOutput.includes("strictly matches package.json version"), "Valid tag check must pass");

  // Mismatched tag check
  assert.throws(() => {
    execSync(`node scripts/validate-release-tag.js`, {
      env: { ...process.env, GIT_TAG: "v9.9.9" },
      encoding: "utf8",
      stdio: "pipe",
    });
  }, "Mismatched tag check must fail with non-zero exit code");
});
