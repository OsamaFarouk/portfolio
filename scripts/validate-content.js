const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "..", "content");

let hasErrors = false;

const logSuccess = (message) => console.log(`\x1b[32m✔ [PASS]\x1b[0m ${message}`);
const logError = (message) => {
  console.log(`\x1b[31m✘ [FAIL]\x1b[0m ${message}`);
  hasErrors = true;
};

// 1. Validate profile.json
const validateProfile = () => {
  const file = path.join(contentDir, "profile.json");
  if (!fs.existsSync(file)) return logError("profile.json does not exist");
  
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const required = ["name", "title", "roles", "location", "timezone", "availability", "email", "phone", "summary", "aboutStoryParagraph1", "aboutStoryParagraph2", "aboutExtended"];
    
    let ok = true;
    for (const key of required) {
      if (!data[key]) {
        logError(`profile.json: Missing required field "${key}"`);
        ok = false;
      }
    }
    
    if (ok) logSuccess("profile.json matches schema spec.");
  } catch (e) {
    logError(`profile.json is invalid JSON: ${e.message}`);
  }
};

// 2. Validate experience.json
const validateExperience = () => {
  const file = path.join(contentDir, "experience.json");
  if (!fs.existsSync(file)) return logError("experience.json does not exist");

  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(data)) return logError("experience.json must be an array");

    let ok = true;
    data.forEach((exp, idx) => {
      const required = ["id", "company", "role", "location", "startDate", "endDate", "summary", "responsibilities", "achievements", "technologies"];
      for (const key of required) {
        if (exp[key] === undefined || exp[key] === null) {
          logError(`experience.json [index ${idx}]: Missing field "${key}"`);
          ok = false;
        }
      }
      if (!Array.isArray(exp.responsibilities)) {
        logError(`experience.json [index ${idx}]: "responsibilities" must be an array`);
        ok = false;
      }
      if (!Array.isArray(exp.achievements)) {
        logError(`experience.json [index ${idx}]: "achievements" must be an array`);
        ok = false;
      }
      if (!Array.isArray(exp.technologies)) {
        logError(`experience.json [index ${idx}]: "technologies" must be an array`);
        ok = false;
      }
    });

    if (ok) logSuccess(`experience.json: Validated ${data.length} entries successfully.`);
  } catch (e) {
    logError(`experience.json is invalid JSON: ${e.message}`);
  }
};

// 3. Validate projects.json
const validateProjects = () => {
  const file = path.join(contentDir, "projects.json");
  if (!fs.existsSync(file)) return logError("projects.json does not exist");

  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(data)) return logError("projects.json must be an array");

    let ok = true;
    data.forEach((proj, idx) => {
      const required = ["slug", "title", "tagline", "type", "status", "date", "role", "featured", "draft", "confidential", "tags", "background", "solution", "responsibilities", "challenges", "results"];
      for (const key of required) {
        if (proj[key] === undefined || proj[key] === null) {
          logError(`projects.json [index ${idx} - Slug: ${proj.slug || "unknown"}]: Missing field "${key}"`);
          ok = false;
        }
      }
      if (!Array.isArray(proj.tags)) {
        logError(`projects.json [index ${idx}]: "tags" must be an array`);
        ok = false;
      }
      if (!Array.isArray(proj.responsibilities)) {
        logError(`projects.json [index ${idx}]: "responsibilities" must be an array`);
        ok = false;
      }
    });

    if (ok) logSuccess(`projects.json: Validated ${data.length} entries successfully.`);
  } catch (e) {
    logError(`projects.json is invalid JSON: ${e.message}`);
  }
};

// 4. Validate skills.json
const validateSkills = () => {
  const file = path.join(contentDir, "skills.json");
  if (!fs.existsSync(file)) return logError("skills.json does not exist");

  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(data)) return logError("skills.json must be an array");

    let ok = true;
    data.forEach((cat, idx) => {
      if (!cat.category) {
        logError(`skills.json [index ${idx}]: Missing field "category"`);
        ok = false;
      }
      if (!Array.isArray(cat.skills)) {
        logError(`skills.json [index ${idx}]: "skills" must be an array`);
        ok = false;
      } else {
        cat.skills.forEach((skill, sIdx) => {
          const req = ["name", "proficiency", "years", "certified"];
          for (const k of req) {
            if (skill[k] === undefined || skill[k] === null) {
              logError(`skills.json [Category: ${cat.category || "unknown"}, index ${sIdx}]: Missing field "${k}"`);
              ok = false;
            }
          }
        });
      }
    });

    if (ok) logSuccess(`skills.json: Validated ${data.length} categories successfully.`);
  } catch (e) {
    logError(`skills.json is invalid JSON: ${e.message}`);
  }
};

// 5. Validate certifications.json
const validateCertifications = () => {
  const file = path.join(contentDir, "certifications.json");
  if (!fs.existsSync(file)) return logError("certifications.json does not exist");

  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(data)) return logError("certifications.json must be an array");

    let ok = true;
    data.forEach((cert, idx) => {
      const required = ["id", "name", "issuer", "issueDate"];
      for (const key of required) {
        if (cert[key] === undefined || cert[key] === null) {
          logError(`certifications.json [index ${idx}]: Missing field "${key}"`);
          ok = false;
        }
      }
    });

    if (ok) logSuccess(`certifications.json: Validated ${data.length} entries successfully.`);
  } catch (e) {
    logError(`certifications.json is invalid JSON: ${e.message}`);
  }
};

console.log("\n=== STARTING PORTFOLIO SCHEMA VALIDATION ===\n");

validateProfile();
validateExperience();
validateProjects();
validateSkills();
validateCertifications();

console.log("\n============================================");
if (hasErrors) {
  console.log("\x1b[31m[VALIDATION FAILURE] Database contains schema errors.\x1b[0m");
  process.exit(1);
} else {
  console.log("\x1b[32m[VALIDATION SUCCESS] All database schemas are secure!\x1b[0m");
  process.exit(0);
}
