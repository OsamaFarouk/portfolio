import profileData from "../../content/profile.json";
import experienceData from "../../content/experience.json";
import projectsData from "../../content/projects.json";
import skillsData from "../../content/skills.json";
import certificationsData from "../../content/certifications.json";
import educationData from "../../content/education.json";
import coursesData from "../../content/courses.json";
import socialLinksData from "../../content/social-links.json";
import futureSectionsData from "../../content/future-sections.json";

export interface Profile {
  name: string;
  title: string;
  avatarUrl: string;
  roles: string[];
  location: string;
  timezone: string;
  availability: string;
  email: string;
  phone: string;
  summary: string;
  aboutStoryParagraph1: string;
  aboutStoryParagraph2: string;
}

export interface Experience {
  id: string;
  company: string;
  project: string | null;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  employmentType: string;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  logo: string | null;
  current: boolean;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  type: string;
  status: string;
  date: string;
  employer: string | null;
  role: string;
  featured: boolean;
  draft: boolean;
  confidential: boolean;
  environments?: string[];
  tags: string[];
  background: string;
  solution: string;
  responsibilities: string[];
  challenges: string;
  results: string[];
  githubLink: string | null;
  liveLink: string | null;
  architecture: string | null;
}

export interface CertificationRef {
  shortName: string;
  targetId: string;
  fullName: string;
}

export interface SkillItem {
  name: string;
  proficiency: string;
  years: number | string;
  certified: boolean;
  certBadge?: string;
  certification?: CertificationRef;
  certifications?: CertificationRef[];
}

export interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  code: string | null;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  verificationLink: string | null;
  badgeUrl: string | null;
  imageClass?: string;
  containerClass?: string;
}

export interface Degree {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  details: string[];
}

export interface EducationCourse {
  name: string;
  provider: string;
  year: string;
}

export interface Award {
  name: string;
  organization: string;
  year: string;
  description: string;
}

export interface EducationData {
  degrees: Degree[];
  courses: EducationCourse[];
  awards: Award[];
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  phone: string;
}

export interface Volunteering {
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface FutureSections {
  volunteering: { enabled: boolean; items: Volunteering[] };
  languages: { enabled: boolean; items: Language[] };
  blog: { enabled: boolean; items: Record<string, unknown>[] };
  testimonials: { enabled: boolean; items: Record<string, unknown>[] };
  talks: { enabled: boolean; items: Record<string, unknown>[] };
  services: { enabled: boolean; items: Record<string, unknown>[] };
  awards: { enabled: boolean; items: Award[] };
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  year: number;
  certificateImage: string | null;
  certificateUrl: string | null;
  verificationUrl: string | null;
}

export const profile: Profile = profileData as Profile;
export const experience: Experience[] = experienceData as Experience[];
export const projects: Project[] = (projectsData as Project[]).filter(p => !p.draft);
export const allProjects: Project[] = projectsData as Project[]; // includes drafts for validation/management
export const skills: SkillCategory[] = skillsData as SkillCategory[];
export const certifications: Certification[] = certificationsData as Certification[];
export const education: EducationData = educationData as EducationData;
export const courses: Course[] = coursesData as Course[];
export const socialLinks: SocialLinks = socialLinksData as SocialLinks;
export const futureSections: FutureSections = futureSectionsData as FutureSections;

// Calculate stats automatically
export const portfolioStats = {
  yearsOfExperience: new Date().getFullYear() - 2021, // starts August 2021
  totalProjects: projects.length,
  totalCertifications: certifications.length,
  totalEmployers: Array.from(new Set(experience.map(e => e.company))).length,
  totalSkillsCount: skills.reduce((acc, cat) => acc + cat.skills.length, 0),
};

// Structured Résumé Presentation Selectors
export const getResumeProfile = () => {
  return {
    name: profile.name,
    title: profile.title,
    email: socialLinks.email,
    phone: socialLinks.phone,
    location: profile.location,
    linkedin: socialLinks.linkedin,
    github: socialLinks.github,
    summary: profile.summary,
  };
};

export const getResumeExperience = (): Experience[] => {
  return [...experience]
    .filter((e) => (e as unknown as Record<string, unknown>).visibility ? ((e as unknown as Record<string, unknown>).visibility as Record<string, boolean>).resume !== false : true)
    .sort((a, b) => {
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return 0;
    });
};

export const getResumeSkills = (): SkillCategory[] => {
  return skills
    .map((cat) => ({
      category: cat.category,
      skills: cat.skills.filter((s) => (s as unknown as Record<string, unknown>).visibility ? ((s as unknown as Record<string, unknown>).visibility as Record<string, boolean>).resume !== false : true),
    }))
    .filter((cat) => cat.skills.length > 0);
};

export const getResumeCertifications = (): Certification[] => {
  return certifications.filter((c) => (c as unknown as Record<string, unknown>).visibility ? ((c as unknown as Record<string, unknown>).visibility as Record<string, boolean>).resume !== false : true);
};

export const getResumeEducation = (): Degree[] => {
  return education.degrees.filter((d) => (d as unknown as Record<string, unknown>).visibility ? ((d as unknown as Record<string, unknown>).visibility as Record<string, boolean>).resume !== false : true);
};

export const getResumeCourses = (): Course[] => {
  return courses.filter((c) => (c as unknown as Record<string, unknown>).visibility ? ((c as unknown as Record<string, unknown>).visibility as Record<string, boolean>).resume !== false : true);
};

export const getResumeAwards = (): Award[] => {
  return education.awards.filter((a) => (a as unknown as Record<string, unknown>).visibility ? ((a as unknown as Record<string, unknown>).visibility as Record<string, boolean>).resume !== false : true);
};

export const getResumeVolunteering = (): Volunteering[] => {
  if (!futureSections?.volunteering?.enabled) return [];
  return futureSections.volunteering.items.filter((v) => (v as unknown as Record<string, unknown>).visibility ? ((v as unknown as Record<string, unknown>).visibility as Record<string, boolean>).resume !== false : true);
};

export const getResumeLanguages = (): Language[] => {
  if (!futureSections?.languages?.enabled) return [];
  return futureSections.languages.items.filter((l) => (l as unknown as Record<string, unknown>).visibility ? ((l as unknown as Record<string, unknown>).visibility as Record<string, boolean>).resume !== false : true);
};
