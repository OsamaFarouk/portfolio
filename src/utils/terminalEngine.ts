import {
  profile,
  experience,
  projects,
  skills,
  certifications,
  education,
  courses,
  socialLinks,
  portfolioStats,
  Certification,
  Course,
  Experience as ExpType,
  Project,
  SkillCategory,
} from "./dataLoader";

export type TerminalContext =
  | "main"
  | "projects"
  | "certifications"
  | "skills"
  | "experience"
  | "education"
  | "courses"
  | "closed";

export interface CommandResult {
  output: string;
  nextContext?: TerminalContext;
  action?: "clear" | "exit" | "open_link" | "reconnect";
  actionPayload?: string;
  pendingConfirmation?: {
    promptText: string;
    actionPayload: string;
    targetTitle: string;
    nextContext?: TerminalContext;
  };
}

export interface CommandDef {
  name: string;
  aliases: string[];
  description: string;
  category: "Primary Modules" | "System & Navigation";
  usage: string;
  route?: string;
  execute: (args: string[], rawInput: string, context: TerminalContext) => CommandResult;
}

// Helper: Levenshtein distance for typo suggestions
const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

export const getPromptPath = (context: TerminalContext): string => {
  switch (context) {
    case "projects":
      return "osama@control-plane:~/projects$";
    case "certifications":
      return "osama@control-plane:~/certifications$";
    case "skills":
      return "osama@control-plane:~/skills$";
    case "experience":
      return "osama@control-plane:~/experience$";
    case "education":
      return "osama@control-plane:~/education$";
    case "courses":
      return "osama@control-plane:~/courses$";
    case "closed":
      return "[DISCONNECTED]";
    case "main":
    default:
      return "osama@control-plane:~$";
  }
};

export const getVirtualPath = (context: TerminalContext): string => {
  switch (context) {
    case "projects":
      return "/home/osama/projects";
    case "certifications":
      return "/home/osama/certifications";
    case "skills":
      return "/home/osama/skills";
    case "experience":
      return "/home/osama/experience";
    case "education":
      return "/home/osama/education";
    case "courses":
      return "/home/osama/courses";
    case "closed":
      return "/home/osama";
    case "main":
    default:
      return "/home/osama";
  }
};

export const getInitialBanner = (): string => {
  return `OSAMA INFRASTRUCTURE CONTROL CONSOLE [v2.4.0-STABLE]

[OK] SECURE SHELL SESSION OPENED
[OK] CLUSTER CONTEXT LOADED: PORTFOLIO-CLUSTER
STATUS ALL PORTFOLIO SERVICES OPERATIONAL (05/05)
ACCESS READ-ONLY OPERATOR PRIVILEGES

Control plane synchronized.
Type 'help' to display available commands.`;
};

// Summary Formatter Helpers
export const formatExperienceSummary = (
  exp: ExpType,
  numIndex: number,
  isShowOnly = false
): CommandResult => {
  const numStr = numIndex.toString().padStart(2, "0");
  const header = `[${numStr}] ${exp.role}\n${exp.company}${exp.project ? ` | ${exp.project}` : ""}\n${exp.startDate} – ${exp.endDate}\n${exp.location} (${exp.employmentType})`;

  const respStr = exp.responsibilities
    ? `\n\nKEY RESPONSIBILITIES:\n${exp.responsibilities.map((r) => `• ${r}`).join("\n")}`
    : "";
  const achStr = exp.achievements
    ? `\n\nACHIEVEMENTS:\n${exp.achievements.map((a) => `• ${a}`).join("\n")}`
    : "";
  const techStr = exp.technologies ? `\n\nTECH STACK:\n${exp.technologies.join(" · ")}` : "";

  const summaryContent = `${header}\n\nSUMMARY:\n${exp.summary}${respStr}${achStr}${techStr}`;
  const targetTitle = `${exp.role} @ ${exp.company}`;

  if (isShowOnly) {
    return {
      output: summaryContent,
      nextContext: "experience",
    };
  }

  const promptQuestion = "View this experience in the Experience section? [Y/N]";
  return {
    output: `${summaryContent}\n\n${promptQuestion}`,
    nextContext: "experience",
    pendingConfirmation: {
      promptText: promptQuestion,
      actionPayload: "/#experience",
      targetTitle,
      nextContext: "experience",
    },
  };
};

export const formatCourseSummary = (
  course: Course,
  numIndex: number,
  isShowOnly = false
): CommandResult => {
  const numStr = numIndex.toString().padStart(2, "0");
  const summaryContent = `[${numStr}] ${course.title}\nProvider: ${course.provider}\nYear:     ${course.year}\nStatus:   Completed`;
  const targetTitle = course.title;

  if (isShowOnly) {
    return {
      output: summaryContent,
      nextContext: "courses",
    };
  }

  const promptQuestion = "Open this course on the Courses page? [Y/N]";
  return {
    output: `${summaryContent}\n\n${promptQuestion}`,
    nextContext: "courses",
    pendingConfirmation: {
      promptText: promptQuestion,
      actionPayload: `/courses#${course.id}`,
      targetTitle,
      nextContext: "courses",
    },
  };
};

