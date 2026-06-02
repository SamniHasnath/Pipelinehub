# PipelineHub

A free, interactive CI/CD learning platform built with React and Vite. Learn how automated pipelines work, build your own with a visual editor, compare tools, and track your progress — all in one place.

## Features

- **Learn CI/CD** — Interactive lessons with real YAML examples, from beginner to advanced GitOps patterns
- **Pipeline Builder** — Click to add stages, pick your platform, and export a ready-to-use YAML file
- **Tools Explorer** — Compare GitHub Actions, Jenkins, GitLab CI, CircleCI, ArgoCD by pricing, speed, and use case
- **Skill Roadmap** — Track your progress from beginner to DevOps professional

## Tech Stack

- [React 19](https://react.dev) — UI framework
- [Vite](https://vitejs.dev) — Build tool and dev server
- [React Router v7](https://reactrouter.com) — Client-side routing
- [Tailwind CSS v3](https://tailwindcss.com) — Utility-first styling
- [Lucide React](https://lucide.dev) — Icon library

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── PipelineStage.jsx
├── pages/
│   ├── Home.jsx
│   ├── Learn.jsx
│   ├── Builder.jsx
│   ├── Tools.jsx
│   └── Roadmap.jsx
├── data/
│   ├── lessons.js
│   ├── templates.js
│   └── tools.js
├── App.jsx
└── main.jsx
```

## Topics Covered

GitHub Actions · GitLab CI · Jenkins · CircleCI · ArgoCD · Docker · Kubernetes

## License

MIT
