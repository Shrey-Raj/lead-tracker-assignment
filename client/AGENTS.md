# AGENT.md - AI Tooling & Engineering Decisions

---

## 🛠️ AI Tools Used

| Tool | Usage Scope | Key Contribution |
| --- | --- | --- |
| **Gemini / ChatGPT** | Architecture planning, unit test fixes, debugging, and Markdown formatting help | Resolved Jest unhandled mock rejections, set up React Query test wrapper |
| **GitHub Copilot / Cursor** | In-editor code completion | Rapid setup of UI components, Tailwind styling classes, and Mongoose schema definitions |

---

## 💬 Prompts Used

### 1. Generating the UI components like Lead Table, Metric Cards
```text
Generate a tsx component using shadcnUI and tailwind which accepts a array(list of leads). Each lead follows a consistent structure. This table should render the leads in a smooth manner.
Each Lead has - name, email, phone, status, createdAt coming as prop

Generate a component that will render a horizontal list of cards, each card represents the numerical value of the corresponding metric. The prop which this component receives looks like: 
    export interface MetricCardProperties {
    title: string;
    displayValue: string;
    subValue: string;
    raw: {
        percentage: number;
        total: number;
    };
    }

    export interface MetricsData {
    totalInflow: MetricCardProperties,
    activePipeline: MetricCardProperties,
    conversionRate: MetricCardProperties,
    disqualificationRate: MetricCardProperties
    }
```

### 2. CSV Export Feature Request

```text
Write a utility function in Next.js frontend that converts an array of lead objects into a downloadable CSV file.
Ensure it preserves active search query filters applied in TanStack Query. You can use an external library

```

### 3. Readme & Documentation Generation

```text
Create a clean README.md for a Next.js + Express + MongoDB application deployed on Vercel and Render.
Include architecture details, setup instructions, deployment steps, trade-offs, and future improvements.
Tradeoff were - I didnt use a external state management tool for the sake of small application, faster responses and complex code overhead. I used a external library Papaparse to generate the csv rather than passing the array to the server and then receiving a csv, for quicker response and low server overhead.

```

---

## 🧩 AI-Generated vs. Manually Written Sections


### AI-Generated Sections (~80%)

* Initial components design for *Table Lead* *Metric Cards*
* Tailwind CSS layout boilerplate for homepage.
* Testing-related files for server testing

### Manually Written & Refactored Sections (~40%)

* Business logic for query-aware CSV export handling in `src/components/ExportButton.jsx`.
* Fixing React Query cache clearing configuration (`gcTime: 0`) in Jest unit tests to avoid memory leak warnings.
* Environment variables setup and production deployment configurations on Vercel and Render.
* Provider setup for ```@react-tanstack-query``` and Toaster setup for shadcn ```sonner```

---

## ⚙️ Key Engineering Decisions


1. **TanStack Query In-Memory State Management:**
* **Decision:** Used `@tanstack/react-query` for fetching, caching, and invalidating leads data.
* **Rationale:** Avoided redundant global state management setups like Redux, keeping server response synchronization automatic and handling optimistic refetches cleanly.


3. **Client-Side CSV File Generation:**
* **Decision:** Implemented CSV parsing directly on the frontend using active React Query cache state instead of generating CSVs via dedicated backend endpoints.
* **Rationale:** Reduces server load and network bandwidth, offering instant downloads for filtered results.
```