export const formatCertificationSummary = (
  cert: Certification,
  numIndex: number,
  isShowOnly = false
): CommandResult => {
  const numStr = numIndex.toString().padStart(2, "0");
  const targetId =
    cert.id === "aws-ccp"
      ? "aws-certified-cloud-practitioner"
      : cert.id === "aws-saa"
      ? "aws-solutions-architect-associate"
      : cert.id === "cka"
      ? "certified-kubernetes-administrator"
      : cert.id === "rhcsa"
      ? "red-hat-certified-system-administrator"
      : cert.id === "hcia-datacom"
      ? "huawei-hcia-datacom"
      : cert.id;

  const header = `[${numStr}] ${cert.name}\nIssuer:     ${cert.issuer}\nIssue Date: ${cert.issueDate}${cert.code ? `\nCode:       ${cert.code}` : ""}\nStatus:     Active`;

  const linkStr = cert.verificationLink
    ? `\n\nVERIFICATION LINK:\n${cert.verificationLink}`
    : "";

  const summaryContent = `${header}${linkStr}`;
  const targetTitle = cert.name;

  if (isShowOnly) {
    return {
      output: summaryContent,
      nextContext: "certifications",
    };
  }

  const promptQuestion = "View this certification in the Certifications section? [Y/N]";
  return {
    output: `${summaryContent}\n\n${promptQuestion}`,
    nextContext: "certifications",
    pendingConfirmation: {
      promptText: promptQuestion,
      actionPayload: `/#${targetId}`,
      targetTitle,
      nextContext: "certifications",
    },
  };
};

export const formatProjectSummary = (
  proj: Project,
  numIndex: number,
  isShowOnly = false
): CommandResult => {
  const numStr = numIndex.toString().padStart(2, "0");
  const header = `[${numStr}] ${proj.title}\nType:    ${proj.type}\nStatus:  Deployed Node`;
  const descStr = `\n\nSUMMARY:\n${proj.tagline}`;
  const techStr = proj.tags ? `\n\nTECH STACK:\n${proj.tags.join(" · ")}` : "";

  const summaryContent = `${header}${descStr}${techStr}`;
  const targetTitle = proj.title;

  if (isShowOnly) {
    return {
      output: summaryContent,
      nextContext: "projects",
    };
  }

  const promptQuestion = "Open this project? [Y/N]";
  return {
    output: `${summaryContent}\n\n${promptQuestion}`,
    nextContext: "projects",
    pendingConfirmation: {
      promptText: promptQuestion,
      actionPayload: `/projects/${proj.slug}`,
      targetTitle,
      nextContext: "projects",
    },
  };
};

