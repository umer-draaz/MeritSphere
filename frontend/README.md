# MeritSphere – React frontend (no backend)

Vite + React 18 + React Router 6. Styling is plain CSS (`src/styles/theme.css`), icons from `lucide-react`.

## Run
```bash
npm install
npm run dev
```

## Already have your own Vite + React project?
1. Copy `src/` into your project (merge `main.jsx` / `App.jsx` if you already have them).
2. Copy the Poppins `<link>` from `index.html` into yours.
3. `npm i react-router-dom lucide-react`
4. Keep `<BrowserRouter><ProfileProvider>…` wrapping `<App />` as in `src/main.jsx`.

## Screens and flow
| Route | Screen | Goes to |
|---|---|---|
| `/` | Admission Navigator (inputs + live preview) | Results, Marks Needed, Explore (quick questions) |
| `/results` | Results & chances (tabs: All / Safe / Target / Reach / Scholarships) | Marks Needed, Explore (compare bar) |
| `/calculator` | Marks Needed (simulator, scenarios, "if I score X") | Explore |
| `/explore` | Explore & Compare (filters + comparison table) | Marks Needed, Navigator |

Everything the student enters on `/` is kept in `ProfileContext` (and `localStorage`), so every screen recalculates from the same inputs.

## Where to plug in a backend later
- `src/data/programs.js` – replace with an API call (same object shape).
- `src/lib/merit.js` – aggregate, required-marks and chance logic.
- `src/context/ProfileContext.jsx` – profile state, compare list, selected program.
