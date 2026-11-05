/* Roadmap content — transcribed from "AI Full-Stack / FDE Roadmap — Detailed Session Plan".
   Each week: 6 sessions + 1 free day. Weeks 1–4: 40 min · Weeks 5–9: 80 min. */
window.ROADMAP = {
  title: "AI Full-Stack / FDE Roadmap",
  originalStart: "2026-10-01",
  originalEnd: "2026-12-02",
  stack: "Node/TS, Postgres + pgvector, Redis, BullMQ, Docker, AWS",

  tutorPrompt: `You are my tutor for a timeboxed study session. My background: 3 years
full-stack (Node/TS, Postgres, Redis, Docker, AWS). I have {{MIN}} minutes.
I learn by building, so keep theory to the minimum that makes the build make sense.

Rules:
- Work through the "Learn" list in order. For each item: a 3–5 sentence explanation,
  one concrete example in TypeScript, and one gotcha people hit in production.
- Ask me one check question per item before moving on. If I'm wrong, correct me and move on.
- Then walk me through the "Build" task. Give me the structure, let me write the code,
  review what I write. Do not paste the whole solution unless I ask.
- Stop when the "Done when" condition is met. Then give me a 5-line recap and
  one thing to revise on my free day.

Here is today's session:
{{SESSION}}`,

  warmup: {
    id: "w0s1", week: 0, num: 1, title: "Warm-up",
    learn: [
      "How an LLM works at the level you need: next-token prediction, why the same input can give different outputs, what \"context\" actually is. One good explainer, once.",
      "The API shape you'll use all plan: messages array, roles, model IDs, max tokens.",
      "Cost model: input tokens vs output tokens, why they're priced differently."
    ],
    build: [
      "Repo with TypeScript, tsx/ts-node, ESLint, dotenv, a src/ layout you'll grow for 9 weeks.",
      "API keys for two providers. Billing alerts set on both, so a bad loop doesn't cost you a week's pay.",
      "Postgres + Redis running in Docker Compose (you'll need them from Week 2).",
      "A NOTES.md where every session's takeaway goes in 3 lines."
    ],
    extra: {
      label: "Decide now",
      items: [
        "RAG corpus for Project 1: something genuinely messy and public — regulatory filings, API docs across versions, legal templates, research papers.",
        "Agent task for Project 2: a real task you'd hand off yourself."
      ]
    },
    done: "npm run dev prints \"hello\" and both DBs accept a connection."
  },

  weeks: [
    {
      n: 1, title: "AI Basics", minutes: 40, dates: "Thu 1 – Wed 7 Oct",
      free: "Revise, or add prompt-variant comparison to the playground.",
      sessions: [
        { title: "Tokens, cost, and your first call",
          learn: [
            "Tokenization: what a token is, why ≠ words, why non-English text costs more.",
            "Context window: what it holds (system + history + tools + output), what happens at the limit.",
            "Pricing: input vs output tokens, cached input, how to calculate cost per request.",
            "Sampling knobs: temperature, top-p, max tokens, stop sequences — and which you should actually touch.",
            "Determinism: why seeds don't fully save you, and why this breaks your normal testing instincts."
          ],
          build: [
            "src/llm/client.ts: a thin wrapper over one provider's chat completion.",
            "A callLLM() that returns { text, inputTokens, outputTokens, costUSD, latencyMs }.",
            "A pricing table in code, so cost is calculated not guessed.",
            "Log every call to a JSONL file — this becomes your poor-man's observability until Week 8."
          ],
          done: "You run one prompt and see text, tokens, cost and latency printed." },
        { title: "Prompting that actually changes output",
          learn: [
            "Roles: system vs user vs assistant — what each is really for, why stuffing everything in system is a smell.",
            "Zero-shot vs few-shot: when examples beat instructions.",
            "Instruction design: specificity, ordering, delimiters, negative instructions and why they fail.",
            "Step-by-step reasoning: when asking for reasoning helps, when it just burns tokens.",
            "Prompt injection, first look: user text becomes instructions if you let it."
          ],
          build: [
            "Pick one task (e.g. \"extract action items from a meeting transcript\").",
            "Write 3 prompt variants: naive, structured-instructions, few-shot.",
            "A script that runs all 3 over the same 5 inputs and prints outputs side by side with cost."
          ],
          done: "You can say which variant wins and why, with token cost per variant." },
        { title: "Embeddings, the honest version",
          learn: [
            "What an embedding is: text → fixed-length vector, what \"similar\" means geometrically.",
            "Cosine similarity vs Euclidean distance — why cosine for text.",
            "Dimensions and models: why you cannot mix embeddings from two models in one index.",
            "What embeddings are bad at: negation, numbers, exact IDs, rare proper nouns.",
            "Cost and batching: embeddings are cheap, but you'll run millions in Week 5."
          ],
          build: [
            "src/embed.ts: embed an array of strings, batched, with retry.",
            "Embed 20 sentences (some near-duplicates, some opposites).",
            "Brute-force cosine search in plain TypeScript — no DB yet. Print top-3 for a few queries.",
            "Find one case where the \"wrong\" sentence ranks first, and write down why."
          ],
          done: "Nearest-neighbour search works and you have one documented failure case." },
        { title: "Why you can't trust the output",
          learn: [
            "Hallucination: why it isn't a bug, it's the mechanism.",
            "Confident-wrong: why fluency and accuracy are unrelated signals.",
            "Where failures cluster: numbers, citations, dates, rare entities, long context (\"lost in the middle\").",
            "Grounding: giving the model source text and requiring it to cite — the whole idea behind RAG.",
            "The engineering conclusion: treat model output as untrusted input, like a request body."
          ],
          build: [
            "Take Session 2's task and deliberately break it: ambiguous input, missing info, contradictory instructions.",
            "Log 5 failure modes in NOTES.md with the exact input that caused each.",
            "Sketch (in comments) where validation, retries and grounding will go in Week 2."
          ],
          done: "You have a written list of 5 real failures from your own runs." },
        { title: "Streaming end to end",
          learn: [
            "Why streaming: time-to-first-token is the number users feel, not total latency.",
            "SSE vs WebSockets vs polling — why SSE is the default for this.",
            "Server side: the streaming API, chunk shape, flushing, Content-Type: text/event-stream.",
            "Client side: consuming the stream, rendering progressively, cancellation on unmount.",
            "The hard parts: aborting a request, counting tokens when streaming, errors mid-stream."
          ],
          build: [
            "Express route POST /chat that streams tokens as SSE.",
            "A minimal frontend page that renders tokens as they arrive with a Stop button.",
            "Accumulate usage after the stream ends and log cost from Session 1."
          ],
          done: "You see text appear word by word in a browser and Stop actually cancels the upstream call." },
        { title: "Mini-project 1: LLM Playground", project: true,
          learn: ["Nothing new. Assembly session."],
          build: [
            "One page: prompt box, model selector (2 providers), temperature slider, streamed output.",
            "Sidebar showing tokens in/out, cost for this call, and running session total.",
            "History of the last 10 runs stored in memory, clickable to re-run.",
            "README: what it does, what you learned, one screenshot."
          ],
          done: "Repo is public, README is written, and you'd show it to someone without apologising." }
      ]
    },
    {
      n: 2, title: "Gen AI Engineering", minutes: 40, dates: "Thu 8 – Wed 14 Oct",
      free: "Revise, or add a second data source to the SQL Assistant.",
      sessions: [
        { title: "Prompts as code",
          learn: [
            "Why prompts in string literals rot: no diff, no review, no rollback.",
            "Prompt files: one file per prompt, front-matter metadata (model, temperature, version).",
            "Templating and variable interpolation — and escaping user input inside a template.",
            "Versioning: semantic version per prompt, why you'll need it when evals arrive in Week 4.",
            "Prompt registry: loading, caching and typing prompts at startup."
          ],
          build: [
            "prompts/ directory, one .md or .ts file per prompt with metadata.",
            "loadPrompt(name, vars) with typed variables, throwing if a variable is missing.",
            "Move every prompt you've written so far into it."
          ],
          done: "No prompt string is left inline anywhere in src/." },
        { title: "Structured outputs",
          learn: [
            "Why JSON out of an LLM is different from JSON out of an API: it's generated, not serialized.",
            "The three approaches: prompt-and-pray, JSON mode, native structured outputs / function schemas.",
            "JSON Schema basics for this: types, enums, required, nested objects, arrays, additionalProperties.",
            "Schema design for LLMs: flat beats nested, enums beat free text, always allow an \"unknown\" value.",
            "Where it still fails: truncation at max tokens, schema-valid but semantically wrong."
          ],
          build: [
            "A schema for a real extraction task (e.g. messy job posting → {title, company, salaryMin, salaryMax, remote, techStack[]}).",
            "Run it over 10 genuinely messy inputs.",
            "Log which fields the model gets wrong most often."
          ],
          done: "10/10 outputs parse as JSON, and you know which field is least reliable." },
        { title: "Validation and retries",
          learn: [
            "Zod: schema definition, safeParse, inferring TypeScript types from the schema.",
            "Keeping one source of truth: Zod schema → JSON Schema for the model.",
            "The retry loop: feed the validation error back to the model as a message, retry with a cap.",
            "Backoff and budget: max 2 retries, exponential delay, hard cost ceiling per request.",
            "Graceful failure: partial results, a confidence field, a fallback path — never a 500 to the user."
          ],
          build: [
            "callStructured<T>(prompt, schema): calls, validates, retries on invalid with the error text, gives up cleanly.",
            "Force failures with a deliberately hard schema and confirm the retry path runs.",
            "Metrics: first-attempt success rate over your 10 test inputs."
          ],
          done: "Invalid output is caught, retried, and the function never throws raw parse errors." },
        { title: "Tool calling",
          learn: [
            "The mechanic: you send tool definitions, the model returns a tool request, you execute it, you send the result back.",
            "Tool schemas: naming, descriptions (the model reads them — they're prompt, not docs), parameter design.",
            "The loop: tool call → execute → append result → call again → repeat until a text answer.",
            "Multiple and parallel tool calls in one turn.",
            "Safety: validate tool arguments with Zod before executing, never interpolate them into SQL."
          ],
          build: [
            "Tool 1: hardcoded getWeather(city) — just to see the cycle work.",
            "Tool 2: queryOrders(customerId, status) hitting real Postgres, parameterised, with a LIMIT.",
            "A runWithTools() loop with a max-iteration guard."
          ],
          done: "A natural-language question returns an answer computed from a real DB row." },
        { title: "State and context management",
          learn: [
            "Conversation state: what to store (messages, tool results, metadata) and what to recompute.",
            "Redis patterns: key design per conversation, TTL, serialization, size limits.",
            "Context window management: token counting before sending, not after failing.",
            "Three strategies: sliding window, summarise-and-compact, and retrieve-relevant-history (the seed of RAG).",
            "Idempotency: replaying a turn safely when a request is retried."
          ],
          build: [
            "ConversationStore on Redis: append message, load history, TTL of 24h.",
            "A token counter, plus a trimming strategy that keeps system + last N turns + a running summary.",
            "Prove it: run a conversation long enough to trigger trimming and confirm nothing breaks."
          ],
          done: "A 50-turn conversation still answers correctly and never exceeds the context limit." },
        { title: "Reliability + Mini-project 2: SQL Assistant", project: true,
          learn: [
            "Failure modes of LLM APIs: 429s, 500s, timeouts, mid-stream disconnects, provider outages.",
            "Retry policy: which errors are retryable, jitter, per-request budget.",
            "Timeouts at every level: HTTP, tool execution, total request.",
            "Degradation: fall back to a cheaper/faster model, or to a canned response, rather than failing.",
            "Cost guardrails: per-user and per-request caps."
          ],
          build: [
            "Wrap every provider call in retry + timeout + budget.",
            "Mini-project 2: \"SQL Assistant\" — natural language → tool call → real Postgres query → streamed answer with the SQL shown.",
            "Guardrails: read-only DB user, allowlisted tables, forced LIMIT, query timeout.",
            "README with architecture and the failure modes you handled."
          ],
          done: "The assistant survives you pulling the DB down mid-request without crashing." }
      ]
    },
    {
      n: 3, title: "Agentic AI", minutes: 40, dates: "Thu 15 – Wed 21 Oct",
      free: "Revise, or write up the framework comparison as your first public post draft.",
      sessions: [
        { title: "What an agent actually is",
          learn: [
            "The spectrum: prompt chain → workflow (you control the path) → agent (the model controls the path).",
            "When an agent is the wrong answer — most of the time. A fixed workflow is cheaper, faster, testable.",
            "Anatomy: goal, tools, loop, memory, termination condition.",
            "Termination: the hardest part — success detection, max steps, no-progress detection, human handoff.",
            "Cost and latency shape: why an agent is 5–20× a single call, and how founders think about that."
          ],
          build: [
            "Write a one-page design doc for the agent you'll build this week: goal, tools, stop conditions, failure handling.",
            "Define the TypeScript types: AgentState, Step, ToolResult, StopReason."
          ],
          done: "The doc names the exact conditions under which your agent stops." },
        { title: "The loop, by hand",
          learn: [
            "The core loop: observe → decide → act → observe, and where each lives in code.",
            "State machine vs while-loop — why an explicit state object saves you at debug time.",
            "Step history: what to keep in context vs what to summarise.",
            "Error handling inside the loop: a tool throws — retry, tell the model, or abort?",
            "Why writing it by hand first makes frameworks legible later."
          ],
          build: [
            "src/agent/loop.ts: a loop with no framework, using Week 2's tool calling.",
            "Structured trace of every step: thought, tool, args, result, tokens, cost.",
            "Pretty-print the trace to the console so you can actually read a run."
          ],
          done: "A 3-step task completes and you can read the whole trace end to end." },
        { title: "ReAct and reflection",
          learn: [
            "ReAct: interleaving reasoning and acting, and what it buys over plain tool calling.",
            "Prompting for it: the thought/action/observation format, and how to parse it reliably.",
            "Reflection / self-critique: a second pass reviewing the first — when it helps, when it just doubles cost.",
            "Planning up front vs deciding step by step — trade-offs.",
            "Measure, don't assume. Both ReAct and reflection often help less than you'd hope."
          ],
          build: [
            "Add explicit reasoning to each step of your loop.",
            "Add an optional reflection pass behind a flag.",
            "Run the same 5 tasks with and without the flag; log success rate, steps, cost."
          ],
          done: "You have numbers showing whether reflection is worth it for your task." },
        { title: "Loop limits and safety rails",
          learn: [
            "Max steps and why the default should be low (5–10).",
            "Cost ceiling per run, checked before each model call.",
            "Wall-clock timeout for the whole run, and per-tool timeouts.",
            "Loop detection: same tool, same args, twice — stop.",
            "Graceful give-up: return partial progress and the reason, never a silent hang."
          ],
          build: [
            "A Budget object threaded through the loop: steps, USD, milliseconds.",
            "Loop detection on a hash of (tool, args).",
            "Every terminal path returns a typed StopReason — success | max_steps | budget | timeout | loop | error.",
            "Test each stop reason deliberately."
          ],
          done: "You can trigger all six stop reasons on demand." },
        { title: "Memory and MCP",
          learn: [
            "Short-term memory: the working context of a single run.",
            "Long-term memory: facts and preferences that survive runs — and why it's just a store plus a retrieval step.",
            "What to remember: stable preferences, not every message. Staleness and contradiction problems.",
            "MCP (Model Context Protocol): what problem it solves — tools and data sources as a standard interface instead of bespoke glue.",
            "MCP shape: servers expose tools/resources, clients (your agent) consume them. Why startups care."
          ],
          build: [
            "Short-term memory: compact step history when it grows past a threshold.",
            "A minimal MCP client, or wrap one of your tools behind an MCP server, to feel the interface."
          ],
          done: "A long run stays inside the context window without losing the goal." },
        { title: "Frameworks + Mini-project 3", project: true,
          learn: [
            "LangGraph, Vercel AI SDK, OpenAI Agents SDK: what each actually gives you (graph state, streaming/UI, hosted loop).",
            "What you give up: debuggability, control over context, and knowing where your tokens went.",
            "How to answer the interview question: \"which framework would you use and why\" → \"here's the trade-off, and here's when I'd hand-roll it.\""
          ],
          build: [
            "Mini-project 3: your agent doing one real end-to-end task with 3 tools, all limits on, full trace, README with an architecture diagram.",
            "Optional: port the same agent to one framework and note how much code disappeared and what got harder."
          ],
          done: "The agent completes its real task and the repo is public." }
      ]
    },
    {
      n: 4, title: "Evals (+ Job Track opens)", minutes: 40, dates: "Thu 22 – Wed 28 Oct",
      free: "Public post: what you built in three weeks, with the eval numbers.",
      job: "Work at a Startup profile, GitHub README, CV rewrite, X/LinkedIn bio.",
      sessions: [
        { title: "Golden datasets",
          learn: [
            "Why evals: you cannot improve what you don't measure, and LLM changes are invisible without a score.",
            "Eval types: unit-level (one prompt), task-level (end-to-end), regression (did this change break anything).",
            "What a golden example is: input + expected behaviour, not necessarily expected exact text.",
            "Sourcing cases: real usage, your Week 1 failure list, edge cases, adversarial inputs.",
            "Dataset hygiene: version it in git, never let it leak into prompts, keep a held-out slice."
          ],
          build: [
            "evals/dataset.jsonl: 30 examples across your three mini-projects.",
            "Each row: {id, input, expected, category, difficulty}.",
            "At least 8 rows should be things you've actually seen fail."
          ],
          done: "30 real examples exist in git, not 30 invented ones." },
        { title: "The eval runner",
          learn: [
            "Runner design: load dataset → run system → score → aggregate → report.",
            "Deterministic scorers first: exact match, contains, regex, JSON field match, numeric tolerance.",
            "Aggregation: overall score, per-category score, pass/fail counts.",
            "Concurrency and cost control when running 30 cases repeatedly.",
            "Result storage: one JSON per run, timestamped, committed — this is your history."
          ],
          build: [
            "npm run eval → runs the set, prints a table, writes evals/runs/<timestamp>.json.",
            "Per-category breakdown in the output.",
            "Make it fast enough that you'll actually run it (parallel, cached where safe)."
          ],
          done: "One command gives you a score in under two minutes." },
        { title: "LLM-as-judge",
          learn: [
            "When you need it: open-ended output where no deterministic scorer works.",
            "Judge prompt design: explicit criteria, a scoring rubric, few-shot examples of each score.",
            "Known failure modes: position bias, verbosity bias, self-preference, score clustering at 7/10.",
            "Mitigations: pairwise comparison instead of absolute scores, randomised order, a stronger judge model.",
            "Calibration: you must check the judge against your own labels."
          ],
          build: [
            "A judge scorer with a rubric for your task.",
            "Hand-label 15 outputs yourself, then compare against the judge.",
            "Find three cases where the judge is wrong and write down why."
          ],
          done: "You know your judge's agreement rate with you, and its three failure modes." },
        { title: "RAG and generation metrics",
          learn: [
            "Retrieval metrics: recall@k, precision@k, MRR, nDCG — what each tells you and when.",
            "Generation metrics: groundedness (is it supported by the context), faithfulness (no invention), relevance (does it answer).",
            "Why to separate them: a perfect generator can't fix bad retrieval, and vice versa.",
            "Implementing groundedness: claim extraction, then verification against retrieved spans.",
            "Where the numbers mislead: small datasets, cherry-picked queries, metric gaming."
          ],
          build: [
            "Implement at least two metrics as scorers in your runner.",
            "Add them to the per-category report."
          ],
          done: "npm run eval prints both a retrieval-style and a generation-style metric." },
        { title: "Agent evals",
          learn: [
            "What to score in an agent: final answer, tool choice, trajectory, steps taken, cost per task.",
            "Trajectory evaluation: exact path vs any valid path — why exact-match is usually wrong.",
            "Counting the expensive failures: wrong tool, right answer by luck, infinite-ish loops.",
            "Safety evals: did it try a write action it shouldn't have?",
            "Cost and latency as first-class metrics, not afterthoughts."
          ],
          build: [
            "An agent eval set for Mini-project 3: 15 tasks with expected tool usage.",
            "Scorers for task success, tool-choice correctness, average steps, average cost."
          ],
          done: "You can state your agent's success rate and cost per task." },
        { title: "Baseline and eval hygiene",
          learn: [
            "The discipline: one change → one eval run → one logged delta. Never bundle changes.",
            "Baselines: what to record, and why a number without a date and a commit hash is useless.",
            "Regression gates: fail the run if the score drops more than X.",
            "Overfitting to your own eval set, and why the held-out slice exists."
          ],
          build: [
            "npm run eval finalised, with a committed evals/BASELINE.md: date, commit, score per metric, cost, latency.",
            "A results table in the README that you'll extend for the rest of the plan."
          ],
          done: "Your baseline numbers are recorded in git." }
      ]
    },
    {
      n: 5, title: "Project 1: RAG, build it", minutes: 80, dates: "Thu 29 Oct – Wed 4 Nov",
      free: "Catch up. The golden set is worth extra time.",
      job: "Build the outreach machine — 80–100 startups, enriched contacts, template written.",
      sessions: [
        { title: "Pipeline design",
          learn: [
            "The full pipeline: ingest → parse → chunk → embed → store → retrieve → rerank → generate → cite.",
            "Where quality is actually won: parsing and chunking, not the model.",
            "When RAG is wrong: small corpora (just use the context window), structured data (use SQL), frequently-changing facts (use an API).",
            "Corpus analysis: document count, size distribution, structure, update frequency.",
            "Success criteria decided now, before you can fool yourself later."
          ],
          build: [
            "Corpus downloaded locally, counted, sampled — read 5 documents yourself.",
            "A written pipeline design and a DESIGN.md with your success criteria.",
            "Postgres schema draft: documents, chunks, embeddings, queries."
          ],
          done: "Corpus is on disk and the schema is written down." },
        { title: "pgvector",
          learn: [
            "pgvector basics: the vector type, dimensions, operators (<->, <=>, <#>) and which matches cosine.",
            "Indexes: HNSW vs IVFFlat — build time, memory, recall, and when to add the index (after bulk load).",
            "Tuning: m, ef_construction, ef_search for HNSW; lists and probes for IVFFlat.",
            "Storage maths: rows × dimensions × 4 bytes, and why dimension choice is a cost decision.",
            "Filtering + vector search together, and why naive WHERE can wreck your index performance."
          ],
          build: [
            "pgvector extension, tables, and a migration you can re-run.",
            "Embedding model chosen and written into DESIGN.md with the reason.",
            "Insert 100 test vectors and run a similarity query with EXPLAIN to confirm the index is used."
          ],
          done: "A similarity query returns sensible results and the query plan shows an index scan." },
        { title: "Ingestion",
          learn: [
            "PDF is not a text format: layout, columns, tables, headers/footers, scanned pages.",
            "Parsers and their trade-offs; when OCR is unavoidable.",
            "DOCX, HTML, Markdown: structure you can keep (headings, lists, tables) instead of flattening.",
            "Cleaning: boilerplate removal, de-hyphenation, whitespace, encoding issues.",
            "Metadata worth keeping: source, page, section path, date, version, permissions."
          ],
          build: [
            "ingest/ with a parser per format behind one interface.",
            "Normalised output: {text, metadata: {source, page, section, ...}}.",
            "Run it over the full corpus, log failures and skipped files to a report.",
            "Manually inspect 5 parsed documents against the originals."
          ],
          done: "The corpus is parsed, and you've eyeballed 5 outputs for quality." },
        { title: "Chunking v1",
          learn: [
            "Why chunk at all: embedding dilution on long text, context limits, citation precision.",
            "Fixed-size + overlap: choosing size and overlap, counting in tokens not characters.",
            "Boundaries that matter: sentences, paragraphs, headings, tables — never split mid-table.",
            "Metadata per chunk: parent document, section path, position, previous/next ids.",
            "Contextual chunk enrichment: prefixing a chunk with its document title and section path."
          ],
          build: [
            "Chunker v1: token-based, fixed size + overlap, respecting paragraph boundaries.",
            "Full metadata attached, including a section path.",
            "Chunk the corpus, embed in batches with retry, store in pgvector.",
            "Print the distribution: chunk count, token size histogram, largest and smallest."
          ],
          done: "The whole corpus is chunked, embedded and queryable." },
        { title: "Retrieval v1",
          learn: [
            "Top-K: choosing k, and the recall/noise trade-off.",
            "Similarity thresholds and why an absolute cutoff is usually a trap.",
            "De-duplication of near-identical chunks.",
            "Diversity: MMR, so you don't return five chunks from the same page.",
            "Latency budget: embed query + search + rerank + generate."
          ],
          build: [
            "search(query, k, filters) returning chunks with scores and metadata.",
            "De-duplication and simple diversity.",
            "A CLI to query interactively and print the retrieved chunks — you'll live in this tool for two weeks."
          ],
          done: "You can query from the CLI and see relevant chunks with their sources." },
        { title: "RAG golden set + baseline", project: true,
          learn: [
            "Building a retrieval golden set: questions with known source spans.",
            "Question mix: factual lookup, multi-hop, comparison, negative (answer isn't in the corpus).",
            "Why negative cases matter most: \"I don't know\" is a correct answer.",
            "Annotating source spans without going insane: annotate from the chunks you have.",
            "recall@k and MRR, implemented against your own dataset."
          ],
          build: [
            "30 questions with annotated source chunk ids, in evals/rag.jsonl.",
            "Retrieval scorers wired into the Week 4 runner.",
            "Record the baseline: recall@5, recall@10, MRR, latency, cost per query, in BASELINE.md."
          ],
          done: "Your RAG baseline number is committed." }
      ]
    },
    {
      n: 6, title: "Project 1: make it measurably better", minutes: 80, dates: "Thu 5 – Wed 11 Nov",
      rule: "One change → one eval run → one row in the improvement table.",
      free: "Post Project 1 with the numbers.",
      job: "From now on: 10 targeted outreaches per week, every week.",
      sessions: [
        { title: "Generation with citations",
          learn: [
            "Context assembly: ordering chunks, token budget, what to do when the best chunks don't fit.",
            "Lost-in-the-middle: why putting the best chunk last (or first) changes answers.",
            "Citation design: chunk ids in context, forcing the model to cite, validating that cited ids exist.",
            "Refusal behaviour: teaching it to answer \"not in the provided documents\".",
            "Answer quality scoring with your Week 4 groundedness metric."
          ],
          build: [
            "answer(query): retrieve → assemble → generate with inline citations → validate citations resolve.",
            "An API + simple UI showing the answer with clickable sources.",
            "Score answers; log groundedness and refusal rate."
          ],
          done: "Every answer carries citations that resolve to real spans, and the score is logged." },
        { title: "Better chunking",
          learn: [
            "Structure-aware chunking: split on headings and sections, not on character counts.",
            "Semantic chunking: split where embedding similarity drops.",
            "Parent-document retrieval: embed small chunks, return the larger parent for context.",
            "Table and code handling — keep them whole.",
            "Re-indexing cost, and why the embedding bill decides how often you experiment."
          ],
          build: [
            "Chunker v2 (structure-aware, or parent-document), behind a config flag so v1 still runs.",
            "Re-embed, re-run evals, log the delta."
          ],
          done: "The improvement table has its first row, win or loss." },
        { title: "Hybrid search",
          learn: [
            "Why vectors alone fail: exact terms, IDs, acronyms, rare names, negation.",
            "BM25/keyword search in Postgres: tsvector, tsquery, GIN indexes, ranking.",
            "Fusion: weighted score combination vs Reciprocal Rank Fusion, and why RRF avoids score-normalisation pain.",
            "Tuning the blend and how to do it without overfitting your 30 questions."
          ],
          build: [
            "Full-text search column + GIN index alongside the vector index.",
            "RRF to merge both result lists.",
            "Re-run evals, log the delta. Note which question categories improved."
          ],
          done: "Hybrid search is measured against baseline, and you know where it helps." },
        { title: "Reranking",
          learn: [
            "Bi-encoder vs cross-encoder: why reranking is more accurate and much slower.",
            "The pattern: retrieve 20–50 cheaply → rerank → keep top 3–5.",
            "Reranker options: hosted rerank APIs vs a local cross-encoder vs LLM reranking.",
            "Latency and cost maths — reranking is usually the biggest single quality win and your biggest latency add."
          ],
          build: [
            "A rerank step with a configurable candidate count.",
            "Measure quality and p50/p95 latency at k=10, 20, 50.",
            "Re-run evals, log the delta with the latency cost stated."
          ],
          done: "You can state the quality gain per millisecond added." },
        { title: "Query rewriting and filtering",
          learn: [
            "Why raw user queries retrieve badly: pronouns, missing context, multi-part questions.",
            "Techniques: query expansion, decomposition into sub-queries, HyDE (hypothetical answer embedding).",
            "Conversational rewriting: resolving \"what about the second one?\" against history.",
            "Metadata filtering: date ranges, document type, version — and filtering before vs after the vector search.",
            "The cost: every rewrite is an extra LLM call in the critical path."
          ],
          build: [
            "A rewrite step (expansion or decomposition — pick one) behind a flag.",
            "Metadata filters wired into search().",
            "Re-run evals, log both deltas. Drop whatever doesn't earn its latency."
          ],
          done: "Both changes are measured, and at least one is deleted if it didn't help." },
        { title: "Cache, harden, deploy", project: true,
          learn: [
            "Caching layers: query embeddings, full result sets, LLM responses — and correct invalidation.",
            "Semantic caching: matching near-identical queries, and its false-hit risk.",
            "Production basics you already know, applied here: auth, per-user rate limits, request size caps, abuse of an expensive endpoint.",
            "Deployment shape: API + worker + Postgres, health checks, migrations.",
            "The README that gets you interviews: problem, architecture diagram, improvement table, what you'd do next."
          ],
          build: [
            "Redis caching for embeddings and repeat queries; measure the latency change.",
            "Auth, rate limiting, error handling. Deploy to a real URL.",
            "README with the full baseline → final improvement table, and a demo GIF.",
            "Open source it."
          ],
          done: "Live URL + public repo + the improvement table. This table is the single most interview-useful artifact in the plan." }
      ]
    },
    {
      n: 7, title: "Project 2: an agent that does real work", minutes: 80, dates: "Thu 12 – Wed 18 Nov",
      free: "Revise or extend.",
      sessions: [
        { title: "Design",
          learn: [
            "Choosing a task worth automating: repetitive, tool-heavy, tolerant of a review step.",
            "Read vs write actions, and which require human confirmation.",
            "Architecture: reuse the Week 3 loop; what changes for a real workload.",
            "Failure design: what happens when it's half-done, and how a user recovers.",
            "Permission model: who can run it, against whose data, with what scope."
          ],
          build: [
            "DESIGN.md: goal, tools, stop conditions, permission model, failure/recovery plan.",
            "Project scaffolded on the Week 3 agent core."
          ],
          done: "The design names every write action and its confirmation rule." },
        { title: "Real tools",
          learn: [
            "Tool design for real systems: granularity (one fat tool vs many small), idempotency, pagination.",
            "Writing good tool descriptions — the model's only documentation.",
            "Authentication and scoping per tool; least privilege.",
            "Dry-run mode and confirmation flows for destructive actions.",
            "Rate limits and quotas of the APIs behind your tools."
          ],
          build: [
            "3–5 real tools for your task, Zod-validated arguments, scoped credentials.",
            "At least one write action with a dry-run + confirmation path.",
            "Unit tests for each tool, independent of the LLM."
          ],
          done: "Every tool works and is tested without the agent involved." },
        { title: "RAG as a tool",
          learn: [
            "Retrieval as a tool the agent chooses, vs retrieval always run up front.",
            "Designing the tool signature so the agent queries well (filters, k, scope).",
            "Passing citations through the agent to the final answer.",
            "Latency: retrieval inside a loop multiplies, so cache aggressively."
          ],
          build: [
            "Project 1's search exposed as an agent tool (internal API or shared package).",
            "Citations preserved from retrieval → agent → final answer.",
            "Test a task that genuinely needs both a tool call and retrieval."
          ],
          done: "The agent answers a question using RAG plus at least one other tool, with sources." },
        { title: "Long-term memory",
          learn: [
            "What deserves to persist: stable preferences and facts, not transcripts.",
            "Extraction: deciding what to save at the end of a run.",
            "Storage and retrieval: key-value for preferences, vector search for episodic recall.",
            "Conflict and staleness: newer wins, plus an update path.",
            "Privacy: what you must not store, and user-visible deletion."
          ],
          build: [
            "A memory store with write (post-run extraction) and read (pre-run injection).",
            "Proof: teach it a preference in run 1, see it applied in run 2."
          ],
          done: "A preference from a previous run measurably changes the next run's behaviour." },
        { title: "Agent evals + baseline",
          learn: [
            "Re-apply Week 4: task success, tool choice, trajectory, steps, cost per task.",
            "Building the set from real runs rather than imagination.",
            "Flakiness: running each case 3× and reporting the variance, because agents are non-deterministic.",
            "Deciding your ship gate: the score below which a change doesn't go out."
          ],
          build: [
            "15–20 agent eval tasks with expected tool usage.",
            "Runner extended for multi-run variance.",
            "Record the baseline: success rate, avg steps, avg cost, p95 latency."
          ],
          done: "The agent baseline is committed." },
        { title: "Guardrails",
          learn: [
            "Prompt injection in agents: the real risk is a tool result containing instructions.",
            "Defences: treating tool output as data, delimiting it, instruction hierarchy, never letting retrieved text choose a tool.",
            "Input validation: size, type, rate; output validation: schema, PII, leakage of system prompt or credentials.",
            "Tool permission scoping and human-in-the-loop for destructive actions.",
            "Sandboxing anything that executes code or touches the filesystem."
          ],
          build: [
            "An input guard and an output guard around the loop.",
            "Tool results wrapped as untrusted data, explicitly.",
            "Confirmation required for every write action outside dry-run."
          ],
          done: "Guardrails are in place and your eval score didn't drop because of them." }
      ]
    },
    {
      n: 8, title: "Project 2: production", minutes: 80, dates: "Thu 19 – Wed 25 Nov",
      free: "Post the red-team failure mode you found, plus your cost/latency before-and-after.",
      sessions: [
        { title: "Red-team your own agent",
          learn: [
            "Attack surface: user input, retrieved documents, tool outputs, memory.",
            "Classic attacks: instruction override, data exfiltration via a tool, privilege escalation across tools, poisoned documents in your own corpus.",
            "Denial-of-wallet: making an agent burn money in a loop.",
            "Writing an attack suite you can re-run as a regression test."
          ],
          build: [
            "10+ attack cases, including a poisoned document planted in the RAG corpus.",
            "Run them all, record which succeed.",
            "Fix what breaks. Re-run. Add the suite to npm run eval."
          ],
          done: "Every attack you found either fails or is documented as an accepted risk." },
        { title: "Observability",
          learn: [
            "What to trace: every LLM call, tool call, retrieval, nested inside one run trace.",
            "Langfuse (or equivalent): traces, spans, sessions, users, scores.",
            "The metrics that matter: cost per request, tokens per step, p50/p95 latency, error rate, steps per task.",
            "Linking eval scores to traces so a bad score is one click from its trace.",
            "Sampling and PII redaction before anything leaves your service."
          ],
          build: [
            "Langfuse wired through the whole agent, with nested spans.",
            "A dashboard showing cost/request, latency percentiles, success rate.",
            "Eval scores pushed as trace scores."
          ],
          done: "You can open a failed run and see every step, token and dollar it spent." },
        { title: "Prompt versioning tied to scores",
          learn: [
            "Prompt registry with versions; deploying a prompt without deploying code.",
            "Tying a version to an eval run: every version has a score, a date and a commit.",
            "A/B and shadow evaluation before promotion.",
            "Rollback: the reason this whole discipline exists."
          ],
          build: [
            "Versioned prompts, with the active version in config.",
            "An eval report per version, stored and comparable.",
            "Prove a rollback works end to end."
          ],
          done: "You can name the best-scoring prompt version and switch to it without a deploy." },
        { title: "Async processing",
          learn: [
            "Why long agent runs don't belong in an HTTP request.",
            "BullMQ: queues, workers, concurrency, retries, backoff, dead-letter handling.",
            "Job design: idempotency keys, progress updates, partial results.",
            "Reporting progress to the client: polling vs SSE vs webhook.",
            "Worker scaling and the provider rate limit you'll hit first."
          ],
          build: [
            "POST /runs enqueues and returns an id; a worker executes the agent; results land in Postgres.",
            "Progress streamed to the UI.",
            "Retries with a cap, and a dead-letter queue you can inspect."
          ],
          done: "A 3-minute agent run completes reliably with visible progress." },
        { title: "Model routing, cost and latency",
          learn: [
            "Routing strategies: by step type, by difficulty classification, escalate-on-failure.",
            "Cheap model for extraction/classification/routing; strong model for planning and final answers.",
            "Measuring the saving properly: cost per successful task, not cost per call.",
            "Latency levers: TTFT, streaming the final answer, parallel tool calls, prompt caching.",
            "The trade-off curve: quality vs cost vs latency, and how to present it to a founder."
          ],
          build: [
            "A router with per-step model configuration.",
            "Parallel execution of independent tool calls.",
            "Prompt caching for the stable system prefix.",
            "Measure before/after: cost per task, p50/p95 latency, success rate. Table it."
          ],
          done: "You have a real \"we cut cost X% at the same success rate\" number." },
        { title: "Deploy", project: true,
          learn: [
            "Containerising an API + worker; environment and secrets handling.",
            "Deployment on AWS (ECS/Fargate or EC2), health checks, logs, alarms.",
            "Cost controls in production: per-user caps, global kill switch.",
            "The README that converts: problem, architecture diagram, eval table, cost/latency table, security notes, \"what I'd do with another month\"."
          ],
          build: [
            "Docker Compose for local, deployed API + worker + Postgres + Redis.",
            "Health checks, structured logs, alerting on error rate and spend.",
            "README finished, demo GIF recorded, repo open sourced."
          ],
          done: "Someone else can run a real task on your live agent." }
      ]
    },
    {
      n: 9, title: "Interview prep", minutes: 80, dates: "Thu 26 Nov – Wed 2 Dec",
      free: "Review: what shipped, what it measures, what you're worth. Then keep the outreach running.",
      sessions: [
        { title: "System design: chat at scale", learnLabel: "Cover, out loud, timed",
          learn: [
            "Requirements and scale assumptions; streaming, history, multi-tenancy.",
            "Architecture: gateway, conversation service, model router, cache, storage.",
            "Context management at scale; token and cost accounting per tenant.",
            "Reliability: provider outages, fallbacks, rate limits, queueing.",
            "Cost: caching, routing, truncation, and what you'd measure."
          ],
          build: ["Record yourself for 20 minutes, then rewatch and note every \"umm, I think\"."],
          done: "" },
        { title: "System design: enterprise RAG", learnLabel: "Cover",
          learn: [
            "100k documents, 10k users, RBAC: permission-aware retrieval and why post-filtering leaks.",
            "Ingestion at scale: pipelines, incremental updates, deletions, re-embedding on model change.",
            "Index choice and sharding; multi-tenant isolation.",
            "Freshness, versioned documents, audit trails.",
            "Evaluation and monitoring in production, plus per-tenant cost."
          ],
          build: ["A one-page written answer you can reuse, plus the diagram."],
          done: "" },
        { title: "System design: agent platform", learnLabel: "Cover",
          learn: [
            "Multi-tenant agent execution: sandboxing, timeouts, resource limits.",
            "Tool registry and permissions; secrets per tenant.",
            "Orchestration: queues, workers, long-running state, resumability.",
            "Observability and debugging someone else's failed run.",
            "Cost control, abuse prevention, human-in-the-loop."
          ],
          build: ["The diagram, and the three trade-offs you'd raise unprompted."],
          done: "" },
        { title: "The stock questions, cold", learnLabel: "Prepare crisp answers (2–3 min each)",
          learn: [
            "RAG vs fine-tuning vs prompting — when each, and cost/latency/maintenance of each.",
            "How do you evaluate an LLM system — your actual story, with your numbers.",
            "How do you stop hallucinations — grounding, citations, refusal, validation, evals.",
            "When would you not use an agent.",
            "Walk me through your hardest bug in these two projects.",
            "What would you do with another month on this."
          ],
          build: ["Write each answer in 5 bullets and say it out loud until it's not recited."],
          done: "" },
        { title: "Work-trial readiness",
          learn: [
            "Many startups run a paid 1–2 day trial instead of a whiteboard.",
            "What they're watching: how fast you orient in an unfamiliar codebase, how you ask questions, how you communicate progress."
          ],
          build: [
            "Pick an unfamiliar open-source repo. In 80 minutes: build it, run tests, ship a small PR-sized change.",
            "Write the PR description as if a reviewer you respect will read it."
          ],
          done: "You've done it once, timed, and know your weak step." },
        { title: "Mock interview + close the gaps", project: true,
          learn: [],
          build: [
            "A mock in English, on video, with someone harsh — ideally an engineer, not a friend.",
            "30 min system design + 20 min project deep-dive + 10 min feedback.",
            "List every gap it exposed and fix the top three the same session."
          ],
          done: "The feedback list is written and the top three are closed." }
      ]
    }
  ],

  jobTrack: [
    { id: "jt4", label: "Week 4 — set up once", fromWeek: 4, items: [
      "Work at a Startup profile, fully filled — founders reach out through it directly",
      "GitHub profile README leading with shipped systems, not a tech-stack list",
      "X/LinkedIn bio: \"AI + full-stack engineer, ex-[company], YC hackathon\"",
      "CV rewritten around systems shipped and outcomes measured"
    ]},
    { id: "jt5", label: "Week 5 — build the machine", fromWeek: 5, items: [
      "80–100 YC AI startups hiring Product Engineer / FDE / AI Engineer",
      "Founder + eng-lead contacts enriched (your Apollo workflow)",
      "Template: 3 lines — what you built, live link, one specific observation about their product",
      "YC hackathon contacts reactivated"
    ]},
    { id: "jt6", label: "Week 6 onward — run it", fromWeek: 6, items: [
      "10 targeted outreaches per week. Not 100 applications",
      "Every India-eligible remote YC listing, as it appears",
      "Log every response and rejection reason"
    ]},
    { id: "jtp", label: "Ship in public — one post per week from Week 4", fromWeek: 4, items: [
      "Week 4 — what you built in three weeks, with eval numbers",
      "Week 6 — Project 1 live, with the improvement table",
      "Week 8 — the red-team failure mode, and cost/latency before-and-after"
    ]}
  ],

  cut: "Linear algebra, calculus, probability, scikit-learn, PyTorch training loops, fine-tuning mechanics, quantization, vLLM internals, voice AI, browser agents, multi-agent systems. Python only if one service needs it.",

  honestNote: "The nine weeks build the evidence. The outreach converts it. Do every build week perfectly and treat the Job Track as a footnote, and you finish with two excellent repos and no offers — the most common way this plan fails. The Job Track starting in Week 4 is not optional, and it's the part you're already better equipped for than almost anyone you're competing against."
};