// Centralized Command Registry
export const commandRegistry: CommandDef[] = [
  {
    name: "overview",
    aliases: ["home", "main"],
    description: "Display operator profile & portfolio summary",
    category: "Primary Modules",
    usage: "overview [open]",
    route: "/#home",
    execute: (args) => {
      const summaryText = `PORTFOLIO OVERVIEW — CONTROL PLANE SUMMARY

Candidate: ${profile.name}
Role:      ${profile.title}
Location:  ${profile.location}
Timezone:  ${profile.timezone}
Status:    ${profile.availability}

SUMMARY:
${profile.summary}`;

      if (args[0] === "open") {
        const promptQuestion = "View this section on the main page? [Y/N]";
        return {
          output: `${summaryText}\n\n${promptQuestion}`,
          nextContext: "main",
          pendingConfirmation: {
            promptText: promptQuestion,
            actionPayload: "/#home",
            targetTitle: "Overview Section",
            nextContext: "main",
          },
        };
      }
      return {
        output: `${summaryText}\n\nRun 'overview open' to jump to the top overview section.`,
        nextContext: "main",
      };
    },
  },
  {
    name: "whoami",
    aliases: ["operator", "profile"],
    description: "Display operator profile & system identity",
    category: "System & Navigation",
    usage: "whoami",
    execute: () => {
      return {
        output: `OPERATOR IDENTITY
Name:         ${profile.name}
Title:        ${profile.title}
Roles:        ${profile.roles.join(" · ")}
Location:     ${profile.location}
Availability: ${profile.availability}
Timezone:     ${profile.timezone}`,
      };
    },
  },
  {
    name: "status",
    aliases: ["health", "sys"],
    description: "Show system health and operational readiness",
    category: "System & Navigation",
    usage: "status",
    execute: () => {
      return {
        output: `SYSTEM STATUS REPORT

[OK] CONTROL PLANE          OPERATIONAL
[OK] PORTFOLIO DATA        SYNCHRONIZED
[OK] NAVIGATION            OPERATIONAL
[OK] SECURE SHELL          READY

Cluster:       Portfolio-Control-Plane
Availability:  ${profile.availability}
Experience:    ${portfolioStats.yearsOfExperience}+ Years
Projects:      ${portfolioStats.totalProjects} Active Nodes
Certs:         ${portfolioStats.totalCertifications} Verified Credentials
Courses:       ${courses.length} Completed Technical Courses`,
      };
    },
  },
  {
    name: "experience",
    aliases: ["work", "jobs", "career"],
    description: "Browse professional experience records",
    category: "Primary Modules",
    usage: "experience [list | search <query> | show <id|num> | open <id|num>]",
    route: "/#experience",
    execute: (args) => {
      const sub = args[0]?.toLowerCase();

      if (sub === "list" || !sub) {
        const listText = experience
          .map(
            (e, i) =>
              `[${(i + 1).toString().padStart(2, "0")}] ${e.id.padEnd(20)} — ${e.company} | ${e.role} (${e.startDate} – ${e.endDate})`
          )
          .join("\n");
        return {
          output: `PROFESSIONAL EXPERIENCE RECORDS (${experience.length} TOTAL)\n\n${listText}\n\nEnter an experience number or run 'experience open <id>' to inspect a specific record.`,
          nextContext: "experience",
        };
      }

      if (sub === "search" && args.length > 1) {
        const query = args.slice(1).join(" ").toLowerCase();
        const matches = experience.filter(
          (e) =>
            e.company.toLowerCase().includes(query) ||
            e.role.toLowerCase().includes(query) ||
            (e.project && e.project.toLowerCase().includes(query)) ||
            e.technologies.some((t) => t.toLowerCase().includes(query)) ||
            e.summary.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          return {
            output: `No experience records match search query: '${query}'`,
            nextContext: "experience",
          };
        }

        const matchText = matches
          .map(
            (e) =>
              `• [${(experience.indexOf(e) + 1).toString().padStart(2, "0")}] ${e.company} — ${e.role} (${e.startDate} – ${e.endDate})\n  ID: ${e.id} | Focus: ${e.summary}`
          )
          .join("\n\n");
        return {
          output: `EXPERIENCE SEARCH RESULTS FOR '${query.toUpperCase()}'\n\n${matchText}\n\nEnter an experience number or run 'experience open <id>' to inspect a specific record.`,
          nextContext: "experience",
        };
      }

      if (sub === "show" || sub === "open") {
        const isShowOnly = sub === "show";
        const target = args[1]?.toLowerCase();
        if (!target) {
          return {
            output: `Usage: experience ${sub} <record-id | number>\nExample: experience ${sub} 02 or experience ${sub} zaintech-bas`,
            nextContext: "experience",
          };
        }

        const numMatchSub = target.match(/^\[?(\d{1,2})\]?$/);
        let foundExp: ExpType | undefined;
        let numIdx = 1;

        if (numMatchSub) {
          const idx = parseInt(numMatchSub[1], 10);
          if (idx >= 1 && idx <= experience.length) {
            foundExp = experience[idx - 1];
            numIdx = idx;
          }
        } else {
          foundExp = experience.find((e, idx) => {
            const match =
              e.id.toLowerCase() === target ||
              e.id.toLowerCase().includes(target) ||
              e.company.toLowerCase().includes(target);
            if (match) numIdx = idx + 1;
            return match;
          });
        }

        if (foundExp) {
          return formatExperienceSummary(foundExp, numIdx, isShowOnly);
        }
        return {
          output: `Experience record '${target}' not found. Enter a number (1-${experience.length}) or run 'experience list'.`,
          nextContext: "experience",
        };
      }

      return {
        output: `PROFESSIONAL EXPERIENCE MODULE (${experience.length} TOTAL RECORDS)`,
        nextContext: "experience",
      };
    },
  },
  {
    name: "certifications",
    aliases: ["certs", "credentials"],
    description: "View verified certifications & credentials",
    category: "Primary Modules",
    usage: "certifications [list | search <query> | show <id|num> | open <id|num>]",
    route: "/#certifications",
    execute: (args) => {
      const sub = args[0]?.toLowerCase();

      if (sub === "list" || !sub) {
        const listText = certifications
          .map(
            (c, i) =>
              `[${(i + 1).toString().padStart(2, "0")}] ${c.id.padEnd(35)} — ${c.name} (${c.issuer} · ${c.issueDate})`
          )
          .join("\n");
        return {
          output: `VERIFIED CREDENTIALS (${certifications.length} TOTAL)\n\n${listText}\n\nEnter a certification number or run 'certifications open <id>' to view a credential card.`,
          nextContext: "certifications",
        };
      }

      if (sub === "search" && args.length > 1) {
        const query = args.slice(1).join(" ").toLowerCase();
        const matches = certifications.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.issuer.toLowerCase().includes(query) ||
            (c.code && c.code.toLowerCase().includes(query)) ||
            c.id.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          return {
            output: `No certifications match search query: '${query}'`,
            nextContext: "certifications",
          };
        }

        const matchText = matches
          .map(
            (c) =>
              `• [${(certifications.indexOf(c) + 1).toString().padStart(2, "0")}] ${c.name} (${c.issuer} · ${c.issueDate}) | ID: ${c.id}`
          )
          .join("\n");
        return {
          output: `CERTIFICATION SEARCH RESULTS FOR '${query.toUpperCase()}'\n\n${matchText}\n\nEnter a certification number or run 'certifications open <id>' to view a credential card.`,
          nextContext: "certifications",
        };
      }

      if (sub === "show" || sub === "open") {
        const isShowOnly = sub === "show";
        const target = args[1]?.toLowerCase();
        if (!target) {
          return {
            output: `Usage: certifications ${sub} <cert-id | number>\nExample: certifications ${sub} 02 or certifications ${sub} aws-certified-cloud-practitioner`,
            nextContext: "certifications",
          };
        }

        const numMatchSub = target.match(/^\[?(\d{1,2})\]?$/);
        let foundCert: Certification | undefined;
        let numIdx = 1;

        if (numMatchSub) {
          const idx = parseInt(numMatchSub[1], 10);
          if (idx >= 1 && idx <= certifications.length) {
            foundCert = certifications[idx - 1];
            numIdx = idx;
          }
        } else {
          foundCert = certifications.find((c, idx) => {
            const match =
              c.id.toLowerCase() === target ||
              c.id.toLowerCase().includes(target) ||
              (c.code && c.code.toLowerCase().includes(target)) ||
              (target.includes("cloud") && c.id === "aws-ccp") ||
              (target.includes("architect") && c.id === "aws-saa");
            if (match) numIdx = idx + 1;
            return match;
          });
        }

        if (foundCert) {
          return formatCertificationSummary(foundCert, numIdx, isShowOnly);
        }
        return {
          output: `Certification record '${target}' not found. Enter a number (1-${certifications.length}) or run 'certifications list'.`,
          nextContext: "certifications",
        };
      }

      return {
        output: `VERIFIED CERTIFICATIONS (${certifications.length} CREDENTIALS)`,
        nextContext: "certifications",
      };
    },
  },
  {
    name: "courses",
    aliases: ["training", "professional-courses"],
    description: "Browse 23 completed professional courses",
    category: "Primary Modules",
    usage: "courses [list | search <query> | show <id|num> | open <id|num>]",
    route: "/courses",
    execute: (args) => {
      const sub = args[0]?.toLowerCase();

      if (sub === "list" || !sub) {
        const listText = courses
          .map(
            (c, i) =>
              `[${(i + 1).toString().padStart(2, "0")}] ${c.id.padEnd(36)} — ${c.title} (${c.provider} · ${c.year})`
          )
          .join("\n");
        return {
          output: `COMPLETED TECHNICAL COURSES (${courses.length} RECORDS)\n\n${listText}\n\nEnter a course number or run 'courses open <id>' to view its course card.`,
          nextContext: "courses",
        };
      }

      if (sub === "search" && args.length > 1) {
        const query = args.slice(1).join(" ").toLowerCase();
        const matches = courses.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.provider.toLowerCase().includes(query) ||
            c.year.toString().includes(query) ||
            c.id.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          return {
            output: `No courses match search query: '${query}'`,
            nextContext: "courses",
          };
        }

        const matchText = matches
          .map(
            (c) =>
              `• [${(courses.indexOf(c) + 1).toString().padStart(2, "0")}] ${c.title} (${c.provider} · ${c.year}) | ID: ${c.id}`
          )
          .join("\n");
        return {
          output: `COURSE SEARCH RESULTS FOR '${query.toUpperCase()}'\n\n${matchText}\n\nEnter a course number or run 'courses open <id>' to view its course card.`,
          nextContext: "courses",
        };
      }

      if (sub === "show" || sub === "open") {
        const isShowOnly = sub === "show";
        const target = args[1]?.toLowerCase();
        if (!target) {
          return {
            output: `Usage: courses ${sub} <course-id | number>\nExample: courses ${sub} 12 or courses ${sub} elk-stack-udemy`,
            nextContext: "courses",
          };
        }

        const numMatchSub = target.match(/^\[?(\d{1,2})\]?$/);
        let foundCourse: Course | undefined;
        let numIdx = 1;

        if (numMatchSub) {
          const idx = parseInt(numMatchSub[1], 10);
          if (idx >= 1 && idx <= courses.length) {
            foundCourse = courses[idx - 1];
            numIdx = idx;
          }
        } else {
          foundCourse = courses.find((c, idx) => {
            const match = c.id.toLowerCase() === target || c.id.toLowerCase().includes(target);
            if (match) numIdx = idx + 1;
            return match;
          });
        }

        if (foundCourse) {
          return formatCourseSummary(foundCourse, numIdx, isShowOnly);
        }
        return {
          output: `Course record '${target}' not found. Enter a number (1-${courses.length}) or run 'courses list'.`,
          nextContext: "courses",
        };
      }

      return {
        output: `PROFESSIONAL COURSES MODULE (${courses.length} RECORDS)`,
        nextContext: "courses",
      };
    },
  },
  {
    name: "projects",
    aliases: ["labs", "inventory"],
    description: "Browse deployed project nodes & case studies",
    category: "Primary Modules",
    usage: "projects [list | search <query> | show <id|num> | open <id|num>]",
    route: "/#projects",
    execute: (args) => {
      const sub = args[0]?.toLowerCase();

      if (sub === "list" || !sub) {
        const listText = projects
          .map(
            (p, i) =>
              `[${(i + 1).toString().padStart(2, "0")}] ${p.slug.padEnd(42)} — ${p.title} (${p.type})`
          )
          .join("\n");
        return {
          output: `DEPLOYED PROJECT NODES (${projects.length} TOTAL)\n\n${listText}\n\nEnter a project number or run 'projects open <id>' to open a project case study.`,
          nextContext: "projects",
        };
      }

      if (sub === "search" && args.length > 1) {
        const query = args.slice(1).join(" ").toLowerCase();
        const matches = projects.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.tagline.toLowerCase().includes(query) ||
            p.tags.some((t) => t.toLowerCase().includes(query)) ||
            p.slug.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          return {
            output: `No projects match search query: '${query}'`,
            nextContext: "projects",
          };
        }

        const matchText = matches
          .map(
            (p) =>
              `• [${(projects.indexOf(p) + 1).toString().padStart(2, "0")}] ${p.title} — ${p.tagline} | Slug: ${p.slug}`
          )
          .join("\n");
        return {
          output: `PROJECT SEARCH RESULTS FOR '${query.toUpperCase()}'\n\n${matchText}\n\nEnter a project number or run 'projects open <id>' to open a project case study.`,
          nextContext: "projects",
        };
      }

      if (sub === "show" || sub === "open") {
        const isShowOnly = sub === "show";
        const target = args[1]?.toLowerCase();
        if (!target) {
          return {
            output: `Usage: projects ${sub} <project-slug | number>\nExample: projects ${sub} 01 or projects ${sub} payhub-release-operations`,
            nextContext: "projects",
          };
        }

        const numMatchSub = target.match(/^\[?(\d{1,2})\]?$/);
        let foundProj: Project | undefined;
        let numIdx = 1;

        if (numMatchSub) {
          const idx = parseInt(numMatchSub[1], 10);
          if (idx >= 1 && idx <= projects.length) {
            foundProj = projects[idx - 1];
            numIdx = idx;
          }
        } else {
          foundProj = projects.find((p, idx) => {
            const match =
              p.slug.toLowerCase() === target ||
              p.slug.toLowerCase().includes(target) ||
              (target.includes("payhub") && idx === 0) ||
              (target.includes("stc") && idx === 1) ||
              (target.includes("ecs") && idx === 2) ||
              (target.includes("gitlab") && idx === 3) ||
              (target.includes("observability") && idx === 4) ||
              (target.includes("aws") && idx === 5);
            if (match) numIdx = idx + 1;
            return match;
          });
        }

        if (foundProj) {
          return formatProjectSummary(foundProj, numIdx, isShowOnly);
        }
        return {
          output: `Project record '${target}' not found. Enter a number (1-${projects.length}) or run 'projects list'.`,
          nextContext: "projects",
        };
      }

      return {
        output: `PROJECT INVENTORY (${projects.length} DEPLOYED NODES)`,
        nextContext: "projects",
      };
    },
  },
  {
    name: "skills",
    aliases: ["tech", "stack"],
    description: "Inspect technical skills & certifications",
    category: "Primary Modules",
    usage: "skills [list | search <query> | open]",
    route: "/#skills",
    execute: (args) => {
      const sub = args[0]?.toLowerCase();

      if (sub === "list" || !sub) {
        const categoriesText = skills
          .map((cat) => {
            const skillList = cat.skills
              .map(
                (s) =>
                  `  • ${s.name.padEnd(25)} (${s.proficiency}) ${
                    s.certifications
                      ? s.certifications.map((c) => `[CERT: ${c.shortName}]`).join(" ")
                      : s.certBadge
                      ? `[CERT: ${s.certBadge}]`
                      : ""
                  }`
              )
              .join("\n");
            return `[CATEGORY] ${cat.category}\n${skillList}`;
          })
          .join("\n\n");

        return {
          output: `TECHNICAL SKILLS INVENTORY (${portfolioStats.totalSkillsCount} TOTAL NODES)\n\n${categoriesText}`,
          nextContext: "skills",
        };
      }

      if (sub === "search" && args.length > 1) {
        const query = args.slice(1).join(" ").toLowerCase();
        const results: string[] = [];

        skills.forEach((cat) => {
          cat.skills.forEach((s) => {
            if (s.name.toLowerCase().includes(query) || cat.category.toLowerCase().includes(query)) {
              results.push(
                `• ${s.name} (${cat.category}) — ${s.proficiency} (${s.years} Yrs Exp)`
              );
            }
          });
        });

        if (results.length === 0) {
          return {
            output: `No skills match search query: '${query}'`,
            nextContext: "skills",
          };
        }
        return {
          output: `SKILL SEARCH RESULTS FOR '${query.toUpperCase()}'\n\n${results.join("\n")}`,
          nextContext: "skills",
        };
      }

      if (sub === "open") {
        const promptQuestion = "View this section on the main page? [Y/N]";
        return {
          output: `TECHNICAL SKILL INVENTORY (${portfolioStats.totalSkillsCount} TOTAL SKILLS)\n\n${promptQuestion}`,
          nextContext: "skills",
          pendingConfirmation: {
            promptText: promptQuestion,
            actionPayload: "/#skills",
            targetTitle: "Skills Section",
            nextContext: "skills",
          },
        };
      }

      return {
        output: `TECHNICAL SKILL INVENTORY (${portfolioStats.totalSkillsCount} TOTAL SKILLS)`,
        nextContext: "skills",
      };
    },
  },
  {
    name: "education",
    aliases: ["degree", "academic", "awards"],
    description: "View degree, honors, and academic record",
    category: "Primary Modules",
    usage: "education [list | open]",
    route: "/#education",
    execute: (args) => {
      const sub = args[0]?.toLowerCase();

      const mainDeg = education.degrees[0];
      const awardsText = education.awards
        .map((a) => `• ${a.name} (${a.organization} · ${a.year})\n  ${a.description}`)
        .join("\n");

      const summaryText = `ACADEMIC QUALIFICATIONS & TRAINING RECORD

DEGREE:
Degree:      ${mainDeg.degree}
Institution: ${mainDeg.institution}
Period:      ${mainDeg.period}
Location:    ${mainDeg.location}

HONORS & AWARDS:
${awardsText}

TECHNICAL COURSES (${courses.length} TOTAL):
Completed 23 technical courses across DevOps, AWS, Kubernetes, VMware, Red Hat, and Software Engineering.`;

      if (sub === "open") {
        const promptQuestion = "View Education in the Education section? [Y/N]";
        return {
          output: `${summaryText}\n\n${promptQuestion}`,
          nextContext: "education",
          pendingConfirmation: {
            promptText: promptQuestion,
            actionPayload: "/#education",
            targetTitle: "Education & Awards",
            nextContext: "education",
          },
        };
      }

      return {
        output: `${summaryText}\n\nRun 'education open' to jump to Education section on the main page.`,
        nextContext: "education",
      };
    },
  },
  {
    name: "contact",
    aliases: ["email", "socials"],
    description: "Display professional contact channels",
    category: "Primary Modules",
    usage: "contact [open]",
    route: "/#contact",
    execute: (args) => {
      const summaryText = `PROFESSIONAL CONTACT CHANNELS

Email:        ${socialLinks.email}
LinkedIn:     ${socialLinks.linkedin}
GitHub:       ${socialLinks.github}
Location:     ${profile.location}
Availability: ${profile.availability}`;

      if (args[0] === "open") {
        const promptQuestion = "View this section on the main page? [Y/N]";
        return {
          output: `${summaryText}\n\n${promptQuestion}`,
          pendingConfirmation: {
            promptText: promptQuestion,
            actionPayload: "/#contact",
            targetTitle: "Contact Section",
          },
        };
      }
      return {
        output: summaryText,
      };
    },
  },
  {
    name: "resume",
    aliases: ["cv"],
    description: "View or download verified PDF resume",
    category: "Primary Modules",
    usage: "resume [open]",
    route: "/resume",
    execute: () => {
      const summaryText = `[08] Curriculum Vitae — PDF Resume
Candidate Name: ${profile.name}
Title:          ${profile.title}
File Path:      /resume/Osama_Farouk_DevOps_Resume.pdf`;

      const promptQuestion = "Open Osama Farouk’s résumé? [Y/N]";

      return {
        output: `${summaryText}\n\n${promptQuestion}`,
        nextContext: "main",
        pendingConfirmation: {
          promptText: promptQuestion,
          actionPayload: "/resume",
          targetTitle: "Osama Farouk’s Résumé",
          nextContext: "main",
        },
      };
    },
  },
  {
    name: "help",
    aliases: ["man", "commands"],
    description: "Display help menu & detailed command usage",
    category: "System & Navigation",
    usage: "help [<command>]",
    execute: (args) => {
      if (args.length > 0) {
        const query = args[0].toLowerCase();
        const found = commandRegistry.find(
          (c) => c.name === query || c.aliases.includes(query)
        );

        if (found) {
          return {
            output: `MANUAL PAGE: ${found.name.toUpperCase()}(1)

DESCRIPTION
    ${found.description}

USAGE
    ${found.usage}

ALIASES
    ${found.aliases.length > 0 ? found.aliases.join(", ") : "None"}

ROUTE DESTINATION
    ${found.route || "Internal Console Action"}`,
          };
        }
        return { output: `No manual entry for '${query}'. Run 'help' to list all commands.` };
      }

      return { output: getHelpText() };
    },
  },
  {
    name: "clear",
    aliases: ["cls"],
    description: "Clear terminal output screen",
    category: "System & Navigation",
    usage: "clear",
    execute: () => {
      return {
        output: "",
        action: "clear",
      };
    },
  },
];

