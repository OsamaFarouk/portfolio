const fs = require("fs");
const path = require("path");
const readline = require("readline");

const type = process.argv[2];

if (!["project", "experience", "skill", "certification"].includes(type)) {
  console.error("Usage: node add-content.js <project|experience|skill|certification>");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const getFilePath = (fileType) => {
  return path.join(__dirname, "..", "content", `${fileType === "skill" ? "skills" : fileType === "project" ? "projects" : fileType === "experience" ? "experience" : "certifications"}.json`);
};

const main = async () => {
  try {
    const filePath = getFilePath(type);
    let data = [];
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    console.log(`\n=== ADD NEW ${type.toUpperCase()} ===\n`);

    if (type === "project") {
      const title = await askQuestion("Project Title: ");
      const slug = await askQuestion("Slug (e.g., my-awesome-project): ");
      const tagline = await askQuestion("Short Tagline: ");
      const projType = await askQuestion("Type (e.g., Professional Work / Personal Project): ") || "Personal Project";
      const status = await askQuestion("Status (e.g., Completed / In Progress): ") || "Completed";
      const date = await askQuestion("Date (e.g., 2026): ");
      const employer = await askQuestion("Associated Employer/Client: ");
      const role = await askQuestion("Your Role (e.g., DevOps Engineer): ");
      const tagsInput = await askQuestion("Tags (comma separated, e.g., AWS, K8s, CI/CD): ");
      const background = await askQuestion("Background / Problem Statement: ");
      const solution = await askQuestion("Proposed Solution: ");
      const responsibilitiesInput = await askQuestion("Key Responsibilities (semicolon separated): ");
      const challenges = await askQuestion("Challenges & Solutions: ");
      const results = await askQuestion("Measurable Results: ");
      const githubLink = await askQuestion("GitHub Link (default: [ADD GITHUB URL]): ") || "[ADD GITHUB URL]";
      const liveLink = await askQuestion("Live Demo Link (optional): ");
      const featured = (await askQuestion("Featured? (y/n): ")).toLowerCase() === "y";
      const draft = (await askQuestion("Draft? (y/n, default y): ")).toLowerCase() !== "n";
      const confidential = (await askQuestion("Confidential/Sanitized? (y/n): ")).toLowerCase() === "y";

      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const responsibilities = responsibilitiesInput.split(";").map((r) => r.trim()).filter(Boolean);

      const newProject = {
        slug,
        title,
        tagline,
        type: projType,
        status,
        date,
        employer: employer || null,
        role,
        featured,
        draft,
        confidential,
        tags,
        background,
        solution,
        responsibilities,
        challenges,
        results,
        githubLink: githubLink || null,
        liveLink: liveLink || null,
        architecture: "graph TD\n    A[Load Balancer] --> B[Web Server]\n    B --> C[(Database)]"
      };

      data.push(newProject);
      console.log(`\nProject "${title}" added successfully as a ${draft ? "DRAFT" : "PUBLISHED"} entry!`);

    } else if (type === "experience") {
      const company = await askQuestion("Company Name: ");
      const project = await askQuestion("Project Name (optional): ");
      const role = await askQuestion("Role (e.g., DevOps Engineer): ");
      const location = await askQuestion("Location (e.g., Cairo, Egypt): ");
      const startDate = await askQuestion("Start Date (e.g., May 2025): ");
      const endDate = await askQuestion("End Date (e.g., Present): ");
      const employmentType = await askQuestion("Employment Type (e.g., Full-time / Internship): ") || "Full-time";
      const summary = await askQuestion("Summary: ");
      const responsibilitiesInput = await askQuestion("Responsibilities (semicolon separated): ");
      const achievementsInput = await askQuestion("Key Achievements (semicolon separated): ");
      const techInput = await askQuestion("Technologies (comma separated): ");
      const current = (await askQuestion("Is this your current role? (y/n): ")).toLowerCase() === "y";

      const responsibilities = responsibilitiesInput.split(";").map((r) => r.trim()).filter(Boolean);
      const achievements = achievementsInput.split(";").map((a) => a.trim()).filter(Boolean);
      const technologies = techInput.split(",").map((t) => t.trim()).filter(Boolean);

      const newExp = {
        id: company.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        company,
        project: project || null,
        role,
        location,
        startDate,
        endDate,
        employmentType,
        summary,
        responsibilities,
        achievements,
        technologies,
        logo: null,
        current
      };

      data.push(newExp);
      console.log(`\nExperience at "${company}" added successfully!`);

    } else if (type === "skill") {
      const category = await askQuestion("Skill Category (e.g., Cloud & Virtualization): ");
      const name = await askQuestion("Skill Name: ");
      const proficiency = await askQuestion("Proficiency (e.g., Expert / Advanced / Intermediate): ") || "Advanced";
      const years = parseInt(await askQuestion("Years of Use: "), 10) || 1;
      const certified = (await askQuestion("Is this skill certified? (y/n): ")).toLowerCase() === "y";

      // Skills are grouped in categories: { category: "name", skills: [...] }
      let categoryIndex = data.findIndex((cat) => cat.category.toLowerCase() === category.toLowerCase());
      
      const newSkill = { name, proficiency, years, certified };

      if (categoryIndex !== -1) {
        data[categoryIndex].skills.push(newSkill);
      } else {
        data.push({
          category,
          skills: [newSkill]
        });
      }
      console.log(`\nSkill "${name}" added successfully to category "${category}"!`);

    } else if (type === "certification") {
      const name = await askQuestion("Certification Name: ");
      const issuer = await askQuestion("Issuer (e.g., Amazon Web Services): ");
      const code = await askQuestion("Certification Code (optional): ");
      const issueDate = await askQuestion("Issue Date (e.g., 2023): ");
      const expiryDate = await askQuestion("Expiry Date (optional): ");
      const credentialId = await askQuestion("Credential ID (optional): ");
      const verificationLink = await askQuestion("Verification Link (optional): ");

      const newCert = {
        id: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name,
        issuer,
        code: code || null,
        issueDate,
        expiryDate: expiryDate || null,
        credentialId: credentialId || null,
        verificationLink: verificationLink || null,
        badgeUrl: null
      };

      data.push(newCert);
      console.log(`\nCertification "${name}" added successfully!`);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log(`File updated: ${filePath}`);

  } catch (error) {
    console.error("An error occurred during operation:", error);
  } finally {
    rl.close();
  }
};

main();
