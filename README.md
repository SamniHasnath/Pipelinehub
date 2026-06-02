# PipelineHub

> **The free, interactive platform for learning CI/CD pipelines — from zero to production.**

🌐 **Live Demo → [pipelinehub.vercel.app](https://pipelinehub.vercel.app/)**

---

## What is PipelineHub?

PipelineHub is a browser-based learning platform that teaches you everything about CI/CD pipelines. You can read structured lessons, visually build a real pipeline and export its YAML, compare every major DevOps tool, and track your learning progress — all without signing up.

---

## Features

### 📚 Learn CI/CD
Step-by-step lessons with real YAML examples, inline code blocks, and key insights.

| # | Lesson | Level | Duration |
|---|--------|-------|----------|
| 1 | What is CI/CD? | Beginner | 5 min |
| 2 | Pipeline stages explained | Beginner | 8 min |
| 3 | GitHub Actions basics | Beginner | 10 min |
| 4 | Secrets & environment variables | Beginner | 6 min |
| 5 | Caching & speed optimisation | Intermediate | 7 min |
| 6 | CI/CD best practices | Intermediate | 7 min |

Progress is saved in `localStorage` — pick up exactly where you left off.

---

### ⚡ Pipeline Builder
Visual drag-and-drop pipeline editor that generates a ready-to-use config file.

- **Platforms supported:** GitHub Actions · GitLab CI · Jenkins
- **Available stages:** Checkout · Install deps · Lint · Run tests · Build · Security scan · Docker build & push · Deploy
- **Output:** Copy to clipboard or download the file directly
- Configurable pipeline name, branch, and Node.js version

---

### 🔧 Tools Explorer
Side-by-side comparison of the most popular CI/CD tools — pricing, speed, strengths, and ideal use cases.

Covers: **GitHub Actions · GitLab CI · Jenkins · CircleCI · ArgoCD · Docker · Kubernetes · Snyk · Trivy · SonarQube · Vercel · Netlify**

---

### 🗺️ Skill Roadmap
A structured learning path from complete beginner to DevOps professional.

- Three levels: **Beginner → Intermediate → Advanced**
- Check off skills as you complete them
- Progress saved automatically in `localStorage`
- Linked directly to relevant lessons inside the app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | [React 19](https://react.dev) |
| Build Tool | [Vite 8](https://vitejs.dev) |
| Routing | [React Router v7](https://reactrouter.com) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Deployment | [Vercel](https://vercel.com) |

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pipelinehub.git
cd pipelinehub

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
pipelinehub/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Footer.jsx          # Site footer
│   │   └── PipelineStage.jsx   # Draggable stage card in Builder
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with pipeline animation & FAQ
│   │   ├── Learn.jsx           # Interactive lesson viewer
│   │   ├── Builder.jsx         # Visual pipeline builder & YAML exporter
│   │   ├── Tools.jsx           # CI/CD tools comparison
│   │   └── Roadmap.jsx         # Skill checklist roadmap
│   ├── data/
│   │   ├── lessons.js          # Lesson content
│   │   ├── templates.js        # Pipeline templates
│   │   └── tools.js            # Tools metadata
│   ├── App.jsx                 # Router setup
│   ├── App.css
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles + Tailwind imports
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, pipeline animation, stats, features, FAQ |
| `/learn` | Learn | Interactive lesson reader with progress tracking |
| `/builder` | Builder | Visual YAML pipeline builder |
| `/tools` | Tools | CI/CD tools explorer & comparison |
| `/roadmap` | Roadmap | Skill checklist from beginner to advanced |

---

## CI/CD Tools Covered

GitHub Actions · GitLab CI · Jenkins · CircleCI · ArgoCD · Docker · Kubernetes · Snyk · Trivy · SonarQube

---

## Deployment

The app is deployed on **Vercel** with automatic deployments on every push to `main`.

🌐 [https://pipelinehub.vercel.app](https://pipelinehub.vercel.app/)

---

## License

MIT — free to use, fork, and build on.