export const getHelpText = (): string => {
  const padCmd = (name: string, targetLen = 18) =>
    name + "\u00A0".repeat(Math.max(3, targetLen - name.length));

  const primaryCmds = commandRegistry
    .filter((c) => c.category === "Primary Modules")
    .map((c) => `${padCmd(c.name)}${c.description}`)
    .join("\n");

  const sysCmds = commandRegistry
    .filter((c) => c.category === "System & Navigation")
    .map((c) => `${padCmd(c.name)}${c.description}`)
    .join("\n");

  return `AVAILABLE CONTROL-PLANE COMMANDS

PRIMARY MODULES:
${primaryCmds}

SYSTEM & NAVIGATION:
${sysCmds}

ADDITIONAL UTILITIES:
${padCmd("ls / tree")}Display virtual directory tree
${padCmd("cd <dir>")}Change context prompt directory
${padCmd("cat <file>")}Read contents of system record file

Type 'help <command>' for specific command usage (e.g. 'help courses').`;
};

export const getTreeOutput = (subpath?: string): string => {
  if (!subpath || subpath === "." || subpath === "~" || subpath === "root") {
    return `.
├── profile.txt
├── status.txt
├── experience/
${experience.map((e, i) => `│   ├── [${(i + 1).toString().padStart(2, "0")}] ${e.id} — ${e.company} | ${e.role}`).join("\n")}
├── skills/
${skills.map((s) => `│   ├── ${s.category}`).join("\n")}
├── projects/
${projects.map((p, i) => `│   ├── [${(i + 1).toString().padStart(2, "0")}] ${p.slug} — ${p.title}`).join("\n")}
├── certifications/
${certifications.map((c, i) => `│   ├── [${(i + 1).toString().padStart(2, "0")}] ${c.id} — ${c.name}`).join("\n")}
├── education/
│   ├── degree.txt — ${education.degrees[0].degree}
│   ├── honors.txt — First Place Award JAC-ECC 2019
│   └── courses.txt — ${courses.length} Completed Technical Courses
├── resume.pdf
└── contact.txt`;
  }
  return `Tree view for path '${subpath}' loaded.`;
};

