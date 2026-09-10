# PPC Lab

An experimental garage full of anti-bullshit PPC AI robots. See the top of this
repo's conversation history / project brief for the full concept — this file
covers just what's needed to run it.

## Setup

```bash
npm install
```

### AI runtime (Gemini)

The app calls the Gemini API server-side, via the official `@google/genai` SDK,
to run live agent analysis. This is separate from whatever AI tool you're using
to develop the app — the running app needs its own key.

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Paste your key into `.env.local`:
   ```
   GEMINI_API_KEY=your-key-here
   ```

`.env.local` is gitignored — the key never gets committed, never reaches the
browser (it's only read inside Next.js Route Handlers), and is never logged.
`.env.example` intentionally only ever holds a placeholder, never a real key.
Without a key, the rest of the app (personality, Pantry, mock robots) still
works — only live analysis returns a clear, typed "AI provider not configured"
error until you set one.

**Model defaults:** `gemini-3.6-flash` (default) and `gemini-3.1-pro-preview`
(optional, for heavier analysis — selectable on `/ai-test`). Both are
overridable via `GEMINI_MODEL_FLASH` / `GEMINI_MODEL_PRO`. Note:
`gemini-2.5-flash`/`gemini-2.5-pro` are retired for new API keys as of this
build — Google's API 404s them with a migration hint, which is how these
defaults were picked (verified live, not assumed).

### Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the app, or
[http://localhost:3000/ai-test](http://localhost:3000/ai-test) for the
standalone AI test sandbox.

## Architecture notes

- **No database.** Uploaded datasets are parsed and held in a single
  in-memory `Map` on the server process (`src/lib/server/datasetStore.ts`).
  Restarting `npm run dev` clears it — same as clicking **Reset Lab**, which
  also clears it (and the client's local state) on purpose.
- **One AI abstraction layer, three entry points.** Nothing outside
  `src/lib/ai/` ever touches Gemini directly — not agents, not API routes, not
  UI. Everything calls one of:
  - `generateStructuredOutput<T>({ systemInstruction, prompt, schema, validate?, model? })` —
    the general-purpose primitive.
  - `generateAnalysis({ systemInstruction, prompt, model? })` — fixed
    insights/actions/expectedImpact/confidence/evidence shape, what every
    robot's live analysis returns.
  - `generateRecommendations({ systemInstruction, prompt, model? })` — a
    flatter prioritized punch list, for when a full analysis shape is
    overkill.

  Swapping providers later (Claude, OpenAI) means adding one branch inside
  `src/lib/ai/index.ts`'s internal `getProvider()` — nothing else changes.
- **Personality vs. logic stays separate.** Robot personality/UI/mottos live
  in `src/lib/robots.ts`; analytical instructions, preprocessing, and prompts
  live in `src/lib/agents/`. They're joined only by a shared `id`. The Gemini
  system instructions explicitly forbid humor/character voice — personality
  never touches analytical output.
- **Only Search Term Goblin is "live."** The other five robots still run the
  original mock/random flow from the visual prototype. See
  `src/lib/liveAgents.ts` for the switch that controls which robots get real
  upload + real Gemini analysis.
- **`/ai-test`** is a standalone sandbox independent of the Pantry/robot
  state — upload a search terms CSV/XLSX, pick flash or pro, see the raw
  Gemini output (wasted spend, negative keywords, themes, quick wins) plus
  the exact deterministic evidence it was grounded in.
