# 🚀 Osama Ahmed Farouk - DevOps Career Portfolio Cockpit

A high-fidelity, interactive, and responsive DevOps-themed portfolio website. Taking inspiration from mission control consoles, terminal prompts, and infrastructure nodes, this website dynamically presents your experience, projects, skills, and certifications.

Built with **Next.js**, **TypeScript**, **Tailwind CSS v4**, and **Mermaid.js**.

---

## ⚡ Update Your Portfolio in Under Two Minutes

All website content is abstracted from UI components and stored in the `content/` folder as structured JSON databases. Adding content is simple:

### 1. Run Content Commands
Open your terminal inside the project directory and run one of the following commands to add entries interactively:

```bash
# Add a new project case study
npm run add:project

# Add a professional experience role
npm run add:experience

# Add a technical tool or skill
npm run add:skill

# Add an industry credential/badge
npm run add:certification
```

### 2. Verify Your Changes
Verify that all database files match the required schemas before deploying:

```bash
npm run validate:content
```

---

## 🛠 Project Structure

```
d:\Portfolio
├── content/               # Centralized JSON databases (profile, skills, experience, etc.)
├── public/                # Static assets (PDF resumes, profile photo placeholders)
├── scripts/               # CLI content creation and schema validation scripts
├── src/
│   ├── components/        # Reusable dashboard UI blocks (Terminal, Timeline, Mermaid)
│   ├── pages/             # Layout routing and dedicated views
│   └── styles/            # Tailwind v4 theme configurations
└── README.md
```

---

## 💻 Local Setup & Development

### 1. Install Node.js Portable Environment
If Node.js is not globally configured, download and extract Node.js to a local folder and append it to your environment PATH.

### 2. Install Project Dependencies
Run npm install using the Node.js path:
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser to access the cockpit console locally.

### 4. Build Production Bundle
To compile a fully optimized production bundle, run:
```bash
npm run build
```

---

## 📦 Deployment Instructions

The project is fully compatible with static hosting and dynamic hosting providers.

### Option A: Vercel / Netlify / Cloudflare Pages (Recommended)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Link the repository to your hosting account (e.g., Vercel).
3. Set the **Build Command** to: `npm run build`
4. Set the **Output Directory** to: `.next` (or leave default for Next.js automatic integrations).

---

## 📝 Maintenance & Placeholders

Refer to [MISSING_CONTENT.md](file:///d:/Portfolio/MISSING_CONTENT.md) for a comprehensive checklist of missing photos, verification links, and credential IDs.
- **Photo**: Replace [avatar-placeholder.jpg](file:///d:/Portfolio/public/images/avatar-placeholder.jpg).
- **Resume**: Replace [Osama_Farouk_DevOps_Resume.pdf](file:///d:/Portfolio/public/resume/Osama_Farouk_DevOps_Resume.pdf).