export const getAutocompleteSuggestions = (input: string, context: TerminalContext): string[] => {
  const clean = input.trim().toLowerCase();
  if (!clean) return [];

  const allRegistered: string[] = [];

  // Register command names and aliases
  commandRegistry.forEach((c) => {
    allRegistered.push(c.name);
    allRegistered.push(...c.aliases);
  });

  // Register subcommands
  allRegistered.push(
    "experience list",
    "experience search",
    "experience show",
    "experience open",
    "certifications list",
    "certifications search",
    "certifications show",
    "certifications open",
    "courses list",
    "courses search",
    "courses show",
    "courses open",
    "projects list",
    "projects search",
    "projects show",
    "projects open",
    "skills list",
    "skills search",
    "education open",
    "overview open",
    "contact open",
    "ls",
    "ls -la",
    "tree",
    "pwd",
    "cd",
    "cat"
  );

  // Add IDs for open subcommands
  experience.forEach((e, i) => {
    allRegistered.push(`experience open ${e.id}`);
    allRegistered.push(`experience show ${e.id}`);
    allRegistered.push(`experience open ${(i + 1).toString().padStart(2, "0")}`);
  });
  certifications.forEach((c, i) => {
    allRegistered.push(`certifications open ${c.id}`);
    allRegistered.push(`certifications show ${c.id}`);
    allRegistered.push(`certifications open ${(i + 1).toString().padStart(2, "0")}`);
  });
  courses.forEach((c, i) => {
    allRegistered.push(`courses open ${c.id}`);
    allRegistered.push(`courses show ${c.id}`);
    allRegistered.push(`courses open ${(i + 1).toString().padStart(2, "0")}`);
  });
  projects.forEach((p, i) => {
    allRegistered.push(`projects open ${p.slug}`);
    allRegistered.push(`projects show ${p.slug}`);
    allRegistered.push(`projects open ${(i + 1).toString().padStart(2, "0")}`);
  });

  return Array.from(new Set(allRegistered.filter((c) => c.startsWith(clean))));
};

