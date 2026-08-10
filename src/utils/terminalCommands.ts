import { profile, experience, projects, skills, certifications, socialLinks } from "./dataLoader";

export const executeCommand = (command: string): string => {
  const cmd = command.trim().toLowerCase();

  switch (cmd) {
    case "help":
      return `Available commands:
  about           - Short professional summary
  experience      - Full work history and achievements
  skills          - Technical skills and tools inventory
  projects        - Active software & infrastructure projects
  certifications  - Industry credentials & badges
  contact         - Professional contact links
  resume          - PDF resume access instructions
  clear           - Clear terminal window`;

    case "about":
      return `[${profile.name}]
Title: ${profile.title}
Location: ${profile.location}
Timezone: ${profile.timezone}
Availability: ${profile.availability}

Summary:
${profile.summary}

Extended Details:
${profile.aboutStoryParagraph1}

${profile.aboutStoryParagraph2}`;

    case "experience":
      return experience
        .map(
          (exp) => `--------------------------------------------------
Role:   ${exp.role} ${exp.current ? "[CURRENT]" : ""}
Entity: ${exp.company} (${exp.project || "Internal Track"})
Period: ${exp.startDate} - ${exp.endDate} | ${exp.location}
Summary: ${exp.summary}
Key Achievements:
${exp.achievements.map((ach) => `  * ${ach}`).join("\n")}
Technologies: ${exp.technologies.join(", ")}`
        )
        .join("\n\n");

    case "skills":
      return skills
        .map(
          (cat) => `=== ${cat.category} ===
${cat.skills.map((s) => `  - ${s.name} [Proficiency: ${s.proficiency} | ${s.years} yrs]`).join("\n")}`
        )
        .join("\n\n");

    case "projects":
      return projects
        .map(
          (proj) => `==================================================
Project:  ${proj.title}
Slug:     ${proj.slug}
Tagline:  ${proj.tagline}
Role:     ${proj.role} (${proj.type})
Status:   ${proj.status}
Tags:     ${proj.tags.join(", ")}
Outcome:  ${proj.results.join("\n          ")}`
        )
        .join("\n\n");

    case "certifications":
      return certifications
        .map(
          (cert) => `* [${cert.issuer}] ${cert.name}
  Code/Ref: ${cert.code || "N/A"} | Valid: ${cert.issueDate} - ${cert.expiryDate || "Lifetime"}`
        )
        .join("\n");

    case "contact":
      return `Get in touch:
  Email:    ${socialLinks.email}
  LinkedIn: ${socialLinks.linkedin}
  GitHub:   ${socialLinks.github}
  Phone:    ${socialLinks.phone}
  Address:  ${profile.location}`;

    case "resume":
      return `Original Resume (PDF):
  Filename: Osama_Farouk_DevOps_Resume.pdf
  URL Path: /resume/Osama_Farouk_DevOps_Resume.pdf
  Action:   Run "open resume" in terminal, or click the "Download Resume" button on the webpage dashboard.`;

    default:
      if (cmd.startsWith("open ")) {
        const target = cmd.substring(5).trim();
        if (target === "resume") {
          return "action:open_resume";
        }
      }
      return `Command not found: "${command}". Type "help" for a list of available commands.`;
  }
};
