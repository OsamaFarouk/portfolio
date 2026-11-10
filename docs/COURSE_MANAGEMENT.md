# Course Management Guide

This guide explains how to add, update, and remove professional courses from the portfolio website.
No UI or component code changes are required — adding a course in one place automatically updates:
- The **Education & Professional Courses** preview on the home page (`/#education`)
- The full **Professional Courses** gallery and filter bar (`/courses`)
- The **Resume** page (`/resume`)
- The interactive **Terminal** (`courses list`, `courses search`, `courses show`, `courses open`)

---

## 1. Where all course information is stored

| File | Role |
|------|------|
| `content/courses.json` | **Primary data file** containing all course records as a JSON array. |
| `src/data/courses.ts` | **Centralized TypeScript module** that defines the `Course` interface and exports `courses` sorted chronologically (newest year first, preserving array order within the same year). |
| `public/assets/course-certificates/` | Directory storing all certificate images and credential badges (`.webp`, `.png`, `.jpg`). |

---

## 2. How to add a new course

You can add a new course in either of two ways:

### Option A: Edit `content/courses.json` directly (Recommended)

Open `content/courses.json` and insert a new course object at the **top** of the array:

```json
  {
    "id": "unique-course-slug",
    "title": "Course Title",
    "provider": "Provider Name",
    "year": 2026,
    "completionDate": "Nov. 10, 2026",
    "certificateImage": "/assets/course-certificates/your-image.webp",
    "certificateUrl": "https://...",
    "verificationUrl": "https://...",
    "courseUrl": "https://..."
  },
```

### Option B: Interactive CLI helper

Run the built-in content generator script and follow the prompts:

```bash
node scripts/add-content.js course
```

### Supported fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique kebab-case slug (also used for deep links `/courses#<id>`). |
| `title` | `string` | Yes | Full title of the course or credential. |
| `provider` | `string` | Yes | Issuing organization or platform (e.g., `"Udemy"`, `"Amazon Web Services (AWS)"`, `"KodeKloud"`). Automatically populates the Provider filter dropdown. |
| `year` | `number` | Yes | Completion year as a 4-digit number (e.g., `2026`). Automatically populates the Year filter dropdown. |
| `completionDate` | `string \| null` | Optional | Specific completion date if shown on the certificate (e.g., `"Nov. 10, 2026"`). |
| `certificateImage` | `string \| null` | Optional | Public path to the certificate or badge image inside `public/assets/course-certificates/`. Use `null` if no image is available. |
| `certificateUrl` | `string \| null` | Optional | External URL to view/download the certificate (e.g., Udemy certificate link or Google Drive link). Use `null` if not applicable. |
| `verificationUrl` | `string \| null` | Optional | Public credential verification URL (e.g., Credly badge URL, Udemy/Coursera/Codecademy verification URL). Renders the green **VERIFY COMPLETION** link. |
| `courseUrl` | `string \| null` | Optional | URL to the course curriculum/landing page. Renders the **VIEW COURSE** link. |

---

## 3. How to add or reuse its image/logo

1. Place your certificate screenshot, converted PDF image, or badge PNG/WebP inside:
   ```text
   public/assets/course-certificates/
   ```
2. Use a descriptive lowercase kebab-case filename:
   - `.webp` is recommended for full certificate screenshots (e.g., `aws-cloudformation-master-class-udemy.webp`).
   - `.png` works great for transparent or square digital badges such as Credly badges (e.g., `aws-digital-sovereignty-technical.png`).
3. Reference the file in `content/courses.json` starting with `/assets/course-certificates/` (do **not** include `/public` in the URL path):
   ```json
   "certificateImage": "/assets/course-certificates/aws-digital-sovereignty-technical.png"
   ```
4. To **reuse** an existing provider badge or image, point `"certificateImage"` to the existing path in `/assets/course-certificates/`.
5. If you do not have an image yet, set `"certificateImage": null` — the course card will automatically render a clean fallback placeholder.

---

## 4. How to add its verification URL

- **Credly badges:** Copy the public verification URL (`https://www.credly.com/badges/<badge-id>/public_url`) into `"verificationUrl"`.
- **Udemy courses:** Copy the Udemy certificate URL (`https://www.udemy.com/certificate/UC-.../`) into `"verificationUrl"` (and optionally `"certificateUrl"`), and the course page URL (`https://www.udemy.com/course/.../`) into `"courseUrl"`.
- **Coursera / Codecademy / Other platforms:** Set `"verificationUrl"` to the public verification link.
- All external links automatically open in a new tab with `target="_blank" rel="noopener noreferrer"`.

---

## 5. How the display order works

1. **Chronological sorting (newest first):** `src/data/courses.ts` automatically sorts courses by `year` in descending order (`2026` → `2025` → `2024` → ...).
2. **Order within the same year:** JavaScript's stable sort preserves the exact order in which courses appear inside `content/courses.json` for courses sharing the same `year`.
3. **Home page preview:** `src/components/Education.tsx` displays the first 5 courses from this sorted list (`courses.slice(0, 5)`) and updates the total counter (`// PROFESSIONAL_COURSES (N)` and `VIEW ALL N COURSES`) automatically.

---

## 6. How to update or remove an existing course

- **To update a course:** Open `content/courses.json`, locate the course object by its `"id"`, and edit any field (`title`, `provider`, `year`, `certificateImage`, `verificationUrl`, `courseUrl`).
- **To remove a course:** Delete its `{ ... }` object from `content/courses.json` (ensuring valid JSON syntax with no trailing comma on the last array item). Optionally delete its unused image from `public/assets/course-certificates/`.

---

## 7. How to test the changes locally before deployment

Run the project's validation and build checks from the repository root:

```bash
# 1. Validate JSON schema, unique IDs, and verify all certificateImage files exist on disk
npm run validate:content

# 2. Run TypeScript type checking
npm run typecheck

# 3. Run ESLint
npm run lint

# 4. Run automated portfolio tests
npm test

# 5. Run production build
npm run build

# 6. Preview locally in browser (http://localhost:3000/#education and http://localhost:3000/courses)
npm run dev
```

---

## 8. Complete copy-paste examples

### Example A: Adding an AWS / Credly badge course

```json
  {
    "id": "aws-digital-sovereignty-technical",
    "title": "AWS Partner: Digital Sovereignty on AWS (Technical)",
    "provider": "Amazon Web Services (AWS)",
    "year": 2026,
    "certificateImage": "/assets/course-certificates/aws-digital-sovereignty-technical.png",
    "certificateUrl": null,
    "verificationUrl": "https://www.credly.com/badges/d5353567-effa-4049-a317-895b1ae5dce9/public_url",
    "courseUrl": null
  },
```

### Example B: Adding a Udemy course with certificate image, verification URL, and course URL

```json
  {
    "id": "aws-cloudformation-master-class-udemy",
    "title": "AWS CloudFormation Master Class v2",
    "provider": "Udemy",
    "year": 2026,
    "completionDate": "Nov. 10, 2026",
    "certificateImage": "/assets/course-certificates/aws-cloudformation-master-class-udemy.webp",
    "certificateUrl": "https://www.udemy.com/certificate/UC-ced393f9-7c40-49db-86af-5880e3ff807c/",
    "verificationUrl": "https://www.udemy.com/certificate/UC-ced393f9-7c40-49db-86af-5880e3ff807c/",
    "courseUrl": "https://www.udemy.com/course/aws-cloudformation-master-class/"
  },
```