export const processTerminalCommand = (
  rawCmd: string,
  context: TerminalContext,
  cmdHistory: string[] = []
): CommandResult => {
  const clean = rawCmd.trim();
  if (!clean) return { output: "" };

  const tokens = clean.split(/\s+/);
  const mainCmdName = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  // PRIORITY STEP 1: NUMERIC INPUT PARSING AGAINST ACTIVE COLLECTION CONTEXT
  const numMatch = clean.match(/^\[?(\d{1,2})\]?$/);

  if (numMatch) {
    const numIndex = parseInt(numMatch[1], 10);

    // 1A. Active Collection: Courses (1..23)
    if (context === "courses") {
      if (numIndex >= 1 && numIndex <= courses.length) {
        return formatCourseSummary(courses[numIndex - 1], numIndex, false);
      }
      return {
        output: `Course record [${numMatch[1]}] was not found.\nEnter a number shown in the list (1-${courses.length}) or run 'courses list'.`,
        nextContext: "courses",
      };
    }

    // 1B. Active Collection: Experience (1..7)
    if (context === "experience") {
      if (numIndex >= 1 && numIndex <= experience.length) {
        return formatExperienceSummary(experience[numIndex - 1], numIndex, false);
      }
      return {
        output: `Experience record [${numMatch[1]}] was not found.\nEnter a number shown in the list (1-${experience.length}) or run 'experience list'.`,
        nextContext: "experience",
      };
    }

    // 1C. Active Collection: Certifications (1..5)
    if (context === "certifications") {
      if (numIndex >= 1 && numIndex <= certifications.length) {
        return formatCertificationSummary(certifications[numIndex - 1], numIndex, false);
      }
      return {
        output: `Certification record [${numMatch[1]}] was not found.\nEnter a number shown in the list (1-${certifications.length}) or run 'certifications list'.`,
        nextContext: "certifications",
      };
    }

    // 1D. Active Collection: Projects (1..6)
    if (context === "projects") {
      if (numIndex >= 1 && numIndex <= projects.length) {
        return formatProjectSummary(projects[numIndex - 1], numIndex, false);
      }
      return {
        output: `Project record [${numMatch[1]}] was not found.\nEnter a number shown in the list (1-${projects.length}) or run 'projects list'.`,
        nextContext: "projects",
      };
    }

    // 1E. Root Main Context Global Menu Shortcut (01 - 10 ONLY when context === "main")
    if (context === "main") {
      const mapNum: Record<number, string> = {
        1: "whoami",
        2: "status",
        3: "experience",
        4: "skills",
        5: "projects",
        6: "certifications",
        7: "education",
        8: "resume",
        9: "contact",
        10: "clear",
        0: "exit",
      };
      const mappedCmd = mapNum[numIndex];
      if (mappedCmd) {
        const def = commandRegistry.find((c) => c.name === mappedCmd);
        if (def) return def.execute(args, clean, context);
      }
    }
  }

  // STEP 2: Handle cd command
  if (mainCmdName === "cd") {
    const target = args[0]?.toLowerCase();
    if (!target || target === ".." || target === "~" || target === "home") {
      return { output: "Returned to Control Plane root context.\nPath: /home/osama", nextContext: "main" };
    }
    if (target.includes("experience") || target === "3" || target === "03") {
      return commandRegistry.find((c) => c.name === "experience")!.execute(["list"], clean, context);
    }
    if (target.includes("skills") || target === "4" || target === "04") {
      return commandRegistry.find((c) => c.name === "skills")!.execute(["list"], clean, context);
    }
    if (target.includes("projects") || target === "5" || target === "05") {
      return commandRegistry.find((c) => c.name === "projects")!.execute(["list"], clean, context);
    }
    if (target.includes("certifications") || target === "certs" || target === "6" || target === "06") {
      return commandRegistry.find((c) => c.name === "certifications")!.execute(["list"], clean, context);
    }
    if (target.includes("courses") || target.includes("training")) {
      return commandRegistry.find((c) => c.name === "courses")!.execute(["list"], clean, context);
    }
    if (target.includes("education") || target === "7" || target === "07") {
      return commandRegistry.find((c) => c.name === "education")!.execute([], clean, context);
    }
    return { output: `bash: cd: ${target}: No such file or directory`, nextContext: context };
  }

  // STEP 3: Handle ls command
  if (mainCmdName === "ls") {
    if (context === "projects") {
      return { output: projects.map((p) => `${p.slug}.md`).join("  "), nextContext: "projects" };
    }
    if (context === "certifications") {
      return { output: certifications.map((c) => `${c.id}.txt`).join("  "), nextContext: "certifications" };
    }
    if (context === "experience") {
      return { output: experience.map((e) => `${e.id}.txt`).join("  "), nextContext: "experience" };
    }
    if (context === "courses") {
      return { output: courses.map((c) => `${c.id}.txt`).join("  "), nextContext: "courses" };
    }
    if (context === "education") {
      return { output: "01-degree.txt  02-honors.txt  03-courses.txt", nextContext: "education" };
    }
    return {
      output:
        "profile.txt  status.txt  experience/  skills/  projects/  certifications/  education/  courses/  resume.pdf  contact.txt",
      nextContext: context,
    };
  }

  // STEP 4: Handle tree command
  if (mainCmdName === "tree") {
    return { output: getTreeOutput(args[0]), nextContext: context };
  }

  // STEP 5: Handle pwd command
  if (mainCmdName === "pwd") {
    return { output: getVirtualPath(context), nextContext: context };
  }

  // STEP 6: Execute matching registered command
  const foundDef = commandRegistry.find(
    (c) => c.name === mainCmdName || c.aliases.includes(mainCmdName)
  );

  if (foundDef) {
    return foundDef.execute(args, clean, context);
  }

  // STEP 7: Contextual error when typing invalid numbers or commands in active collection
  if (context !== "main") {
    const contextMap: Record<string, { label: string; count: number; cmd: string }> = {
      courses: { label: "Course", count: courses.length, cmd: "courses" },
      experience: { label: "Experience", count: experience.length, cmd: "experience" },
      certifications: { label: "Certification", count: certifications.length, cmd: "certifications" },
      projects: { label: "Project", count: projects.length, cmd: "projects" },
    };

    const currentMeta = contextMap[context];
    if (currentMeta) {
      if (/^\d+$/.test(mainCmdName)) {
        return {
          output: `${currentMeta.label} record [${mainCmdName}] was not found.\nEnter a number shown in the list (1-${currentMeta.count}) or run '${currentMeta.cmd} list'.`,
          nextContext: context,
        };
      }
    }
  }

  // STEP 8: Fuzzy match suggestion for unknown commands in root context
  let bestMatch = "";
  let lowestDist = Infinity;

  commandRegistry.forEach((c) => {
    const candidates = [c.name, ...c.aliases];
    candidates.forEach((cand) => {
      const dist = levenshteinDistance(mainCmdName, cand);
      if (dist < lowestDist && dist <= 3) {
        lowestDist = dist;
        bestMatch = c.name;
      }
    });
  });

  if (bestMatch) {
    return {
      output: `Command not found: '${mainCmdName}'.\nDid you mean: '${bestMatch}'? Type 'help' to list all commands.`,
      nextContext: context,
    };
  }

  return {
    output: `Command not found: '${mainCmdName}'. Type 'help' for available control-plane commands.`,
    nextContext: context,
  };
};
